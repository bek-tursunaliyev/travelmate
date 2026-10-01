import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaSearch, FaFire, FaChartLine, FaHistory, FaMapMarkerAlt, FaTimes, FaTicketAlt, FaConciergeBell, FaTag, FaRoute,
} from 'react-icons/fa'
import { topSearches, trending, findPlace } from '../data/places'
import { searchAll } from '../data/search'
import { ticketName } from '../data/tickets'
import { serviceHref, hotelHref } from '../data/services'
import { useClickOutside } from '../hooks'
import PlaceImage from './PlaceImage'

const RECENT_KEY = 'tm_recent_searches'

const readRecent = () => {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || [] } catch { return [] }
}

export default function SearchBar({ initial = '', compact = false }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState(initial)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState(readRecent)
  const [shake, setShake] = useState(false)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  useClickOutside(wrapRef, useCallback(() => setOpen(false), []))

  // Quick suggestions while typing: up to 7 across all result types.
  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const r = searchAll(query, t)
    return [
      ...r.tours.map((tour) => ({ key: `tr-${tour.slug}`, icon: FaRoute, label: tour.title, sub: `${t('services.items.tours.title')} · ${tour.days} d`, to: `/tours/${tour.slug}` })),
      ...r.places.map((p) => ({ key: `p-${p.list}-${p.slug}`, icon: FaMapMarkerAlt, label: p.name, sub: p.country, to: `/place/${p.list}/${p.slug}` })),
      ...r.services.map((s) => ({ key: `s-${s.id}`, icon: FaConciergeBell, label: t(`services.items.${s.id}.title`), sub: t('search.services'), to: serviceHref(s.id) })),
      ...r.tickets.map((tk) => ({ key: `t-${tk.id}`, icon: FaTicketAlt, label: ticketName(tk, i18n.resolvedLanguage), sub: t(`tickets.categories.${tk.cat}`), to: `/tickets?cat=${tk.cat}` })),
      ...r.offers.map((o) => ({ key: `o-${o.id}`, icon: FaTag, label: o.name, sub: `${t(`services.items.${o.service}.title`)} · ${o.location}`, to: o.service === 'accommodation' ? hotelHref(o) : serviceHref(o.service) })),
    ].slice(0, 7)
  }, [query, t, i18n.resolvedLanguage])

  const saveRecent = (q) => {
    const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5)
    setRecent(next)
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const runSearch = (q = query) => {
    const value = q.trim()
    if (!value) {
      setShake(true)
      setTimeout(() => setShake(false), 450)
      inputRef.current?.focus()
      setOpen(true)
      return
    }
    saveRecent(value)
    setOpen(false)
    setQuery(value)
    inputRef.current?.blur()
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  const go = (item) => {
    saveRecent(item.label)
    setOpen(false)
    navigate(item.to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % suggestions.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1)) }
    if (e.key === 'Enter' && active >= 0 && open) { e.preventDefault(); go(suggestions[active]) }
  }

  const clearRecent = () => {
    setRecent([])
    localStorage.removeItem(RECENT_KEY)
  }

  const hasQuery = query.trim().length > 0

  return (
    <div className={`search ${compact ? 'search--compact' : ''} ${open ? 'is-open' : ''}`} ref={wrapRef}>
      <form
        className={`search__form ${shake ? 'shake' : ''}`}
        role="search"
        onSubmit={(e) => { e.preventDefault(); runSearch() }}
      >
        <FaSearch className="search__icon" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={t('hero.placeholder')}
          onChange={(e) => { setQuery(e.target.value); setActive(-1); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label={t('hero.placeholder')}
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
        />
        {hasQuery && (
          <button type="button" className="search__clear" onClick={() => { setQuery(''); inputRef.current?.focus() }} aria-label={t('hero.clear')}>
            <FaTimes />
          </button>
        )}
        <button type="submit" className="btn btn--accent search__btn">
          <FaSearch className="show-xs" />
          <span className="hide-xs">{t('hero.search')}</span>
        </button>
      </form>

      {open && (
        <div className="search__panel">
          {hasQuery ? (
            <>
              <p className="search__label">{t('hero.suggestions')}</p>
              {suggestions.length ? (
                <ul className="search__suggestions" role="listbox">
                  {suggestions.map((s, i) => (
                    <li key={s.key}>
                      <button
                        className={`search__suggestion ${i === active ? 'is-active' : ''}`}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(s)}
                        role="option"
                        aria-selected={i === active}
                      >
                        <span className="search__sicon"><s.icon /></span>
                        <span><strong>{s.label}</strong><small>{s.sub}</small></span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="search__empty">{t('hero.noSuggestions')}</p>
              )}
            </>
          ) : (
            <div className="search__grid">
              <div>
                {recent.length > 0 && (
                  <>
                    <div className="search__label search__label--row">
                      <span><FaHistory /> {t('hero.recent')}</span>
                      <button onClick={clearRecent}>{t('hero.clear')}</button>
                    </div>
                    <div className="chips">
                      {recent.map((r) => (
                        <button key={r} className="chip chip--muted" onClick={() => runSearch(r)}>{r}</button>
                      ))}
                    </div>
                  </>
                )}
                <p className="search__label"><FaFire /> {t('hero.topSearches')}</p>
                <div className="chips">
                  {topSearches.map((s) => (
                    <button key={s} className="chip" onClick={() => runSearch(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="search__label"><FaChartLine /> {t('hero.trending')}</p>
                <ul className="trending">
                  {trending.map(({ list, slug, growth }) => {
                    const p = findPlace(list, slug)
                    return (
                      <li key={slug}>
                        <button onClick={() => go({ label: p.name, to: `/place/${list}/${slug}` })}>
                          <PlaceImage wiki={p.wiki} alt={p.name} width={120} className="trending__img" />
                          <span className="trending__text"><strong>{p.name}</strong><small>{p.country}</small></span>
                          <span className="trending__growth">+{growth}%</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
