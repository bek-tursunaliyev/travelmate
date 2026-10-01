import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAutoText } from '../i18n/auto'
import {
  FaArrowLeft, FaStar, FaCheckCircle, FaSlidersH, FaTimes, FaUserTie, FaPlus, FaCheck,
  FaMapMarkerAlt, FaClock, FaBalanceScale, FaMinus,
} from 'react-icons/fa'
import { PageHero } from './Places'
import NotFound from './NotFound'
import Price from '../components/Price'
import { guides, guideById, guideCities, guideLanguages, guideDurations, MAX_GROUP } from '../data/guides'
import { offers } from '../data/services'
import { useBook, useFormat } from '../hooks'

const SORTS = ['rating', 'price', 'reviews']
const MAX_COMPARE = 3
const COMPARE_KEY = 'tm_compare_guides'

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2)

function Avatar({ guide, size = 'md' }) {
  return <span className={`g-avatar g-avatar--${size}`} aria-hidden="true">{initials(guide.name)}</span>
}

function Rating({ guide }) {
  const f = useFormat()
  return (
    <span className="g-rating">
      <FaStar /> <b>{guide.rating}</b> <small>({f.number(guide.reviews)})</small>
    </span>
  )
}

function useLanguageName() {
  const { i18n } = useTranslation()
  const lng = i18n.resolvedLanguage || 'en'
  return (code) => {
    try {
      return new Intl.DisplayNames([lng], { type: 'language' }).of(code)
    } catch {
      return code.toUpperCase()
    }
  }
}

/* ------------------------------ Compare (kept for the session) ------------------------------ */

function useCompare() {
  const [ids, setIds] = useState(() => {
    try {
      return (JSON.parse(sessionStorage.getItem(COMPARE_KEY)) || []).filter((id) => guideById[id])
    } catch {
      return []
    }
  })
  useEffect(() => {
    try { sessionStorage.setItem(COMPARE_KEY, JSON.stringify(ids)) } catch { /* private mode */ }
  }, [ids])
  const toggle = (id) =>
    setIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : list.length < MAX_COMPARE ? [...list, id] : list))
  return { ids, toggle, clear: () => setIds([]) }
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  // Portal to <body>: the header's backdrop-filter would otherwise trap position:fixed.
  return createPortal(
    <div className="g-modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="g-modal__box" onClick={(e) => e.stopPropagation()}>
        <div className="g-modal__head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

function CompareTable({ ids, onRemove }) {
  const { t } = useTranslation()
  const langName = useLanguageName()
  const list = ids.map((id) => guideById[id])
  const best = {
    price: Math.min(...list.map((g) => g.price)),
    rating: Math.max(...list.map((g) => g.rating)),
  }
  const rows = [
    ['price', (g) => <Price usd={g.price} className={g.price === best.price ? 'is-best' : ''} />],
    ['rating', (g) => <span className={g.rating === best.rating ? 'is-best' : ''}><FaStar className="g-star" /> {g.rating}</span>],
    ['reviews', (g) => g.reviews],
    ['experience', (g) => t('guides.yearsShort', { count: g.years })],
    ['languages', (g) => g.languages.map(langName).join(', ')],
    ['response', (g) => t('guides.respondsIn', { count: g.responds })],
  ]
  return (
    <div className="g-compare__scroll">
      <table className="g-compare">
        <thead>
          <tr>
            <th />
            {list.map((g) => (
              <th key={g.id}>
                <Avatar guide={g} size="sm" />
                <strong>{g.name}</strong>
                <small>{t(`guides.cities.${g.city}`)}</small>
                <button className="g-compare__remove" onClick={() => onRemove(g.id)} aria-label={t('guides.remove')}><FaTimes /></button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, render]) => (
            <tr key={key}>
              <th scope="row">{t(`guides.fields.${key}`)}</th>
              {list.map((g) => <td key={g.id}>{render(g)}</td>)}
            </tr>
          ))}
          <tr>
            <th />
            {list.map((g) => (
              <td key={g.id}><Link to={`/guides/${g.id}`} className="btn btn--primary btn--sm">{t('guides.viewProfile')}</Link></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function CompareBar({ compare, onOpen }) {
  const { t } = useTranslation()
  if (!compare.ids.length) return null
  const ready = compare.ids.length >= 2
  return (
    <div className="g-comparebar" role="region" aria-label={t('guides.compareTitle')}>
      <div className="g-comparebar__people">
        {compare.ids.map((id) => <Avatar key={id} guide={guideById[id]} size="sm" />)}
      </div>
      <span className="g-comparebar__text">
        {ready ? t('guides.compareCount', { count: compare.ids.length }) : t('guides.compareHint')}
      </span>
      <button className="btn btn--primary btn--sm" disabled={!ready} onClick={onOpen}>
        <FaBalanceScale /> {t('guides.compare')}
      </button>
      <button className="icon-btn" onClick={compare.clear} aria-label={t('guides.clear')}><FaTimes /></button>
    </div>
  )
}

/* ------------------------------ /guides ------------------------------ */

function GuideCard({ guide, selected, compareFull, onCompare }) {
  const { t } = useTranslation()
  const at = useAutoText()
  const disabled = !selected && compareFull
  return (
    <article className="g-card">
      <Link to={`/guides/${guide.id}`} className="g-card__head">
        <Avatar guide={guide} />
        <span className="g-card__who">
          <strong>
            {guide.name}
            {guide.verified && <FaCheckCircle className="g-verified" title={t('guides.verified')} />}
          </strong>
          <small><FaMapMarkerAlt /> {t(`guides.cities.${guide.city}`)} · {t('guides.yearsShort', { count: guide.years })}</small>
        </span>
      </Link>

      <div className="g-card__meta">
        <Rating guide={guide} />
        <span className="g-langs">{guide.languages.map((l) => l.toUpperCase()).join(' · ')}</span>
      </div>

      <p className="g-card__bio">{at(guide.bio)}</p>

      <div className="g-card__foot">
        <span className="g-card__price">
          <Price usd={guide.price} unit={t('guides.perHour')} />
        </span>
        <div className="g-card__actions">
          <button
            className={`g-compare-btn ${selected ? 'is-on' : ''}`}
            onClick={() => onCompare(guide.id)}
            disabled={disabled}
            aria-pressed={selected}
            title={disabled ? t('guides.compareMax') : t('guides.compare')}
          >
            {selected ? <FaCheck /> : <FaPlus />} <span>{t('guides.compare')}</span>
          </button>
          <Link to={`/guides/${guide.id}`} className="btn btn--primary btn--sm">{t('guides.viewProfile')}</Link>
        </div>
      </div>
    </article>
  )
}

export function GuidesPage() {
  const { t } = useTranslation()
  const langName = useLanguageName()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const compare = useCompare()

  // Filters live in the URL so a search can be shared and survives "back" from a profile.
  const city = guideCities.includes(params.get('city')) ? params.get('city') : ''
  const lang = guideLanguages.includes(params.get('lang')) ? params.get('lang') : ''
  const verified = params.get('verified') === '1'
  const sort = SORTS.includes(params.get('sort')) ? params.get('sort') : 'rating'

  const update = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }
  const clearFilters = () => update({ lang: '', verified: '' })
  const extraFilters = (lang ? 1 : 0) + (verified ? 1 : 0)

  const results = guides
    .filter((g) => (!city || g.city === city) && (!lang || g.languages.includes(lang)) && (!verified || g.verified))
    .sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'reviews' ? b.reviews - a.reviews : b.rating - a.rating))

  return (
    <>
      <PageHero title={t('guides.title')} subtitle={t('guides.subtitle')} photo="Po-i-Kalyan">
        <Link to="/#services" className="back-link"><FaArrowLeft className="flip-rtl" /> {t('services.all')}</Link>
      </PageHero>

      <section className="section section--flush g-page">
        <div className="container">
          {/* Step 1: destination */}
          <div className="g-where">
            <span className="g-where__label">{t('guides.where')}</span>
            <div className="g-where__options" role="radiogroup" aria-label={t('guides.where')}>
              {['', ...guideCities].map((c) => (
                <button
                  key={c || 'all'}
                  role="radio"
                  aria-checked={city === c}
                  className={`g-seg ${city === c ? 'is-active' : ''}`}
                  onClick={() => update({ city: c })}
                >
                  {c ? t(`guides.cities.${c}`) : t('guides.allCities')}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: results toolbar; extra filters stay collapsed until asked for */}
          <div className="g-toolbar">
            <p className="g-toolbar__count" aria-live="polite">
              {city
                ? t('guides.countIn', { count: results.length, city: t(`guides.cities.${city}`) })
                : t('guides.count', { count: results.length })}
            </p>
            <label className="g-sort">
              <span className="hide-xs">{t('guides.sortLabel')}</span>
              <select value={sort} onChange={(e) => update({ sort: e.target.value === 'rating' ? '' : e.target.value })}>
                {SORTS.map((s) => <option key={s} value={s}>{t(`guides.sort.${s}`)}</option>)}
              </select>
            </label>
            <button
              className={`g-filter-btn ${filtersOpen || extraFilters ? 'is-active' : ''}`}
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="guide-filters"
            >
              <FaSlidersH /> <span className="hide-xs">{t('guides.filters')}</span>
              {extraFilters > 0 && <span className="g-filter-btn__badge">{extraFilters}</span>}
            </button>
          </div>

          {filtersOpen && (
            <div className="g-filters" id="guide-filters">
              <div className="g-filters__group">
                <span>{t('guides.fields.languages')}</span>
                <div className="chips">
                  {guideLanguages.map((l) => (
                    <button
                      key={l}
                      className={`g-chip ${lang === l ? 'is-active' : ''}`}
                      aria-pressed={lang === l}
                      onClick={() => update({ lang: lang === l ? '' : l })}
                    >
                      {langName(l)}
                    </button>
                  ))}
                </div>
              </div>
              <label className="g-toggle">
                <input type="checkbox" checked={verified} onChange={(e) => update({ verified: e.target.checked ? '1' : '' })} />
                <span>{t('guides.verifiedOnly')}</span>
              </label>
              {extraFilters > 0 && <button className="g-link" onClick={clearFilters}>{t('guides.clear')}</button>}
            </div>
          )}

          {results.length === 0 ? (
            <div className="empty-state g-empty">
              <FaUserTie />
              <h2>{t('guides.emptyTitle')}</h2>
              <p>{t('guides.emptyText')}</p>
              <div className="g-empty__actions">
                {extraFilters > 0 && <button className="btn btn--primary" onClick={clearFilters}>{t('guides.clear')}</button>}
                {city && (
                  <button className={`btn ${extraFilters ? 'btn--outline' : 'btn--primary'}`} onClick={() => update({ city: '' })}>
                    {t('guides.emptyAllCities')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="g-grid">
              {results.map((g) => (
                <GuideCard
                  key={g.id}
                  guide={g}
                  selected={compare.ids.includes(g.id)}
                  compareFull={compare.ids.length >= MAX_COMPARE}
                  onCompare={compare.toggle}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CompareBar compare={compare} onOpen={() => setCompareOpen(true)} />
      {compareOpen && compare.ids.length >= 2 && (
        <Modal title={t('guides.compareTitle')} onClose={() => setCompareOpen(false)}>
          <CompareTable ids={compare.ids} onRemove={compare.toggle} />
        </Modal>
      )}
    </>
  )
}

/* ------------------------------ /guides/:id ------------------------------ */

const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function BookingCard({ guide }) {
  const { t } = useTranslation()
  const book = useBook()
  const f = useFormat()
  // Read the clock once per mount; default to tomorrow.
  const [today] = useState(() => isoDate(new Date()))
  const [date, setDate] = useState(() => isoDate(new Date(Date.now() + 864e5)))
  const [hours, setHours] = useState(guideDurations[0])
  const [people, setPeople] = useState(1)
  // Private tour: the hourly rate covers the whole group.
  const total = guide.price * hours
  const valid = date >= today

  return (
    <aside className="g-book" id="book">
      <div className="g-book__rate">
        <Price usd={guide.price} unit={t('guides.perHour')} />
      </div>

      <label className="g-book__field">
        <span>{t('guides.book.date')}</span>
        <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
      </label>

      <div className="g-book__field">
        <span>{t('guides.book.duration')}</span>
        <div className="g-book__durations" role="radiogroup" aria-label={t('guides.book.duration')}>
          {guideDurations.map((h) => (
            <button
              key={h}
              role="radio"
              aria-checked={hours === h}
              className={`g-seg ${hours === h ? 'is-active' : ''}`}
              onClick={() => setHours(h)}
            >
              {h === 8 ? t('guides.book.fullDay') : t('guides.book.hours', { count: h })}
            </button>
          ))}
        </div>
      </div>

      <div className="g-book__field">
        <span id="g-people-label">{t('guides.book.people')}</span>
        <div className="g-stepper" role="group" aria-labelledby="g-people-label">
          <button onClick={() => setPeople((n) => Math.max(1, n - 1))} disabled={people <= 1} aria-label={t('guides.book.fewer')}>
            <FaMinus />
          </button>
          <output aria-live="polite">{people}</output>
          <button onClick={() => setPeople((n) => Math.min(MAX_GROUP, n + 1))} disabled={people >= MAX_GROUP} aria-label={t('guides.book.more')}>
            <FaPlus />
          </button>
        </div>
        <small className="g-book__hint">{t('guides.book.groupHint', { count: MAX_GROUP })}</small>
      </div>

      <div className="g-book__total">
        <span>{t('guides.book.total')}</span>
        <Price usd={total} />
      </div>

      <button
        className="btn btn--primary btn--block"
        disabled={!valid}
        onClick={() =>
          book({
            id: `guide-${guide.id}-${date}`,
            name: guide.name,
            kind: 'guide',
            price: total,
            meta: `${f.date(date, { day: 'numeric', month: 'long' })} · ${t('guides.book.peopleCount', { count: people })}`,
          })
        }
      >
        {t('guides.book.cta')}
      </button>
      <p className="g-book__note"><FaCheckCircle /> {t('guides.book.note')}</p>
    </aside>
  )
}

export function GuideProfile() {
  const { id } = useParams()
  const { t } = useTranslation()
  const at = useAutoText()
  const f = useFormat()
  const langName = useLanguageName()
  const guide = guideById[id]
  if (!guide) return <NotFound />
  const tours = guide.tours.map((tid) => offers.guide.find((o) => o.id === tid)).filter(Boolean)

  return (
    <section className="section section--flush g-profile-page">
      <div className="container">
        <Link to={`/guides?city=${guide.city}`} className="g-back"><FaArrowLeft className="flip-rtl" /> {t('guides.back')}</Link>

        <div className="g-profile">
          <header className="g-profile__head">
            <Avatar guide={guide} size="lg" />
            <div>
              <h1>
                {guide.name}
                {guide.verified && <span className="g-badge"><FaCheckCircle /> {t('guides.verified')}</span>}
              </h1>
              <p className="g-profile__sub"><FaMapMarkerAlt /> {t(`guides.cities.${guide.city}`)}</p>
              <div className="g-profile__facts">
                <Rating guide={guide} />
                <span>{t('guides.yearsShort', { count: guide.years })}</span>
                <span><FaClock /> {t('guides.respondsIn', { count: guide.responds })}</span>
              </div>
            </div>
          </header>

          <BookingCard guide={guide} />

          <div className="g-profile__body">
            <h2>{t('guides.about')}</h2>
            <p>{at(guide.bio)}</p>

            <dl className="g-profile__list">
              <div>
                <dt>{t('guides.fields.languages')}</dt>
                <dd>{guide.languages.map(langName).join(', ')}</dd>
              </div>
              <div>
                <dt>{t('guides.topics')}</dt>
                <dd>{guide.topics.map((k) => t(`guides.topicNames.${k}`)).join(', ')}</dd>
              </div>
            </dl>

            {tours.length > 0 && (
              <>
                <h2>{t('guides.tours')}</h2>
                <ul className="g-tours">
                  {tours.map((o) => (
                    <li key={o.id}>
                      <div>
                        <strong>{o.name}</strong>
                        <small>{o.tags.map(at).join(' · ')} · <FaStar className="g-star" /> {o.rating} ({f.number(o.reviews)})</small>
                      </div>
                      <span className="g-tours__price"><Price usd={o.price} unit={t('common.per.person')} /></span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
