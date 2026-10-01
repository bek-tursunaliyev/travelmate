// POST /api/chat — TravelMate assistant.
// Uses Google Gemini when GEMINI_API_KEY is set, otherwise Vercel AI Gateway
// (AI_GATEWAY_API_KEY, or the project's OIDC token when deployed on Vercel).
import * as places from '../src/data/places.js'
import * as guideData from '../src/data/guides.js'
import * as tourData from '../src/data/tours.js'
import * as transferData from '../src/data/transfers.js'
import * as esimData from '../src/data/esim.js'
import { applyContent } from '../src/content/content.js'
import { readContent } from './_lib/store.js'

const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions'
const GATEWAY_MODEL = process.env.AI_MODEL || 'anthropic/claude-haiku-4.5'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
// Tried in order: a busy (429/5xx) model falls through to the next one.
const GEMINI_MODELS = process.env.GEMINI_MODEL
  ? [process.env.GEMINI_MODEL]
  : ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash']
const TIMEOUT_MS = 25000
const MAX_MESSAGES = 12
const MAX_CHARS = 1000

// Built per request so the assistant sees what the admin panel saved.
function buildSystem() {
  const { transferPrice } = transferData
  const airport = transferData.destinationById.airport
  const samarkand = transferData.destinationById.samarkand
  const guideList = guideData.guides.map((g) => `${g.name} (${g.city}, $${g.price}/h, ${(g.languages || []).join('/')}) → /guides/${g.id}`).join('; ')
  const tourList = tourData.tours.map((t) => `${t.title} — ${t.days} days, ${(t.route || []).join('–')}, from $${t.price}/person, by ${tourData.tourOperator(t).name} → /tours/${t.slug}`).join('\n')
  const transferList = transferData.vehicleClasses
    .map((v) => `${v.id} (${v.passengers} pax, ${v.luggage} bags)${airport ? `: airport $${transferPrice(v, airport)}` : ''}${samarkand ? `, Samarkand $${transferPrice(v, samarkand)}` : ''}`)
    .join('; ')
  const esimList = esimData.esimPlans.map((p) => `${esimData.esimOperatorById(p.operator)?.name || p.operator} ${p.gb ? `${p.gb} GB` : 'unlimited'} / ${p.days} days $${p.price}`).join('; ')
  const placeList = places.allPlaces.map((p) => `${p.name} (${p.country}) → /place/${p.list}/${p.slug}`).join('\n')
  const transferDestinations = transferData.transferDestinations

  return `You are TravelMate AI, the friendly travel assistant of the TravelMate website (Tashkent, Uzbekistan).\nTravelMate covers travel inside Uzbekistan only; for trips abroad say politely that the site focuses on Uzbekistan.
Help travelers plan trips, pick places and use TravelMate services. Keep answers short (2-6 sentences or a short list).
Write plain text: no Markdown headings or tables; start list items with "• ".
Always reply in the user's language (the site language code is given below).
Quote prices in US dollars first, then the so'm equivalent in brackets (1 USD ≈ 12 700 UZS), e.g. "$25 (≈ 317 500 UZS)".
Never show prices in Polish złoty (PLN, zł), even if asked; offer USD and UZS instead.

TravelMate services and typical prices:
- Accommodation (/services/accommodation): hotels from $35 to $180 per night — e.g. Silk Road Boutique, Bukhara $48; Registan Plaza, Samarkand $65.
- Local guides (/guides): pick a city, compare verified guides and book by the hour ($11–20/hour, 2 h, 4 h or full day). Tours $20–45 per person — e.g. Samarkand Old City walk $25.
  Guides: ${guideList}
- Taxi & transfers (/transfers): private car from Tashkent only, price per vehicle. Destinations: ${transferDestinations.map((d) => d.name).join(', ')}.
  Classes: ${transferList}. Choose a vehicle, then enter date, time and contact details.
- Food & dining (/services/food): meals $6–18 — Besh Qozon plov center $6.
- Currency exchange (/services/exchange): 0% commission desks; live converter on the page.
- eSIM (/esim): Uzbekistan-only data plans from local operators, installed by QR code. Plans: ${esimList}.
- Tickets (/tickets): buses & Afrosiyob trains, domestic flights between regions of Uzbekistan, cinema and events with venue maps.
- Tour packages (/tours): multi-day packages by local tour operators; request free, operator confirms in 24 h, 30% deposit, balance 14 days before start. Sample prices.
  Packages:
${tourList}
- Places & attractions (/places): landmarks, cities and regions of Uzbekistan.
- Rent a car (/services/rentcar): Chevrolet Cobalt $30/day up to Land Cruiser $150/day.
Bookings require an account (email or Google sign-in). Support line: +998 91 655 01 12 (24/7).

Places with their pages:
${placeList}

When you recommend a page, mention its path (like /places or /place/landmarks/registan). Do not invent services TravelMate does not offer.`
}

async function askGemini(key, system, messages) {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    // Gemini counts its "thinking" against maxOutputTokens, so keep thinking low and the cap generous.
    generationConfig: { maxOutputTokens: 2048, thinkingConfig: { thinkingLevel: 'low' } },
  })
  for (const model of GEMINI_MODELS) {
    const res = await fetch(`${GEMINI_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }).catch(() => null)
    if (!res) continue
    if (!res.ok) {
      if (res.status === 429 || res.status >= 500 || res.status === 404) continue
      return null
    }
    const data = await res.json()
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .filter((p) => typeof p.text === 'string' && !p.thought)
      .map((p) => p.text)
      .join('')
      .trim()
    if (text) return text
  }
  return null
}

async function askGateway(token, system, messages) {
  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: GATEWAY_MODEL, max_tokens: 500, messages: [{ role: 'system', content: system }, ...messages] }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  }).catch(() => null)
  if (!res?.ok) return null
  const data = await res.json()
  return data?.choices?.[0]?.message?.content?.trim() || null
}

export async function POST(request) {
  const geminiKey = process.env.GEMINI_API_KEY
  const gatewayToken = process.env.AI_GATEWAY_API_KEY || request.headers.get('x-vercel-oidc-token') || process.env.VERCEL_OIDC_TOKEN
  if (!geminiKey && !gatewayToken) return Response.json({ error: 'The assistant is not configured' }, { status: 503 })

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
  if (!messages.length || messages.at(-1).role !== 'user') {
    return Response.json({ error: 'A user message is required' }, { status: 400 })
  }
  const lang = typeof body.lang === 'string' ? body.lang.slice(0, 5) : 'en'

  try {
    applyContent(await readContent())
  } catch { /* fall back to built-in data */ }
  const system = `${buildSystem()}\n\nSite language: ${lang}`
  const reply = geminiKey ? await askGemini(geminiKey, system, messages) : await askGateway(gatewayToken, system, messages)
  if (!reply) return Response.json({ error: 'The assistant is unavailable right now' }, { status: 502 })
  return Response.json({ reply })
}
