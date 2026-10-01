import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAutoText } from '../i18n/auto'
import {
  FaArrowLeft, FaArrowRight, FaCalendarAlt, FaUsers, FaBed, FaSun, FaCheck, FaTimes, FaMinus, FaPlus,
  FaTrain, FaPlane, FaCar, FaWalking, FaTruckMonster, FaRoute, FaBuilding, FaCheckCircle, FaInfoCircle,
} from 'react-icons/fa'
import { PageHero } from './Places'
import NotFound from './NotFound'
import Price from '../components/Price'
import PlaceImage from '../components/PlaceImage'
import Marquee from '../components/Marquee'
import {
  tours, tourBySlug, operators, operatorById, tourOperator, tourCities, durationFilters, DEPOSIT_RATE, MAX_TRAVELERS, LEAD_DAYS,
} from '../data/tours'
import { services, serviceById, serviceHref } from '../data/services'
import { useBook, useFormat, useWiki, sizedThumb } from '../hooks'

const transportIcons = { train: FaTrain, flight: FaPlane, car: FaCar, walking: FaWalking, offroad: FaTruckMonster }
const SORTS = ['popular', 'price', 'duration']

/* ------------------------------ Card (also used by the home carousel and search) ------------------------------ */

export function TourCard({ tour, inert = false }) {
  const { t } = useTranslation()
  const at = useAutoText()
  const op = tourOperator(tour)
  return (
    <Link
      to={`/tours/${tour.slug}`}
      className="tour-card"
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert || undefined}
    >
      <div className="tour-card__media">
        <PlaceImage wiki={tour.wiki} alt={tour.title} width={640} />
        <span className="tour-card__days">{t('tours.daysNights', { count: tour.days, nights: tour.days - 1 })}</span>
      </div>
      <div className="tour-card__body">
        <small className="tour-card__op">{op.name} · {t(`guides.cities.${op.city}`)}</small>
        <h3>{at(tour.title)}</h3>
        <p className="tour-card__route"><FaRoute /> {tour.route.map(at).join(' → ')}</p>
        <div className="tour-card__foot">
          <span className="tour-card__from">{t('common.from')}</span>
          <Price usd={tour.price} unit={t('tours.perPerson')} />
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------ Home carousel ------------------------------ */

export function ToursCarousel() {
  const { t } = useTranslation()
  return (
    <section className="section section--tours" id="tours">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t('tours.eyebrow')}</span>
            <h2>{t('tours.homeTitle')}</h2>
            <p>{t('tours.homeSubtitle')}</p>
          </div>
          <Link to="/tours" className="btn btn--outline">{t('subnav.viewAll')} <FaArrowRight className="flip-rtl" /></Link>
        </div>
      </div>
      <Marquee>
        {(copy) => tours.map((tour) => <TourCard key={`${copy}-${tour.slug}`} tour={tour} inert={copy === 1} />)}
      </Marquee>
    </section>
  )
}

/* ------------------------------ /tours ------------------------------ */

export function ToursPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const service = serviceById.tours
  const Icon = service.icon

  const duration = durationFilters.some((d) => d.id === params.get('days')) ? params.get('days') : ''
  const city = tourCities.includes(params.get('city')) ? params.get('city') : ''
  const operator = operatorById[params.get('operator')] ? params.get('operator') : ''
  const sort = SORTS.includes(params.get('sort')) ? params.get('sort') : 'popular'

  const update = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }
  const clearAll = () => setParams({}, { replace: true })

  const durationTest = durationFilters.find((d) => d.id === duration)?.test
  const results = tours
    .filter((tour) => (!durationTest || durationTest(tour.days))
      && (!city || tourOperator(tour).city === city)
      && (!operator || tour.operator === operator))
    .sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'duration' ? a.days - b.days : 0))

  return (
    <>
      <PageHero title={t('tours.title')} subtitle={t('tours.subtitle')} photo="Khiva">
        <Link to="/#services" className="back-link"><FaArrowLeft className="flip-rtl" /> {t('services.all')}</Link>
        <span className="page-hero__icon" style={{ '--c': service.color }}><Icon /></span>
      </PageHero>

      <div className="container service-tabs">
        {services.map((s) => (
          <Link key={s.id} to={serviceHref(s.id)} className={`pill ${s.id === 'tours' ? 'is-active' : ''}`}>
            <s.icon /> {t(`services.items.${s.id}.title`)}
          </Link>
        ))}
      </div>

      <section className="section section--flush">
        <div className="container">
          <div className="g-where">
            <span className="g-where__label">{t('tours.howLong')}</span>
            <div className="g-where__options" role="radiogroup" aria-label={t('tours.howLong')}>
              {['', ...durationFilters.map((d) => d.id)].map((id) => (
                <button
                  key={id || 'all'}
                  role="radio"
                  aria-checked={duration === id}
                  className={`g-seg ${duration === id ? 'is-active' : ''}`}
                  onClick={() => update({ days: id })}
                >
                  {t(`tours.durations.${id || 'all'}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="g-toolbar">
            <p className="g-toolbar__count" aria-live="polite">
              {t('tours.count', { count: results.length })}
              {operator && <> · <b>{operatorById[operator].name}</b> <button className="g-link" onClick={() => update({ operator: '' })}>{t('tours.clearOperator')}</button></>}
            </p>
            <label className="g-sort">
              <span className="hide-xs">{t('tours.cityLabel')}</span>
              <select value={city} onChange={(e) => update({ city: e.target.value })}>
                <option value="">{t('tours.allCities')}</option>
                {tourCities.map((c) => <option key={c} value={c}>{t(`guides.cities.${c}`)}</option>)}
              </select>
            </label>
            <label className="g-sort">
              <span className="hide-xs">{t('guides.sortLabel')}</span>
              <select value={sort} onChange={(e) => update({ sort: e.target.value === 'popular' ? '' : e.target.value })}>
                {SORTS.map((s) => <option key={s} value={s}>{t(`tours.sort.${s}`)}</option>)}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="empty-state g-empty">
              <FaRoute />
              <h2>{t('tours.emptyTitle')}</h2>
              <p>{t('tours.emptyText')}</p>
              <button className="btn btn--primary" onClick={clearAll}>{t('tours.showAll')}</button>
            </div>
          ) : (
            <div className="tour-grid">
              {results.map((tour) => <TourCard key={tour.slug} tour={tour} />)}
            </div>
          )}

          <div className="tour-steps">
            <h2 className="section-title">{t('tours.howTitle')}</h2>
            <ol>
              {['choose', 'request', 'confirm', 'travel'].map((k, i) => (
                <li key={k}>
                  <span className="tour-steps__num">{i + 1}</span>
                  <strong>{t(`tours.how.${k}.title`)}</strong>
                  <p>{t(`tours.how.${k}.text`, { deposit: DEPOSIT_RATE * 100 })}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="tour-operators">
            <h2 className="section-title">{t('tours.operatorsTitle')}</h2>
            <div className="tour-operators__list">
              {operators.map((o) => (
                <button
                  key={o.id}
                  className={`tour-op ${operator === o.id ? 'is-active' : ''}`}
                  onClick={() => { update({ operator: operator === o.id ? '' : o.id }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  <FaBuilding />
                  <span><strong>{o.name}</strong><small>{t(`guides.cities.${o.city}`)}</small></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ------------------------------ /tours/:slug ------------------------------ */

const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function TourBooking({ tour }) {
  const { t } = useTranslation()
  const at = useAutoText()
  const f = useFormat()
  const book = useBook()
  const [earliest] = useState(() => isoDate(new Date(Date.now() + LEAD_DAYS * 864e5)))
  const [date, setDate] = useState(earliest)
  const [travelers, setTravelers] = useState(2)
  const total = tour.price * travelers
  const deposit = Math.round(total * DEPOSIT_RATE)
  const valid = date >= earliest

  return (
    <aside className="g-book tour-book" id="book">
      <div className="g-book__rate">
        <span className="tour-card__from">{t('common.from')}</span>
        <Price usd={tour.price} unit={t('tours.perPerson')} />
      </div>

      <label className="g-book__field">
        <span>{t('tours.book.start')}</span>
        <input type="date" value={date} min={earliest} onChange={(e) => setDate(e.target.value)} />
      </label>

      <div className="g-book__field">
        <span id="tour-travelers">{t('tours.book.travelers')}</span>
        <div className="g-stepper" role="group" aria-labelledby="tour-travelers">
          <button onClick={() => setTravelers((n) => Math.max(1, n - 1))} disabled={travelers <= 1} aria-label={t('guides.book.fewer')}><FaMinus /></button>
          <output aria-live="polite">{travelers}</output>
          <button onClick={() => setTravelers((n) => Math.min(MAX_TRAVELERS, n + 1))} disabled={travelers >= MAX_TRAVELERS} aria-label={t('guides.book.more')}><FaPlus /></button>
        </div>
      </div>

      <dl className="tour-book__sum">
        <div><dt>{t('tours.book.total')}</dt><dd><Price usd={total} /></dd></div>
        <div><dt>{t('tours.book.deposit', { percent: DEPOSIT_RATE * 100 })}</dt><dd><Price usd={deposit} /></dd></div>
      </dl>

      <button
        className="btn btn--primary btn--block"
        disabled={!valid}
        onClick={() =>
          book({
            id: `tour-${tour.slug}-${date}`,
            name: at(tour.title),
            kind: 'tours',
            price: total,
            meta: `${f.date(date, { day: 'numeric', month: 'long' })} · ${t('guides.book.peopleCount', { count: travelers })}`,
          })
        }
      >
        {t('tours.book.cta')}
      </button>
      <p className="g-book__note"><FaCheckCircle /> {t('tours.book.note')}</p>
    </aside>
  )
}

export function TourDetail() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const at = useAutoText()
  const tour = tourBySlug[slug]
  const { data } = useWiki(tour?.wiki)
  if (!tour) return <NotFound />
  const op = tourOperator(tour)
  const more = tours.filter((x) => x.slug !== slug && x.route.some((c) => tour.route.includes(c))).slice(0, 3)

  const facts = [
    [FaCalendarAlt, t('tours.facts.duration'), t('tours.daysNights', { count: tour.days, nights: tour.days - 1 })],
    [FaUsers, t('tours.facts.group'), t(`tours.groups.${tour.group}`)],
    [FaBed, t('tours.facts.stay'), t(`tours.stays.${tour.stay}`)],
    [FaSun, t('tours.facts.season'), at(tour.season)],
  ]

  return (
    <>
      <PageHero title={at(tour.title)} subtitle={`${op.name} · ${t(`guides.cities.${op.city}`)}`} image={sizedThumb(data?.thumb, 1280)}>
        <Link to="/tours" className="back-link"><FaArrowLeft className="flip-rtl" /> {t('tours.back')}</Link>
        <span className="pill is-active">{t('tours.daysNights', { count: tour.days, nights: tour.days - 1 })}</span>
      </PageHero>

      <section className="section section--flush">
        <div className="container tour-detail">
          <div className="tour-detail__main">
            <dl className="tour-facts">
              {facts.map(([Icon, label, value]) => (
                <div key={label}><Icon /><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>

            <h2>{t('tours.routeTitle')}</h2>
            <ol className="tour-route">
              {tour.route.map((c) => <li key={c}>{at(c)}</li>)}
            </ol>

            <h2>{t('tours.highlights')}</h2>
            <ul className="tour-highlights">
              {tour.highlights.map((h) => <li key={h}><FaCheck /> {at(h)}</li>)}
            </ul>

            <h2>{t('tours.itinerary')}</h2>
            <div className="tour-days">
              {tour.itinerary.map(([title, text], i) => (
                <details key={i} open={i === 0}>
                  <summary><span className="tour-days__num">{t('tours.day', { n: i + 1 })}</span> {at(title)}</summary>
                  <p>{at(text)}</p>
                </details>
              ))}
            </div>

            <div className="tour-incl">
              <div>
                <h2>{t('tours.included')}</h2>
                <ul>{tour.included.map((k) => <li key={k}><FaCheck className="is-yes" /> {t(`tours.inc.${k}`)}</li>)}</ul>
              </div>
              <div>
                <h2>{t('tours.excluded')}</h2>
                <ul>{tour.excluded.map((k) => <li key={k}><FaTimes className="is-no" /> {t(`tours.exc.${k}`)}</li>)}</ul>
              </div>
            </div>

            <h2>{t('tours.travelTitle')}</h2>
            <ul className="tour-transport">
              {tour.transport.map((k) => {
                const Icon = transportIcons[k]
                return (
                  <li key={k}>
                    <Icon />
                    <span><strong>{t(`tours.transport.${k}.title`)}</strong><small>{t(`tours.transport.${k}.text`)}</small></span>
                  </li>
                )
              })}
              <li>
                <FaBed />
                <span><strong>{t(`tours.stays.${tour.stay}`)}</strong><small>{t(`tours.stayText.${tour.stay}`)}</small></span>
              </li>
            </ul>

            <h2>{t('tours.paymentTitle')}</h2>
            <ol className="tour-pay">
              {['request', 'confirm', 'deposit', 'balance'].map((k) => (
                <li key={k}>
                  <strong>{t(`tours.pay.${k}.title`, { percent: DEPOSIT_RATE * 100 })}</strong>
                  <span>{t(`tours.pay.${k}.text`, { percent: DEPOSIT_RATE * 100 })}</span>
                </li>
              ))}
            </ol>
            <p className="tour-methods">{t('tours.payMethods')}</p>

            <h3 className="tour-sub">{t('tours.cancelTitle')}</h3>
            <ul className="tour-cancel">
              {['free', 'half', 'none'].map((k) => <li key={k}>{t(`tours.cancel.${k}`)}</li>)}
            </ul>

            <div className="tour-operator-box">
              <FaBuilding />
              <div>
                <small>{t('tours.operator')}</small>
                <strong>{op.name}</strong>
                <span>{t(`guides.cities.${op.city}`)}</span>
              </div>
              <Link to={`/tours?operator=${op.id}`} className="btn btn--outline btn--sm">{t('tours.operatorTours')}</Link>
            </div>
            <p className="tour-disclaimer"><FaInfoCircle /> {t('tours.disclaimer')}</p>
          </div>

          <TourBooking tour={tour} />
        </div>
      </section>

      {more.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">{t('tours.similar')}</h2>
              <Link to="/tours" className="btn btn--outline">{t('subnav.viewAll')} <FaArrowRight className="flip-rtl" /></Link>
            </div>
            <div className="tour-grid">
              {more.map((x) => <TourCard key={x.slug} tour={x} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
