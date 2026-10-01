import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAutoText, useLocalizedText } from '../i18n/auto'
import {
  FaStar, FaMapMarkerAlt, FaPlus, FaCheck, FaBalanceScale, FaTimes, FaClock, FaUtensils, FaExternalLinkAlt,
  FaUserFriends, FaCogs, FaGasPump, FaSwimmingPool, FaSpa, FaDumbbell, FaCoffee, FaWifi, FaParking, FaPlaneArrival, FaConciergeBell,
} from 'react-icons/fa'
import Price from './Price'
import PlaceImage from './PlaceImage'
import Modal from './Modal'
import { LazyMap } from './LocationMap'
import { rentalCompanies, companyById, hotelHref } from '../data/services'
import { useBook } from '../hooks'

const MAX_COMPARE = 3
const amenityIcons = { pool: FaSwimmingPool, spa: FaSpa, gym: FaDumbbell, breakfast: FaCoffee, wifi: FaWifi, parking: FaParking, airport: FaPlaneArrival, restaurant: FaConciergeBell }
const AMENITY_KEYS = Object.keys(amenityIcons)

function Stars({ count }) {
  if (!count) return null
  return <span className="stars" aria-label={`${count}★`}>{'★'.repeat(Number(count))}</span>
}

function Rating({ offer }) {
  const { t } = useTranslation()
  if (offer.rating == null || offer.rating === '') return null
  return <span className="rating"><FaStar /> {offer.rating} {offer.reviews ? <small>({offer.reviews} {t('common.reviews')})</small> : null}</span>
}

/* ------------------------------ Hotels & restaurants ------------------------------ */

function PlaceOfferCard({ offer, service, selected, onShowMap, compare }) {
  const { t } = useTranslation()
  const at = useAutoText()
  const book = useBook()
  const isHotel = service === 'accommodation'
  const inCompare = compare?.ids.includes(offer.id)
  const compareFull = compare && compare.ids.length >= MAX_COMPARE && !inCompare

  return (
    <article className={`rich-card ${selected ? 'is-selected' : ''}`}>
      <div className="rich-card__media">
        {isHotel && <Link to={hotelHref(offer)} className="rich-card__cover" aria-label={offer.name} tabIndex={-1} />}
        <PlaceImage wiki={offer.photo} alt={offer.name} width={500} />
        {isHotel && offer.stars ? <span className="rich-card__badge"><Stars count={offer.stars} /></span> : null}
        {!isHotel && offer.cuisine && <span className="rich-card__badge"><FaUtensils /> {at(offer.cuisine)}</span>}
      </div>
      <div className="rich-card__body">
        <div className="rich-card__top">
          <h3>{isHotel ? <Link to={hotelHref(offer)} className="rich-card__link">{offer.name}</Link> : offer.name}</h3>
          <Rating offer={offer} />
        </div>
        <p className="rich-card__loc"><FaMapMarkerAlt /> {[offer.address, offer.location].filter(Boolean).join(', ')}</p>
        {isHotel ? (
          <ul className="rich-card__amenities" aria-label={t('rich.amenities')}>
            {(offer.amenities || []).slice(0, 6).map((a) => {
              const Icon = amenityIcons[a]
              return Icon ? <li key={a} title={t(`rich.amenity.${a}`)}><Icon /><span className="sr-only">{t(`rich.amenity.${a}`)}</span></li> : null
            })}
          </ul>
        ) : (
          offer.hours && <p className="rich-card__meta"><FaClock /> {offer.hours}</p>
        )}
        <div className="chips chips--small">
          {(offer.tags || []).map((tag) => <span key={tag} className="chip chip--static">{at(tag)}</span>)}
        </div>
        <div className="rich-card__foot">
          <span className="rich-card__price">
            <small>{t('common.from')}</small>
            <Price usd={Number(offer.price)} unit={t(`common.per.${offer.unit}`)} />
          </span>
          <div className="rich-card__actions">
            {offer.lat && offer.lng && (
              <button className="g-compare-btn" onClick={() => onShowMap(offer.id)} aria-pressed={selected}>
                <FaMapMarkerAlt /> <span>{t('rich.onMap')}</span>
              </button>
            )}
            {compare && (
              <button
                className={`g-compare-btn ${inCompare ? 'is-on' : ''}`}
                onClick={() => compare.toggle(offer.id)}
                disabled={compareFull}
                aria-pressed={inCompare}
                title={compareFull ? t('rich.compareMax') : t('guides.compare')}
              >
                {inCompare ? <FaCheck /> : <FaPlus />} <span>{t('guides.compare')}</span>
              </button>
            )}
            {isHotel ? (
              <Link to={hotelHref(offer)} className="btn btn--primary btn--sm">{t('hotel.view')}</Link>
            ) : (
              <button
                className="btn btn--primary btn--sm"
                onClick={() => book({ id: offer.id, name: offer.name, kind: service, price: Number(offer.price), meta: offer.location })}
              >
                {t('rich.reserve')}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function HotelCompare({ items, onRemove }) {
  const { t } = useTranslation()
  const cheapest = Math.min(...items.map((h) => Number(h.price)))
  const best = Math.max(...items.map((h) => Number(h.rating) || 0))
  const rows = [
    ['price', (h) => <span className={Number(h.price) === cheapest ? 'is-best' : ''}>${h.price} <small>{t('common.per.night')}</small></span>],
    ['stars', (h) => <Stars count={h.stars} />],
    ['rating', (h) => <span className={Number(h.rating) === best ? 'is-best' : ''}><FaStar className="g-star" /> {h.rating} <small>({h.reviews})</small></span>],
    ['location', (h) => h.location],
    ['checkIn', (h) => h.checkIn || '—'],
    ...AMENITY_KEYS.map((a) => [`amenity.${a}`, (h) => ((h.amenities || []).includes(a) ? <FaCheck className="is-yes" /> : <FaTimes className="is-no" />)]),
  ]
  return (
    <div className="g-compare__scroll">
      <table className="g-compare hotel-compare">
        <thead>
          <tr>
            <th />
            {items.map((h) => (
              <th key={h.id}>
                <div className="hotel-compare__img"><PlaceImage wiki={h.photo} alt="" width={330} /></div>
                <strong>{h.name}</strong>
                <button className="g-compare__remove" onClick={() => onRemove(h.id)} aria-label={t('guides.remove')}><FaTimes /></button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, render]) => (
            <tr key={key}>
              <th scope="row">{t(`rich.${key}`)}</th>
              {items.map((h) => <td key={h.id}>{render(h)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Hotels and restaurants: photo cards next to a map with every place pinned.
export function PlaceOffers({ service, offers }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  const [compareIds, setCompareIds] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const isHotel = service === 'accommodation'
  const markers = offers.filter((o) => o.lat && o.lng).map((o) => ({ id: o.id, lat: o.lat, lng: o.lng, label: o.name }))

  const compare = isHotel ? {
    ids: compareIds,
    toggle: (id) => setCompareIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : list.length < MAX_COMPARE ? [...list, id] : list)),
  } : null
  const closeCompare = useCallback(() => setCompareOpen(false), [])

  const showOnMap = (id) => {
    setSelected(id)
    // On narrow screens the map sits above the list.
    if (window.matchMedia('(max-width: 900px)').matches) document.getElementById('offers-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Keep the list card in view when a pin is clicked.
  useEffect(() => {
    if (selected) document.getElementById(`offer-${selected}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selected])

  return (
    <div className="offers-split">
      <div className="offers-split__list">
        {offers.map((o) => (
          <div key={o.id} id={`offer-${o.id}`}>
            <PlaceOfferCard offer={o} service={service} selected={selected === o.id} onShowMap={showOnMap} compare={compare} />
          </div>
        ))}
      </div>
      <div className="offers-split__map" id="offers-map">
        <LazyMap markers={markers} selectedId={selected} onSelect={setSelected} height="100%" zoom={6} />
      </div>

      {compare && compareIds.length > 0 && (
        <div className="g-comparebar" role="region" aria-label={t('rich.compareTitle')}>
          <span className="g-comparebar__text">
            {compareIds.length >= 2 ? t('rich.compareCount', { count: compareIds.length }) : t('rich.compareHint')}
          </span>
          <button className="btn btn--primary btn--sm" disabled={compareIds.length < 2} onClick={() => setCompareOpen(true)}>
            <FaBalanceScale /> {t('guides.compare')}
          </button>
          <button className="icon-btn" onClick={() => setCompareIds([])} aria-label={t('guides.clear')}><FaTimes /></button>
        </div>
      )}
      {compareOpen && compareIds.length >= 2 && (
        <Modal title={t('rich.compareTitle')} onClose={closeCompare} wide>
          <HotelCompare items={compareIds.map((id) => offers.find((o) => o.id === id)).filter(Boolean)} onRemove={compare.toggle} />
        </Modal>
      )}
    </div>
  )
}

/* ------------------------------ Rent a car ------------------------------ */

function CarCard({ car }) {
  const { t } = useTranslation()
  const at = useAutoText()
  const book = useBook()
  const company = companyById(car.company)
  return (
    <article className="rich-card car-card">
      <div className="rich-card__media car-card__media">
        <PlaceImage wiki={car.photo} alt={car.name} width={500} />
        {company && <span className="rich-card__badge">{company.name}</span>}
      </div>
      <div className="rich-card__body">
        <div className="rich-card__top">
          <h3>{car.name}</h3>
        </div>
        <ul className="car-card__specs">
          <li><FaUserFriends /> {t('rich.seats', { count: Number(car.seats) || 5 })}</li>
          <li><FaCogs /> {t(`rich.transmission.${car.transmission || 'auto'}`)}</li>
          <li><FaGasPump /> {t(`rich.fuel.${car.fuel || 'petrol'}`)}</li>
          <li><FaMapMarkerAlt /> {car.location}</li>
        </ul>
        <div className="chips chips--small">
          {(car.tags || []).map((tag) => <span key={tag} className="chip chip--static">{at(tag)}</span>)}
        </div>
        <div className="rich-card__foot">
          <span className="rich-card__price">
            <small>{t('common.from')}</small>
            <Price usd={Number(car.price)} unit={t('common.per.day')} />
          </span>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => book({ id: car.id, name: `${car.name}${company ? ` · ${company.name}` : ''}`, kind: 'rentcar', price: Number(car.price), meta: car.location })}
          >
            {t('common.book')}
          </button>
        </div>
      </div>
    </article>
  )
}

export function CarRental({ cars }) {
  const { t } = useTranslation()
  const lt = useLocalizedText()
  const [company, setCompany] = useState('')
  const list = cars.filter((c) => !company || c.company === company)
  return (
    <>
      <h2 className="section-title">{t('rich.companies')}</h2>
      <div className="companies">
        {rentalCompanies.map((c) => (
          <article key={c.id} className={`company ${company === c.id ? 'is-active' : ''}`}>
            <button className="company__pick" onClick={() => setCompany(company === c.id ? '' : c.id)} aria-pressed={company === c.id}>
              <strong>{c.name}</strong>
              <small>{t('rich.carsCount', { count: cars.filter((car) => car.company === c.id).length })}</small>
            </button>
            <p>{lt(c.info)}</p>
            {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="company__link">{t('rich.website')} <FaExternalLinkAlt /></a>}
          </article>
        ))}
      </div>
      <p className="tickets-note">{t('rich.carNote')}</p>
      <h2 className="section-title">
        {company ? `${t('rich.carsOf')} ${companyById(company)?.name}` : t('rich.allCars')}
        {company && <button className="g-link company__clear" onClick={() => setCompany('')}>{t('rich.showAll')}</button>}
      </h2>
      <div className="rich-grid">
        {list.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </>
  )
}
