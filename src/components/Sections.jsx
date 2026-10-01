import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaLayerGroup, FaHandshake, FaTags,
  FaMapMarkerAlt, FaClock, FaCalendarAlt, FaChair, FaArrowRight,
} from 'react-icons/fa'
import { services, serviceHref } from '../data/services'
import { ticketCategories, tickets, ticketName } from '../data/tickets'
import { famousPlaces } from '../data/places'
import PlaceImage from './PlaceImage'
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
        <small className="price__uzs">≈ {f.uzs(tk.price)}</small>
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

/* ------------------------------ Famous places ------------------------------ */

export function PlaceCard({ place, badge }) {
  const { t } = useTranslation()
  const href = `/place/${place.list}/${place.slug}`
  return (
    <article className="place-card place-card--explore">
      <Link to={href} className="place-card__media" tabIndex={-1} aria-hidden="true">
        <PlaceImage wiki={place.wiki} alt={place.name} />
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
      <PlaceImage wiki={place.wiki} alt={place.name} width={640} />
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
          action={<Link to="/places?list=uzbekistan" className="btn btn--outline">{t('subnav.viewAll')} <FaArrowRight className="flip-rtl" /></Link>}
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
