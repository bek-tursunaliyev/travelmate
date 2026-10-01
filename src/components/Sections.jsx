import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaMapMarkerAlt, FaClock, FaCalendarAlt, FaChair, FaArrowRight,
} from 'react-icons/fa'
import { services, serviceHref } from '../data/services'
import { localized, ticketCategories, tickets, venueById } from '../data/tickets'
import { famousPlaces, placePhoto } from '../data/places'
import PlaceImage from './PlaceImage'
import Price from './Price'
import Marquee from './Marquee'
import { useFormat } from '../hooks'


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
export function ticketVenue(tk) {
  const v = venueById(tk.venue)
  if (v) return v
  if (tk.venueName) return { name: tk.venueName, city: tk.venueCity, address: '', lat: tk.lat, lng: tk.lng }
  return tk.venue ? { name: tk.venue, city: '', address: '' } : null
}

// A ticket card; the whole card opens the ticket page where the booking happens.
export function TicketItem({ tk, cat }) {
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const f = useFormat()
  const isRoute = cat === 'bus' || cat === 'flights'
  const Icon = ticketCategories.find((c) => c.id === cat).icon
  const low = tk.seats > 0 && tk.seats <= 8
  const venue = isRoute ? null : ticketVenue(tk)
  const picture = tk.photo || tk.wiki

  return (
    <Link to={`/tickets/${cat}/${encodeURIComponent(tk.id)}`} className={`pass ${isRoute ? '' : 'pass--show'}`}>
      {!isRoute && (
        <div className="pass__poster">
          <PlaceImage wiki={picture} alt="" width={330} />
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
            <strong>{localized(tk.title, lng)}</strong>
            {venue && <span><FaMapMarkerAlt /> {[venue.name, venue.city].filter(Boolean).join(', ')}</span>}
          </div>
        )}

        <div className="pass__meta">
          {isRoute ? (
            <span>{t('tickets.carrier')}: <b>{tk.carrier}</b></span>
          ) : (
            <>
              <span><FaClock /> {(tk.times && tk.times.length > 1) ? tk.times.join(' · ') : tk.time}</span>
              {tk.hall && <span><FaChair /> {localized(tk.hall, lng)}</span>}
              {tk.genre && <span className="pass__genre">{localized(tk.genre, lng)}</span>}
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
        <span className="btn btn--primary btn--sm">{t('tickets.select')}</span>
      </div>
    </Link>
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
      <Marquee>
        {(copy) => famousPlaces.map((p) => <ExperienceCard key={`${copy}-${p.slug}`} place={p} inert={copy === 1} />)}
      </Marquee>
    </section>
  )
}

/* ------------------------------ FAQ ------------------------------ */

// Average spend of one traveller per day (USD, mid-range: 3–4★ hotel, cafés, taxis, entry tickets).
const cityCosts = [
  { key: 'tashkent', days: 3, hotel: 45, food: 20, transport: 8, sights: 10 },
  { key: 'samarkand', days: 3, hotel: 40, food: 18, transport: 6, sights: 15 },
  { key: 'bukhara', days: 2, hotel: 35, food: 15, transport: 5, sights: 12 },
  { key: 'khiva', days: 2, hotel: 35, food: 15, transport: 5, sights: 14 },
  { key: 'fergana', days: 2, hotel: 30, food: 14, transport: 7, sights: 8 },
]
const costParts = ['hotel', 'food', 'transport', 'sights']
const faqGroups = ['costs', 'site']

export function Faq() {
  const { t } = useTranslation()
  const [city, setCity] = useState(cityCosts[0].key)
  const [group, setGroup] = useState(faqGroups[0])
  const c = cityCosts.find((x) => x.key === city)
  const perDay = costParts.reduce((sum, k) => sum + c[k], 0)
  return (
    <section className="section section--tint" id="faq">
      <div className="container">
        <SectionHeader eyebrow="TravelMate" title={t('faq.title')} subtitle={t('faq.subtitle')} />
        <div className="faq">
          <aside className="faq-cost">
            <h3>{t('faq.costTitle')}</h3>
            <p className="faq-cost__note">{t('faq.costNote')}</p>
            <div className="chips faq-cost__cities">
              {cityCosts.map(({ key }) => (
                <button key={key} className={`chip ${key === city ? 'is-active' : 'chip--muted'}`} onClick={() => setCity(key)} aria-pressed={key === city}>
                  {t(`faq.cities.${key}`)}
                </button>
              ))}
            </div>
            <ul className="faq-cost__list">
              {costParts.map((k) => (
                <li key={k}><span>{t(`faq.parts.${k}`)}</span><Price usd={c[k]} /></li>
              ))}
            </ul>
            <div className="faq-cost__total">
              <div><span>{t('faq.perDay')}</span><Price usd={perDay} /></div>
              <div><span>{t('faq.perTrip', { count: c.days })}</span><Price usd={perDay * c.days} /></div>
            </div>
          </aside>
          <div className="faq-list">
            <div className="faq-tabs" role="tablist">
              {faqGroups.map((g) => (
                <button key={g} role="tab" aria-selected={g === group} className={g === group ? 'is-active' : ''} onClick={() => setGroup(g)}>
                  {t(`faq.groups.${g}`)}
                </button>
              ))}
            </div>
            {t(`faq.items.${group}`, { returnObjects: true }).map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
