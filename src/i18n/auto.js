// Automatic translation of site content (tours, guide bios, offer tags, descriptions…).
// The admin writes each text once, in any language; visitors see it in their own language.
// Texts are requested in batches from /api/translate (which caches them in the database) and kept
// in this browser per language, so a text is fetched at most once per visitor.
import { useCallback, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

const STORE_PREFIX = 'tm_at_'
const MAX_STORED = 1500 // texts per language kept in localStorage
const FLUSH_MS = 40
const BATCH = 60

const memory = new Map() // lang → Map(source → translation)
const pending = new Map() // lang → Set(source)
const failed = new Set() // `${lang}\n${source}` that could not be translated this session
let timer = null
let version = 0
const listeners = new Set()

function cacheFor(lang) {
  if (!memory.has(lang)) {
    let stored = {}
    try { stored = JSON.parse(localStorage.getItem(STORE_PREFIX + lang)) || {} } catch { /* private mode */ }
    memory.set(lang, new Map(Object.entries(stored)))
  }
  return memory.get(lang)
}

function persist(lang) {
  try {
    const entries = [...cacheFor(lang)].slice(-MAX_STORED)
    localStorage.setItem(STORE_PREFIX + lang, JSON.stringify(Object.fromEntries(entries)))
  } catch { /* quota or private mode */ }
}

function notify() {
  version += 1
  listeners.forEach((l) => l())
}

async function flush() {
  timer = null
  const jobs = [...pending]
  pending.clear()
  for (const [lang, set] of jobs) {
    const texts = [...set]
    for (let i = 0; i < texts.length; i += BATCH) {
      const chunk = texts.slice(i, i + BATCH)
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: lang, texts: chunk }),
        })
        const data = res.ok ? await res.json() : null
        const cache = cacheFor(lang)
        chunk.forEach((src, n) => {
          const out = data?.translations?.[n]
          if (typeof out === 'string') cache.set(src, out)
          else failed.add(`${lang}\n${src}`)
        })
        persist(lang)
      } catch {
        chunk.forEach((src) => failed.add(`${lang}\n${src}`))
      }
      notify()
    }
  }
}

function request(lang, text) {
  if (failed.has(`${lang}\n${text}`)) return
  if (!pending.has(lang)) pending.set(lang, new Set())
  pending.get(lang).add(text)
  timer ??= setTimeout(flush, FLUSH_MS)
}

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getVersion = () => version

/**
 * Returns `at(text)`: the text in the current site language. Until the translation arrives the
 * original is shown. Proper names (hotels, people, brands) should not be passed through it.
 */
export function useAutoText() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage || 'en'
  const v = useSyncExternalStore(subscribe, getVersion, getVersion)
  return useCallback(
    (text) => {
      if (typeof text !== 'string' || !text.trim()) return text
      const cache = cacheFor(lang)
      if (cache.has(text)) return cache.get(text)
      request(lang, text)
      return text
    },
    // `v` makes the function change when new translations land, so memoised children re-render.
    [lang, v], // eslint-disable-line react-hooks/exhaustive-deps
  )
}

/**
 * Text of a per-language field ({ en, uz, ru, … } or a plain string) in the current language:
 * an explicit translation wins; otherwise the field is translated automatically.
 */
export function useLocalizedText() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage || 'en'
  const at = useAutoText()
  return useCallback(
    (value) => {
      if (value == null) return ''
      if (typeof value !== 'object') return at(String(value))
      if (value[lang]) return value[lang]
      const source = value.en || value.uz || value.ru || Object.values(value).find(Boolean) || ''
      return at(source)
    },
    [lang, at],
  )
}
