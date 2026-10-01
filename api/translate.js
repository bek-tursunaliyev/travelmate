// POST /api/translate { to, texts: [...] } → { translations: [...] }
// Translates site content (tour descriptions, guide bios, offer tags, …) into the visitor's language.
// Every text is translated once per language and kept in Postgres, so later visitors get it instantly.
import { createHash } from 'node:crypto'
import { sql } from './_lib/db.js'
import { translateTexts } from './_lib/translate.js'

const LANGS = ['en', 'uz', 'ru', 'zh', 'es', 'fr', 'de', 'ar', 'hi', 'pt', 'ja', 'ko', 'tr', 'it', 'kk']
const MAX_TEXTS = 80
const MAX_LEN = 3000

const hash = (text) => createHash('sha1').update(text).digest('hex')

let ready
function ensureTable() {
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS translations (
      lang       text        NOT NULL,
      hash       text        NOT NULL,
      text       text        NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (lang, hash)
    )`.catch((err) => {
    ready = undefined
    throw err
  })
  return ready
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const to = String(body?.to || '')
  const texts = Array.isArray(body?.texts) ? body.texts : null
  if (!LANGS.includes(to) || !texts || texts.length > MAX_TEXTS || texts.some((t) => typeof t !== 'string' || t.length > MAX_LEN)) {
    return Response.json({ error: 'Send { to, texts } with up to 80 short texts' }, { status: 400 })
  }

  const keys = texts.map(hash)
  const found = new Map()
  let cacheOk = true
  try {
    await ensureTable()
    const rows = await sql`SELECT hash, text FROM translations WHERE lang = ${to} AND hash = ANY(${[...new Set(keys)]})`
    rows.forEach((r) => found.set(r.hash, r.text))
  } catch {
    cacheOk = false // still translate, just without the cache
  }

  const missing = [...new Set(keys.filter((k) => !found.has(k)))]
  if (missing.length) {
    const sources = missing.map((k) => texts[keys.indexOf(k)])
    let results = []
    try {
      results = await translateTexts(sources, to)
    } catch {
      results = []
    }
    const fresh = []
    missing.forEach((k, i) => {
      if (typeof results[i] === 'string') {
        found.set(k, results[i])
        fresh.push([k, results[i]])
      }
    })
    if (cacheOk && fresh.length) {
      try {
        await sql`
          INSERT INTO translations (lang, hash, text)
          SELECT ${to}, h, t FROM unnest(${fresh.map((f) => f[0])}::text[], ${fresh.map((f) => f[1])}::text[]) AS x(h, t)
          ON CONFLICT DO NOTHING`
      } catch { /* cache write is best-effort */ }
    }
  }

  // Untranslatable texts come back as null; the page keeps the original for those.
  return Response.json({ translations: keys.map((k) => found.get(k) ?? null) }, { headers: { 'Cache-Control': 'no-store' } })
}
