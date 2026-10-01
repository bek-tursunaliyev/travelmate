import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaLayerGroup, FaHandshake, FaTags,
  FaMapMarkerAlt, FaClock, FaCalendarAlt, FaChair, FaArrowRight, FaRoute,
} from 'react-icons/fa'
import { services, serviceHref } from '../data/services'
import { ticketCategories, tickets, ticketName, venueById } from '../data/tickets'
import Modal from './Modal'
import { famousPlaces, placePhoto } from '../data/places'
import { stats } from '../data/site'
import PlaceImage from './PlaceImage'
import { useBook, useCountUp, useFormat, useInView } from '../hooks'

const VenueMap = lazy(() => import('./VenueMap'))

export function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* ------------------------------ Services ------------------------------ */

export function ServiceCard({ service }) {
  const { t } = useTranslation()
  const Icon = service.icon
  return (
    <Link
      to={serviceHref(service.id)}
      className="svc"
      style={{ '--c': service.color }}
      title={t(`services.items.${service.id}.desc`)}
    >
      <span className="svc__icon"><Icon /></span>
      <span className="svc__name">{t(`services.items.${service.id}.title`)}</span>
    </Link>
  )
}

export function Services() {
  const { t } = useTranslation()
  return (
    <section className="section section--services" id="services">
      <div className="container">
        <SectionHeader eyebrow={t('nav.services')} title={t('services.title')} subtitle={t('services.subtitle')} />
        <div className="services-grid">
          {services.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Tickets ------------------------------ */

// Venue of a cinema/event ticket: a venue id from the admin panel, or inline fields from iTicket.
function ticketVenue(tk) {
  const v = venueById(tk.venue)
  if (v) return v
  if (tk.venueName) return { name: tk.venueName, city: tk.venueCity, address: '', lat: tk.lat, lng: tk.lng }
  return tk.venue ? { name: tk.venue, city: '', address: '' } : null
}

const hasCoords = (v) => v && Number.isFinite(Number(v.lat)) && Number.isFinite(Number(v.lng)) && v.lat !== '' && v.lng !== ''

function VenueDialog({ tk, venue, onClose, onBook }) {
  const { t } = useTranslation()
  const lat = Number(venue.lat)
  const lng = Number(venue.lng)
  const label = [venue.name, venue.city].filter(Boolean).join(', ')
  return (
    <Modal title={tk.title} onClose={onClose} wide>
      <div className="venue-dialog">
        <div className="venue-dialog__info">
          <p className="venue-dialog__name"><FaMapMarkerAlt /> {label}</p>
          {venue.address && <p className="venue-dialog__addr">{venue.address}</p>}
        </div>
        {hasCoords(venue) ? (
          <Suspense fallback={<div className="venue-map venue-map--loading" />}>
            <VenueMap lat={lat} lng={lng} label={label} />
          </Suspense>
        ) : (
          <p className="venue-dialog__nomap">{t('tickets.noMap')}</p>
        )}
        <div className="venue-dialog__actions">
          {hasCoords(venue) && (
            <>
              <a className="btn btn--outline btn--sm" href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noreferrer">
                <FaRoute /> Google Maps
              </a>
              <a className="btn btn--outline btn--sm" href={`https://yandex.uz/maps/?rtext=~${lat}%2C${lng}&rtt=auto`} target="_blank" rel="noreferrer">
                <FaRoute /> Yandex Maps
              </a>
            </>
          )}
          <button className="btn btn--primary btn--sm" onClick={onBook}>{t('tickets.book')}</button>
        </div>
      </div>
    </Modal>
  )
}

export function TicketItem({ tk, cat }) {
  const { t } = useTranslation()
  const f = useFormat()
  const book = useBook()
  const [mapOpen, setMapOpen] = useState(false)
  const isRoute = cat === 'bus' || cat === 'flights'
  const Icon = ticketCategories.find((c) => c.id === cat).icon
  const low = tk.seats <= 8
  const venue = isRoute ? null : ticketVenue(tk)
  const doBook = () => book({ id: tk.id, name: ticketName(tk), kind: cat, price: tk.price, meta: tk.date })

  return (
    <article className={`pass ${isRoute ? '' : 'pass--show'}`}>
      {!isRoute && (
        <div className="pass__poster">
          <PlaceImage wiki={tk.photo} alt="" width={330} />
        </div>
      )}
      <div className="pass__main">
        <div className="pass__top">
          <span className="pass__cat"><Icon /> {t(`tickets.categories.${cat}`)}</span>
          <span className="pass__date"><FaCalendarAlt /> {f.date(tk.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        </div>

        {isRoute ? (
          <div className="pass__route">
            <div>
              <strong>{tk.depart}</strong>
              <span>{tk.from}</span>
            </div>
            <div className="pass__line">
              <small>{tk.duration}</small>
              <span><Icon /></span>
            </div>
            <div className="pass__end">
              <strong>{tk.arrive}</strong>
              <span>{tk.to}</span>
            </div>
          </div>
        ) : (
          <div className="pass__show">
            <strong>{tk.title}</strong>
            {venue && (
              <button className="pass__venue" onClick={() => setMapOpen(true)}>
                <FaMapMarkerAlt /> {[venue.name, venue.city].filter(Boolean).join(', ')}
                <span className="pass__maplink">{t('tickets.mapRoute')}</span>
              </button>
            )}
          </div>
        )}

        <div className="pass__meta">
          {isRoute ? (
            <span>{t('tickets.carrier')}: <b>{tk.carrier}</b></span>
          ) : (
            <>
              <span><FaClock /> {tk.time}</span>
              {tk.hall && <span><FaChair /> {tk.hall}</span>}
              {tk.genre && <span className="pass__genre">{tk.genre}</span>}
            </>
          )}
        </div>
      </div>

      <div className="pass__stub">
        <small>{t('common.from')}</small>
        <strong>{f.money(tk.price)}</strong>
        <small className="price__uzs">≈ {f.uzs(tk.price)}</small>
        <small>{t('tickets.perPerson')}</small>
        {tk.seats > 0 && <span className={`pass__seats ${low ? 'is-low' : ''}`}>{t('tickets.seatsLeft', { count: tk.seats })}</span>}
        {tk.url ? (
          <a className="btn btn--primary btn--sm" href={tk.url} target="_blank" rel="noreferrer">{t('tickets.book')}</a>
        ) : (
          <button className="btn btn--primary btn--sm" onClick={doBook}>{t('tickets.book')}</button>
        )}
      </div>

      {mapOpen && venue && <VenueDialog tk={tk} venue={venue} onClose={() => setMapOpen(false)} onBook={doBook} />}
    </article>
  )
}

// Events come from iTicket when the integration is configured (see api/events.js),
// otherwise from the admin panel.
function useEvents() {
  const [remote, setRemote] = useState(null)
  useEffect(() => {
    let alive = true
    fetch('/api/events')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && Array.isArray(d?.events) && d.events.length && setRemote(d.events))
      .catch(() => {})
    return () => { alive = false }
  }, [])
  return remote
}

export function Tickets() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const remoteEvents = useEvents()
  const lists = { ...tickets, events: remoteEvents || tickets.events }
  const fromUrl = params.get('cat')
  // The category lives in the URL (/tickets?cat=flights) so it can be linked and shared.
  const cat = lists[fromUrl] ? fromUrl : 'bus'
  const choose = (id) => setParams({ cat: id }, { replace: true })

  return (
    <section className="section section--flush" id="tickets">
      <div className="container">
        <div className="tabs" role="tablist">
          {ticketCategories.map(({ id, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={cat === id}
              className={`tab ${cat === id ? 'is-active' : ''}`}
              onClick={() => choose(id)}
            >
              <Icon /> {t(`tickets.categories.${id}`)}
              <span className="tab__count">{(lists[id] || []).length}</span>
            </button>
          ))}
        </div>
        {cat === 'flights' && <p className="tickets-note">{t('tickets.domesticNote')}</p>}
        {cat === 'events' && remoteEvents && <p className="tickets-note">{t('tickets.fromIticket')}</p>}
        <div className="passes" key={cat}>
          {(lists[cat] || []).map((tk) => (
            <TicketItem key={tk.id} tk={tk} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Famous places ------------------------------ */

export function PlaceCard({ place, badge }) {
  const { t } = useTranslation()
  const href = `/place/${place.list}/${place.slug}`
  return (
    <article className="place-card place-card--explore">
      <Link to={href} className="place-card__media" tabIndex={-1} aria-hidden="true">
        <PlaceImage wiki={placePhoto(place)} alt={place.name} />
        {badge && <span className="place-card__rank">{badge}</span>}
      </Link>
      <div className="place-card__body">
        <h3>{place.name}</h3>
        <p><FaMapMarkerAlt /> {place.country}</p>
        <Link to={href} className="btn btn--primary btn--sm place-card__btn">
          {t('popular.explore')} <FaArrowRight className="flip-rtl" />
        </Link>
      </div>
    </article>
  )
}

// Full-bleed photo card with the place name over the image; the whole card is the link.
// `inert` cards are the carousel's duplicated half: visible, but skipped by keyboard and screen readers.
function ExperienceCard({ place, inert }) {
  return (
    <Link
      to={`/place/${place.list}/${place.slug}`}
      className="xp-card"
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert || undefined}
    >
      <PlaceImage wiki={placePhoto(place)} alt={place.name} width={640} />
      <span className="xp-card__text">
        <small>{place.country}</small>
        <strong>{place.name}</strong>
      </span>
    </Link>
  )
}

export function FamousPlaces() {
  const { t } = useTranslation()
  return (
    <section className="section" id="famous">
      <div className="container">
        <SectionHeader
          eyebrow={t('famous.eyebrow')}
          title={t('famous.title')}
          subtitle={t('famous.subtitle')}
          action={<Link to="/places" className="btn btn--outline">{t('subnav.viewAll')} <FaArrowRight className="flip-rtl" /></Link>}
        />
      </div>
      {/* Auto-scrolling strip: the list is rendered twice and the track slides by exactly one copy, so it loops seamlessly. */}
      <div className="marquee">
        <div className="marquee__track" style={{ '--marquee-duration': `${famousPlaces.length * 7}s` }}>
          {[0, 1].map((copy) =>
            famousPlaces.map((p) => (
              <ExperienceCard key={`${copy}-${p.slug}`} place={p} inert={copy === 1} />
            )),
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Why choose ------------------------------ */

const whyItems = [
  { key: 'allinone', icon: FaLayerGroup },
  { key: 'local', icon: FaHandshake },
  { key: 'prices', icon: FaTags },
]


function Stat({ stat, start }) {
  const { t } = useTranslation()
  const f = useFormat()
  const v = useCountUp(Number(stat.value) || 0, start, 1800)
  // A label typed in the admin panel wins over the translated default.
  return (
    <div className="stat">
      <strong>{f.number(v, Number(stat.digits) || 0)}{stat.suffix}</strong>
      <span>{stat.label || t(`why.stats.${stat.key}`)}</span>
    </div>
  )
}

export function WhyChoose() {
  const { t } = useTranslation()
  const [ref, inView] = useInView()
  return (
    <section className="section section--tint" id="why" ref={ref}>
      <div className="container">
        <SectionHeader eyebrow="TravelMate" title={t('why.title')} subtitle={t('why.subtitle')} />
        <div className="why-grid">
          {whyItems.map(({ key, icon: Icon }, i) => (
            <article key={key} className={`why ${inView ? 'is-in' : ''}`} style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="why__icon"><Icon /></span>
              <h3>{t(`why.items.${key}.title`)}</h3>
              <p>{t(`why.items.${key}.desc`)}</p>
            </article>
          ))}
        </div>
        <div className="stats">
          {stats.map((s) => <Stat key={s.key} stat={s} start={inView} />)}
        </div>
      </div>
    </section>
  )
}
