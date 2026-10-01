// Machine translation through Google Translate's free web endpoint (no API key; the same endpoint
// the free npm translate libraries use). Used by /api/translate (content, cached in Postgres) and by
// scripts/i18n-fill.mjs (UI strings).

const ENDPOINT = 'https://translate.googleapis.com/translate_a/t'
const MAX_CHARS = 4500 // per request
const MAX_ITEMS = 60 // per request
const TIMEOUT_MS = 12000

// Our language codes → Google's where they differ.
const GOOGLE_CODE = { zh: 'zh-CN' }
export const googleLang = (lng) => GOOGLE_CODE[lng] || lng

// {{name}} placeholders are swapped for neutral tokens so they come back untouched.
function protect(text) {
  const vars = []
  const safe = text.replace(/\{\{\s*[\w.]+\s*\}\}/g, (m) => `[${vars.push(m) - 1}]`)
  return { safe, vars }
}
function restore(text, vars) {
  let out = text
  vars.forEach((v, i) => { out = out.replace(new RegExp(`\\[\\s*${i}\\s*\\]`), v) })
  // A lost placeholder would break the sentence; signal failure so the caller keeps the original.
  return vars.every((v) => out.includes(v)) ? out : null
}

async function request(texts, to, from) {
  const body = new URLSearchParams()
  texts.forEach((t) => body.append('q', t))
  const url = `${ENDPOINT}?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(googleLang(to))}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`translate ${res.status}`)
  const data = await res.json()
  // One text → a string or [text, lang]; several → an array of those.
  const list = texts.length === 1 && !Array.isArray(data[0]) && typeof data[0] !== 'string' ? [data] : data
  return (Array.isArray(list) ? list : [list]).map((item) => (Array.isArray(item) ? item[0] : item))
}

/**
 * Translates `texts` into `to`. `from` defaults to auto-detection, so content written in any
 * language works. Returns an array aligned with `texts`; null where a text could not be translated.
 */
export async function translateTexts(texts, to, from = 'auto') {
  const out = new Array(texts.length).fill(null)
  const prepared = texts.map((t) => protect(String(t ?? '')))
  let batch = []
  let size = 0
  const flush = async () => {
    if (!batch.length) return
    const items = batch
    batch = []
    size = 0
    const result = await request(items.map((i) => prepared[i].safe), to, from)
    items.forEach((i, n) => {
      const text = typeof result[n] === 'string' ? result[n] : null
      out[i] = text == null ? null : restore(text, prepared[i].vars)
    })
  }
  for (let i = 0; i < texts.length; i++) {
    if (!prepared[i].safe.trim()) { out[i] = texts[i]; continue }
    const len = prepared[i].safe.length
    if (batch.length >= MAX_ITEMS || size + len > MAX_CHARS) await flush()
    batch.push(i)
    size += len
  }
  await flush()
  return out
}
