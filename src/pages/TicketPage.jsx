import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAutoText, useLocalizedText } from '../i18n/auto'
import {
  FaArrowLeft, FaCalendarAlt, FaClock, FaChair, FaMinus, FaPlus, FaCheckCircle, FaExternalLinkAlt, FaUsers, FaLanguage,
} from 'react-icons/fa'
import { PageHero } from './Places'
import NotFound from './NotFound'
import Price from '../components/Price'
import PlaceImage from '../components/PlaceImage'
import LocationMap from '../components/LocationMap'
import { ticketVenue } from '../components/Sections'
import { ticketCategories, findTicket, ticketName } from '../data/tickets'
import { useBook, useFormat, useWiki } from '../hooks'

const routeHeroPhoto = { bus: 'Afrosiyob_(train)', flights: 'Tashkent_International_Airport' }
const MAX_TICKETS = 10

function Stepper({ value, max, onChange, label }) {
  const { t } = useTranslation()
  return (
    <div className="g-book__field">
      <span>{label}</span>
      <div className="g-stepper" role="group" aria-label={label}>
        <button onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label={t('guides.book.fewer')}><FaMinus /></button>
        <output aria-live="polite">{value}</output>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={t('guides.book.more')}><FaPlus /></button>
      </div>
    </div>
  )
}

function BookingBox({ tk, cat, time, children }) {
  const { t } = useTranslation()
  const lt = useLocalizedText()
  const f = useFormat()
  const book = useBook()
  const max = Math.max(1, Math.min(MAX_TICKETS, Number(tk.seats) || MAX_TICKETS))
  const [count, setCount] = useState(1)
  const total = Number(tk.price) * count
  const isRoute = cat === 'bus' || cat === 'flights'

  return (
    <aside className="g-book ticket-book">
      <div className="g-book__rate"><Price usd={Number(tk.price)} unit={t('tickets.perPerson')} /></div>
      {children}
      <Stepper value={count} max={max} onChange={setCount} label={isRoute ? t('tickets.passengers') : t('tickets.quantity')} />
      <div className="g-book__total"><span>{t('tickets.total')}</span><Price usd={total} /></div>
      <button
        className="btn btn--primary btn--block"
        onClick={() => book({
          id: `${tk.id}${time ? `-${time}` : ''}`,
          name: tk.title ? lt(tk.title) : ticketName(tk),
          kind: cat,
          price: total,
          meta: [f.date(tk.date, { day: 'numeric', month: 'long' }), time || tk.depart || tk.time, t('tickets.countLabel', { count })].filter(Boolean).join(' · '),
        })}
      >
        {t('tickets.book')}
      </button>
      {tk.seats > 0 && <p className="g-book__note"><FaCheckCircle /> {t('tickets.seatsLeft', { count: tk.seats })}</p>}
    </aside>
  )
}

// iTicket events (when the integration is on) are not in the admin content, so look them up remotely.
function useRemoteEvent(cat, id, local) {
  const [remote, setRemote] = useState(null)
  const [done, setDone] = useState(Boolean(local) || cat !== 'events')
  useEffect(() => {
    if (local || cat !== 'events') return undefined
    let alive = true
    fetch('/api/events').then((r) => r.json()).then((d) => {
      if (!alive) return
      setRemote((d.events || []).find((e) => e.id === id) || null)
      setDone(true)
    }).catch(() => alive && setDone(true))
    return () => { alive = false }
  }, [cat, id, local])
  return { remote, done }
}

export default function TicketPage() {
  const { cat, id } = useParams()
  const { t } = useTranslation()
  const lt = useLocalizedText()
  const at = useAutoText()
  const f = useFormat()
  const local = findTicket(cat, id)
  const { remote, done } = useRemoteEvent(cat, id, local)
  const tk = local || remote
  const { loading: wikiLoading, data: wiki } = useWiki(tk?.wiki)
  const [time, setTime] = useState(null)

  if (!ticketCategories.some((c) => c.id === cat)) return <NotFound />
  if (!tk) return done ? <NotFound /> : <div className="adm-loading">{t('common.loading')}</div>

  const Icon = ticketCategories.find((c) => c.id === cat).icon
  const back = <Link to={`/tickets?cat=${cat}`} className="back-link"><FaArrowLeft className="flip-rtl" /> {t(`tickets.categories.${cat}`)}</Link>

  /* ---------- Train, bus, flight ---------- */
  if (cat === 'bus' || cat === 'flights') {
    return (
      <>
        <PageHero title={`${tk.from} → ${tk.to}`} subtitle={`${tk.carrier} · ${f.date(tk.date, { weekday: 'long', day: 'numeric', month: 'long' })}`} photo={routeHeroPhoto[cat]}>
          {back}
        </PageHero>
        <section className="section section--flush">
          <div className="container ticket-layout">
            <div className="ticket-main">
              <div className="journey">
                <div><strong>{tk.depart}</strong><span>{tk.from}</span></div>
                <div className="journey__line"><small>{tk.duration}</small><span><Icon /></span></div>
                <div className="journey__end"><strong>{tk.arrive}</strong><span>{tk.to}</span></div>
              </div>
              <dl className="tour-facts ticket-facts">
                <div><FaCalendarAlt /><dt>{t('tickets.date')}</dt><dd>{f.date(tk.date, { weekday: 'short', day: 'numeric', month: 'short' })}</dd></div>
                <div><FaClock /><dt>{t('tickets.duration')}</dt><dd>{tk.duration}</dd></div>
                <div><Icon /><dt>{t('tickets.carrier')}</dt><dd>{tk.carrier}</dd></div>
                <div><FaUsers /><dt>{t('tickets.seats')}</dt><dd>{tk.seats}</dd></div>
              </dl>
              <p className="ticket-note">{cat === 'flights' ? t('tickets.flightNote') : t('tickets.trainNote')}</p>
            </div>
            <BookingBox tk={tk} cat={cat} />
          </div>
        </section>
      </>
    )
  }

  /* ---------- Cinema and events ---------- */
  const venue = ticketVenue(tk)
  const times = tk.times?.length ? tk.times : [tk.time].filter(Boolean)
  const chosen = time || (times.length === 1 ? times[0] : null) || tk.time
  const description = cat === 'cinema' ? at(wiki?.extract) : lt(tk.description)

  return (
    <section className="section section--flush ticket-show">
      <div className="container">
        {back}
        <div className="show-hero">
          <div className={`show-hero__poster ${cat === 'events' ? 'is-wide' : ''}`}>
            <PlaceImage wiki={tk.photo || tk.wiki} alt={lt(tk.title)} width={500} />
          </div>
          <div className="show-hero__info">
            <span className="pass__cat"><Icon /> {t(`tickets.categories.${cat}`)}</span>
            <h1>{lt(tk.title)}</h1>
            <ul className="show-hero__facts">
              {tk.genre && <li>{lt(tk.genre)}</li>}
              {tk.age && <li className="show-hero__age">{tk.age}</li>}
              {tk.lang && <li><FaLanguage /> {tk.lang}</li>}
              {tk.hall && <li><FaChair /> {lt(tk.hall)}</li>}
              <li><FaCalendarAlt /> {f.date(tk.date, { weekday: 'long', day: 'numeric', month: 'long' })}</li>
            </ul>
            {wikiLoading && cat === 'cinema' ? (
              <div className="skeleton-lines"><span /><span /><span /></div>
            ) : (
              description && <p className="show-hero__text">{description}</p>
            )}
            {cat === 'cinema' && wiki?.url && (
              <a className="source-link" href={wiki.url} target="_blank" rel="noreferrer">{t('place.source')} <FaExternalLinkAlt /></a>
            )}
          </div>
        </div>

        <div className="ticket-layout">
          <div className="ticket-main">
            {venue && (
              <>
                <h2 className="ticket-h2">{t('tickets.venueTitle')}</h2>
                <LocationMap name={venue.name} city={venue.city} address={venue.address} lat={venue.lat} lng={venue.lng} />
              </>
            )}
          </div>
          <BookingBox tk={tk} cat={cat} time={chosen}>
            {times.length > 0 && (
              <div className="g-book__field">
                <span>{cat === 'cinema' ? t('tickets.showtime') : t('tickets.time')}</span>
                <div className="showtimes" role="radiogroup" aria-label={t('tickets.showtime')}>
                  {times.map((x) => (
                    <button key={x} role="radio" aria-checked={chosen === x} className={`g-seg ${chosen === x ? 'is-active' : ''}`} onClick={() => setTime(x)}>{x}</button>
                  ))}
                </div>
              </div>
            )}
          </BookingBox>
        </div>
      </div>
    </section>
  )
}
