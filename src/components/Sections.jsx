import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaStar, FaCircle, FaLayerGroup, FaHandshake, FaTags, FaHeadset, FaLock, FaWifi,
  FaMapMarkerAlt, FaClock, FaCalendarAlt, FaChair, FaCrown,
} from 'react-icons/fa'
import { services, serviceById, serviceHref, offers, favorites } from '../data/services'
import { ticketCategories, tickets, ticketName, allTickets } from '../data/tickets'
import { useBook, useCountUp, useFormat, useInView } from '../hooks'

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

export function TicketItem({ tk, cat }) {
  const { t } = useTranslation()
  const f = useFormat()
  const book = useBook()
  const isRoute = cat === 'bus' || cat === 'flights'
  const Icon = ticketCategories.find((c) => c.id === cat).icon
  const low = tk.seats <= 8

  return (
    <article className="pass">
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
            <span><FaMapMarkerAlt /> {tk.venue}</span>
          </div>
        )}

        <div className="pass__meta">
          {isRoute ? (
            <span>{t('tickets.carrier')}: <b>{tk.carrier}</b></span>
          ) : (
            <>
              <span><FaClock /> {tk.time}</span>
              <span><FaChair /> {tk.hall}</span>
              <span className="pass__genre">{tk.genre}</span>
            </>
          )}
        </div>
      </div>

      <div className="pass__stub">
        <small>{t('common.from')}</small>
        <strong>{f.money(tk.price)}</strong>
        <small>{t('tickets.perPerson')}</small>
        <span className={`pass__seats ${low ? 'is-low' : ''}`}>{t('tickets.seatsLeft', { count: tk.seats })}</span>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => book({ id: tk.id, name: ticketName(tk), kind: cat, price: tk.price, meta: tk.date })}
        >
          {t('tickets.book')}
        </button>
      </div>
    </article>
  )
}

export function Tickets() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('cat')
  // The category lives in the URL (/tickets?cat=flights) so it can be linked and shared.
  const cat = tickets[fromUrl] ? fromUrl : 'bus'
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
              <span className="tab__count">{tickets[id].length}</span>
            </button>
          ))}
        </div>
        <div className="passes" key={cat}>
          {tickets[cat].map((tk) => (
            <TicketItem key={tk.id} tk={tk} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Favorites ------------------------------ */

function findOffer(fav) {
  if (fav.service === 'tickets') {
    const tk = allTickets.find((x) => x.id === fav.offerId)
    return { name: ticketName(tk), price: tk.price, cat: tk.cat }
  }
  return offers[fav.service].find((o) => o.id === fav.offerId)
}

function FavoriteCard({ fav, rank, start, bump }) {
  const { t } = useTranslation()
  const f = useFormat()
  const book = useBook()
  const offer = findOffer(fav)
  const service = serviceById[fav.service]
  const Icon = service.icon
  const value = useCountUp(fav.count + bump, start)
  const name = t(`favorites.items.${fav.key}`)
  const max = favorites[0].count + 200

  return (
    <article className="fav" style={{ '--c': service.color }}>
      <div className="fav__rank">{rank === 1 ? <FaCrown /> : `#${rank}`}</div>
      <span className="fav__icon"><Icon /></span>
      <span className="fav__service">{t(`services.items.${fav.service}.title`)}</span>
      <h3>{name}</h3>
      <div className="fav__count">
        <strong>{f.number(value)}</strong>
        <small>{t('favorites.bookings')}</small>
      </div>
      <div className="fav__bar"><span style={{ width: start ? `${Math.min(100, ((fav.count + bump) / max) * 100)}%` : 0 }} /></div>
      <div className="fav__foot">
        <span className="rating"><FaStar /> {fav.rating}</span>
        <span className="fav__price">{t('common.from')} <b>{f.money(offer.price)}</b></span>
      </div>
      <button
        className="btn btn--outline btn--block"
        onClick={() => book({ id: fav.offerId, name, kind: offer.cat || fav.service, price: offer.price })}
      >
        {t('favorites.book')}
      </button>
    </article>
  )
}

export function Favorites() {
  const { t } = useTranslation()
  const [ref, inView] = useInView()
  // Simulated live counter: every few seconds a random card gets new bookings.
  const [bumps, setBumps] = useState(() => favorites.map(() => 0))

  useEffect(() => {
    if (!inView) return undefined
    const id = setInterval(() => {
      setBumps((b) => {
        const i = Math.floor(Math.random() * b.length)
        return b.map((v, j) => (j === i ? v + 1 + Math.floor(Math.random() * 3) : v))
      })
    }, 2800)
    return () => clearInterval(id)
  }, [inView])

  const ranked = favorites
    .map((fav, i) => ({ fav, bump: bumps[i] }))
    .sort((a, b) => b.fav.count + b.bump - (a.fav.count + a.bump))

  return (
    <section className="section" id="favorites" ref={ref}>
      <div className="container">
        <SectionHeader
          eyebrow={<><FaCircle className="live-dot" /> {t('favorites.live')}</>}
          title={t('favorites.title')}
          subtitle={t('favorites.subtitle')}
        />
        <div className="favs">
          {ranked.map(({ fav, bump }, i) => (
            <FavoriteCard key={fav.key} fav={fav} rank={i + 1} start={inView} bump={bump} />
          ))}
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
  { key: 'support', icon: FaHeadset },
  { key: 'secure', icon: FaLock },
  { key: 'offline', icon: FaWifi },
]

const stats = [
  { key: 'travelers', value: 2.4, suffix: 'M+', digits: 1 },
  { key: 'countries', value: 190, suffix: '+' },
  { key: 'partners', value: 12500, suffix: '+' },
  { key: 'rating', value: 4.9, suffix: '/5', digits: 1 },
]

function Stat({ stat, start }) {
  const { t } = useTranslation()
  const f = useFormat()
  const v = useCountUp(stat.value, start, 1800)
  return (
    <div className="stat">
      <strong>{f.number(v, stat.digits || 0)}{stat.suffix}</strong>
      <span>{t(`why.stats.${stat.key}`)}</span>
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
