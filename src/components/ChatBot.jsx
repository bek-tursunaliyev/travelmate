import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaRobot, FaTimes, FaPaperPlane, FaRedo } from 'react-icons/fa'
import { searchAll } from '../data/search'
import { serviceHref } from '../data/services'
import { useFormat } from '../hooks'

const STORAGE_KEY = 'tm_chat'

function loadHistory() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveHistory(messages) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))) } catch { /* private mode */ }
}

// Offline answer built from the site's own data, used when /api/chat is unavailable.
function localReply(text, t, f) {
  if (/^\s*(hi|hello|hey|salom|assalom|привет|здравствуйте)\b/i.test(text)) return { text: t('chat.hello') }

  const words = text.split(/[\s,.!?]+/).filter((w) => w.length >= 3)
  const seen = new Set()
  const links = []
  const add = (key, to, label) => {
    if (seen.has(key) || links.length >= 5) return
    seen.add(key)
    links.push({ to, label })
  }
  for (const w of words) {
    const r = searchAll(w, t)
    r.places.forEach((p) => add(`p-${p.list}-${p.slug}`, `/place/${p.list}/${p.slug}`, `${p.name} · ${p.country}`))
    r.services.forEach((s) => add(`s-${s.id}`, serviceHref(s.id), t(`services.items.${s.id}.title`)))
    r.offers.forEach((o) =>
      add(`o-${o.id}`, serviceHref(o.service), o.price ? `${o.name} — ${f.money(o.price)} (≈ ${f.uzs(o.price)})` : o.name),
    )
  }
  return links.length ? { text: t('chat.found'), links } : { text: t('chat.noMatch') }
}

const SITE_PATH = /(\/(?:places|place\/[\w-]+\/[\w-]+|services\/[\w-]+|guides(?:\/[\w-]+)?|tours(?:\/[\w-]+)?|transfers|tickets)\b)/g

// Light formatting for model replies: "* item" bullets, **bold**, and site paths ("/guides/…") as links.
function RichText({ text }) {
  const clean = text.replace(/^\s*[*-]\s+/gm, '• ')
  return clean.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') && chunk.endsWith('**') ? (
      <strong key={i}>{chunk.slice(2, -2)}</strong>
    ) : (
      chunk.split(SITE_PATH).map((part, j) =>
        j % 2 ? <Link key={`${i}-${j}`} to={part}>{part}</Link> : <span key={`${i}-${j}`}>{part}</span>,
      )
    ),
  )
}

export default function ChatBot() {
  const { t, i18n } = useTranslation()
  const f = useFormat()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(loadHistory)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => saveHistory(messages), [messages])

  useEffect(() => {
    if (!open) return undefined
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, messages, busy])

  const send = async (raw) => {
    const text = raw.trim()
    if (!text || busy) return
    const history = [...messages, { role: 'user', text }]
    setMessages(history)
    setInput('')
    setBusy(true)
    let reply
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang: i18n.resolvedLanguage,
          messages: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      })
      const data = res.ok ? await res.json() : null
      reply = data?.reply ? { text: data.reply } : localReply(text, t, f)
    } catch {
      reply = localReply(text, t, f)
    }
    setMessages((m) => [...m, { role: 'assistant', ...reply }])
    setBusy(false)
  }

  const suggestions = t('chat.suggestions', { returnObjects: true })

  return (
    <div className={`chatbot ${open ? 'is-open' : ''}`}>
      {open && (
        <section className="chatbot__panel" role="dialog" aria-label={t('chat.title')}>
          <header className="chatbot__head">
            <span className="chatbot__avatar"><FaRobot /></span>
            <div>
              <strong>{t('chat.title')}</strong>
              <small>{t('chat.status')}</small>
            </div>
            {messages.length > 0 && (
              <button className="chatbot__icon" onClick={() => setMessages([])} aria-label={t('chat.reset')} title={t('chat.reset')}>
                <FaRedo />
              </button>
            )}
            <button className="chatbot__icon" onClick={() => setOpen(false)} aria-label={t('chat.close')}>
              <FaTimes />
            </button>
          </header>

          <div className="chatbot__list" ref={listRef} aria-live="polite">
            <div className="chat-msg chat-msg--assistant">{t('chat.greeting')}</div>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                {m.role === 'assistant' ? <RichText text={m.text} /> : m.text}
                {m.links && (
                  <div className="chat-msg__links">
                    {m.links.map((l) => <Link key={l.to + l.label} to={l.to}>{l.label}</Link>)}
                  </div>
                )}
              </div>
            ))}
            {busy && <div className="chat-msg chat-msg--assistant chat-msg--typing"><span /><span /><span /></div>}
            {messages.length === 0 && Array.isArray(suggestions) && (
              <div className="chatbot__suggest">
                {suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
              </div>
            )}
          </div>

          <form className="chatbot__form" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              maxLength={1000}
              aria-label={t('chat.placeholder')}
            />
            <button type="submit" disabled={!input.trim() || busy} aria-label={t('chat.send')}>
              <FaPaperPlane className="flip-rtl" />
            </button>
          </form>
        </section>
      )}

      <button className="chatbot__fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t('chat.close') : t('chat.open')}>
        {open ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  )
}
