import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Plus, Pencil, Trash2, ArrowUp, ArrowDown, Save, Undo2, LogOut, ExternalLink, Search, X, Check, RotateCcw, LayoutDashboard,
} from 'lucide-react'
import PlaceImage from '../components/PlaceImage'
import { groups, allSections } from '../admin/schema'
import { clone, defaultContent } from '../content/content'
import { adminLogout, isAdmin, saveContent } from '../content/admin'
import { useContent } from '../context/ContentContext'
import { useToast } from '../context/ToastContext'

const LANGS = ['uz', 'en', 'ru']

const getIn = (doc, path) => path.reduce((o, k) => (o ? o[k] : undefined), doc)
function setIn(doc, path, value) {
  const next = clone(doc)
  let o = next
  path.slice(0, -1).forEach((k) => { o[k] = o[k] ?? {}; o = o[k] })
  o[path.at(-1)] = value
  return next
}

const slugify = (s) => String(s || 'item').toLowerCase().normalize('NFD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').slice(0, 40) || 'item'
const newId = (base) => `${slugify(base)}-${Math.random().toString(36).slice(2, 6)}`

// Form value <-> stored value for the textarea-based types.
const toForm = (field, v) => {
  if (field.type === 'list') return (v || []).join('\n')
  if (field.type === 'pairs') return (v || []).map((p) => (Array.isArray(p) ? p.join(' | ') : p)).join('\n')
  if (field.type === 'i18n') return { uz: '', en: '', ru: '', ...(typeof v === 'string' ? { en: v } : v || {}) }
  if (field.type === 'bool') return Boolean(v)
  return v ?? ''
}
const fromForm = (field, v) => {
  if (field.type === 'list') return v.split('\n').map((x) => x.trim()).filter(Boolean)
  if (field.type === 'pairs') return v.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0]).map(([a, ...b]) => [a, b.join(' | ')])
  if (field.type === 'number') return v === '' ? '' : Number(v)
  if (field.type === 'i18n') return Object.fromEntries(Object.entries(v).filter(([, x]) => x.trim()))
  return v
}

function optionsOf(field, doc) {
  const raw = typeof field.options === 'function' ? field.options(doc) : field.options
  return raw.map((o) => (Array.isArray(o) ? o : [o, o]))
}

/* ------------------------------ Form ------------------------------ */

function FieldInput({ field, value, onChange, doc }) {
  const { t } = useTranslation()
  const id = `af-${field.k}`
  switch (field.type) {
    case 'textarea':
    case 'list':
    case 'pairs':
      return <textarea id={id} rows={field.type === 'textarea' ? 4 : 5} value={value} onChange={(e) => onChange(e.target.value)} />
    case 'number':
      return <input id={id} type="number" step={field.step || 1} value={value} onChange={(e) => onChange(e.target.value)} />
    case 'bool':
      return (
        <label className="adm-switch">
          <input id={id} type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
          <span>{value ? t('admin.yes') : t('admin.no')}</span>
        </label>
      )
    case 'select':
      return (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {optionsOf(field, doc).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      )
    case 'color':
      return (
        <div className="adm-color">
          <input id={id} type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} aria-label={field.k} />
        </div>
      )
    case 'image':
      return (
        <div className="adm-image">
          <input id={id} type="text" value={value} placeholder="https://… or Wikipedia_Title" onChange={(e) => onChange(e.target.value)} />
          {value && <div className="adm-image__preview"><PlaceImage wiki={value} alt="" width={330} /></div>}
        </div>
      )
    case 'i18n':
      return (
        <div className="adm-i18n">
          {LANGS.map((l) => (
            <label key={l}>
              <span>{l.toUpperCase()}</span>
              {field.long
                ? <textarea rows={2} value={value[l]} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
                : <input type="text" value={value[l]} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />}
            </label>
          ))}
        </div>
      )
    default:
      return <input id={id} type={field.type === 'date' || field.type === 'time' ? field.type : 'text'} value={value} onChange={(e) => onChange(e.target.value)} />
  }
}

function EditDrawer({ section, item, isNew, doc, onSave, onClose }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(() => Object.fromEntries(section.fields.map((f) => [f.k, toForm(f, item[f.k])])))
  const [touched, setTouched] = useState(false)

  const missing = section.fields.filter((f) => {
    if (!f.required) return false
    const v = form[f.k]
    return f.type === 'i18n' ? !Object.values(v).some((x) => x.trim()) : String(v ?? '').trim() === ''
  })

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (missing.length) return
    const next = { ...item }
    section.fields.forEach((f) => { next[f.k] = fromForm(f, form[f.k]) })
    onSave(next)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="adm-drawer" role="dialog" aria-modal="true" aria-label={t(`admin.s.${section.id}`)} onClick={onClose}>
      <form className="adm-drawer__panel" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <header>
          <h2>{isNew ? t('admin.add') : t('admin.edit')} · {t(`admin.s.${section.id}`)}</h2>
          <button type="button" className="adm-icon" onClick={onClose} aria-label={t('admin.cancel')}><X size={18} /></button>
        </header>
        <div className="adm-drawer__body">
          {section.fields.map((f) => (
            <div key={f.k} className={`adm-field ${touched && missing.includes(f) ? 'has-error' : ''}`}>
              <label htmlFor={`af-${f.k}`}>
                {t(`admin.f.${f.k}`, { defaultValue: f.k })}{f.required && ' *'}
              </label>
              <FieldInput field={f} value={form[f.k]} doc={doc} onChange={(v) => setForm((s) => ({ ...s, [f.k]: v }))} />
              {f.hint && <small>{t(`admin.hints.${f.hint}`)}</small>}
              {['list', 'pairs'].includes(f.type) && !f.hint && <small>{t(`admin.hints.${f.type}`)}</small>}
            </div>
          ))}
        </div>
        <footer>
          {touched && missing.length > 0 && <span className="adm-error">{t('admin.required')}</span>}
          <button type="button" className="btn btn--ghost-primary btn--sm" onClick={onClose}>{t('admin.cancel')}</button>
          <button type="submit" className="btn btn--primary btn--sm"><Check size={16} /> {t('admin.apply')}</button>
        </footer>
      </form>
    </div>
  )
}

/* ------------------------------ Table ------------------------------ */

function SectionTable({ section, doc, onChange }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // { item, index }
  const [confirm, setConfirm] = useState(null)
  const items = getIn(doc, section.path) || []
  const row = section.rowFor ? section.rowFor(doc) : section.row

  const visible = items
    .map((item, index) => ({ item, index, r: row(item) }))
    .filter(({ r }) => !query || `${r.title} ${r.sub}`.toLowerCase().includes(query.toLowerCase()))

  const write = (next) => onChange(setIn(doc, section.path, next))
  const move = (i, d) => {
    const next = [...items]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    write(next)
  }
  const save = (item) => {
    if (editing.index == null) write([...items, item])
    else write(items.map((x, i) => (i === editing.index ? item : x)))
    setEditing(null)
  }
  const add = () => {
    setEditing({ index: null, item: { [section.key]: newId(section.id) } })
  }
  const closeEditor = useCallback(() => setEditing(null), [])

  return (
    <div className="adm-section">
      <div className="adm-section__bar">
        <div className="adm-search">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('admin.search')} aria-label={t('admin.search')} />
        </div>
        <span className="adm-count">{t('admin.count', { count: items.length })}</span>
        <button className="btn btn--primary btn--sm" onClick={add}><Plus size={16} /> {t('admin.add')}</button>
      </div>
      {section.hint && <p className="adm-note">{t(`admin.hints.${section.hint}`)}</p>}

      {visible.length === 0 ? (
        <p className="adm-empty">{t('admin.empty')}</p>
      ) : (
        <ul className="adm-rows">
          {visible.map(({ item, index, r }) => (
            <li key={`${item[section.key]}-${index}`} className="adm-row">
              {r.image !== undefined && (
                <div className="adm-row__thumb">{r.image ? <PlaceImage wiki={r.image} alt="" width={160} /> : null}</div>
              )}
              <div className="adm-row__text">
                <strong>{r.title || <em>{t('admin.untitled')}</em>}</strong>
                {r.sub && <small>{r.sub}</small>}
              </div>
              {confirm === index ? (
                <div className="adm-row__confirm">
                  <span>{t('admin.confirmDelete')}</span>
                  <button className="btn btn--danger btn--sm" onClick={() => { write(items.filter((_, i) => i !== index)); setConfirm(null) }}>{t('admin.delete')}</button>
                  <button className="btn btn--ghost-primary btn--sm" onClick={() => setConfirm(null)}>{t('admin.cancel')}</button>
                </div>
              ) : (
                <div className="adm-row__actions">
                  <button className="adm-icon" disabled={index === 0 || query} onClick={() => move(index, -1)} aria-label={t('admin.up')} title={t('admin.up')}><ArrowUp size={16} /></button>
                  <button className="adm-icon" disabled={index === items.length - 1 || query} onClick={() => move(index, 1)} aria-label={t('admin.down')} title={t('admin.down')}><ArrowDown size={16} /></button>
                  <button className="adm-icon" onClick={() => setEditing({ item, index })} aria-label={t('admin.edit')} title={t('admin.edit')}><Pencil size={16} /></button>
                  <button className="adm-icon adm-icon--danger" onClick={() => setConfirm(index)} aria-label={t('admin.delete')} title={t('admin.delete')}><Trash2 size={16} /></button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditDrawer
          key={editing.index ?? 'new'}
          section={section}
          item={editing.item}
          isNew={editing.index == null}
          doc={doc}
          onSave={save}
          onClose={closeEditor}
        />
      )}
    </div>
  )
}

/* ------------------------------ Page ------------------------------ */

export default function AdminPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const { publish } = useContent()
  const [params, setParams] = useSearchParams()
  const [saved, setSaved] = useState(null) // last stored document (JSON string)
  const [doc, setDoc] = useState(null)
  const [busy, setBusy] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const sectionId = allSections.some((s) => s.id === params.get('s')) ? params.get('s') : allSections[0].id
  const section = allSections.find((s) => s.id === sectionId)
  const dirty = doc && saved !== null && JSON.stringify(doc) !== saved

  // Always edit the freshest stored copy (bypass the CDN cache).
  useEffect(() => {
    let alive = true
    fetch(`/api/content?fresh=${Date.now()}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { content: null }))
      .catch(() => ({ content: null }))
      .then(({ content }) => {
        if (!alive) return
        const base = { ...defaultContent(), ...(content || {}) }
        setDoc(base)
        setSaved(JSON.stringify(base))
      })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!dirty) return undefined
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const counts = useMemo(() => (doc ? Object.fromEntries(allSections.map((s) => [s.id, (getIn(doc, s.path) || []).length])) : {}), [doc])

  if (!isAdmin()) return <Navigate to="/login" state={{ from: '/admin' }} replace />

  const save = async () => {
    setBusy(true)
    try {
      const { updatedAt } = await saveContent(doc)
      const stored = { ...doc, updatedAt }
      setDoc(stored)
      setSaved(JSON.stringify(stored))
      publish(stored)
      toast(t('admin.saved'))
    } catch (err) {
      if (err.message === 'session') {
        toast(t('admin.sessionExpired'), 'error')
        navigate('/login', { state: { from: '/admin' } })
      } else {
        toast(`${t('admin.saveFailed')}: ${err.message}`, 'error')
      }
    } finally {
      setBusy(false)
    }
  }

  const logout = () => {
    adminLogout()
    navigate('/')
  }

  return (
    <div className="adm">
      <aside className="adm-side">
        <Link to="/admin" className="adm-brand"><LayoutDashboard size={18} /> TravelMate <span>Admin</span></Link>
        <nav aria-label={t('admin.sections')}>
          {groups.map((g) => (
            <div key={g.id} className="adm-group">
              <p>{t(`admin.g.${g.id}`)}</p>
              {g.sections.map((s) => (
                <button
                  key={s.id}
                  className={`adm-nav ${s.id === sectionId ? 'is-active' : ''}`}
                  onClick={() => setParams({ s: s.id })}
                  aria-current={s.id === sectionId ? 'page' : undefined}
                >
                  {t(`admin.s.${s.id}`)}
                  <span>{counts[s.id] ?? ''}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <label className="adm-mobile-nav">
          <span className="sr-only">{t('admin.sections')}</span>
          <select value={sectionId} onChange={(e) => setParams({ s: e.target.value })}>
            {groups.map((g) => (
              <optgroup key={g.id} label={t(`admin.g.${g.id}`)}>
                {g.sections.map((s) => <option key={s.id} value={s.id}>{t(`admin.s.${s.id}`)}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <div>
            <small>{t(`admin.g.${section.group}`)}</small>
            <h1>{t(`admin.s.${section.id}`)}</h1>
          </div>
          <div className="adm-top__actions">
            <a className="btn btn--ghost-primary btn--sm" href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> {t('admin.viewSite')}</a>
            <button className="btn btn--ghost-primary btn--sm" onClick={logout}><LogOut size={16} /> {t('admin.logout')}</button>
          </div>
        </header>

        {!doc ? (
          <div className="adm-loading" aria-busy="true">{t('common.loading')}</div>
        ) : (
          <SectionTable key={section.id} section={section} doc={doc} onChange={setDoc} />
        )}

        {doc && (
          <div className="adm-reset">
            {confirmReset ? (
              <>
                <span>{t('admin.resetConfirm')}</span>
                <button className="btn btn--danger btn--sm" onClick={() => { setDoc(defaultContent()); setConfirmReset(false) }}>{t('admin.reset')}</button>
                <button className="btn btn--ghost-primary btn--sm" onClick={() => setConfirmReset(false)}>{t('admin.cancel')}</button>
              </>
            ) : (
              <button className="adm-link" onClick={() => setConfirmReset(true)}><RotateCcw size={14} /> {t('admin.resetAll')}</button>
            )}
          </div>
        )}
      </div>

      <div className={`adm-savebar ${dirty ? 'is-visible' : ''}`} role="status" aria-live="polite">
        <span>{t('admin.unsaved')}</span>
        <button className="btn btn--ghost-primary btn--sm" onClick={() => setDoc(JSON.parse(saved))} disabled={busy}><Undo2 size={16} /> {t('admin.discard')}</button>
        <button className="btn btn--primary btn--sm" onClick={save} disabled={busy}><Save size={16} /> {busy ? t('admin.saving') : t('admin.save')}</button>
      </div>
    </div>
  )
}
