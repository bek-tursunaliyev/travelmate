import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaMinus, FaPlus, FaCheckCircle, FaSignInAlt, FaSignOutAlt, FaIdCard, FaBed,
  FaSwimmingPool, FaSpa, FaDumbbell, FaCoffee, FaWifi, FaParking, FaPlaneArrival, FaConciergeBell,
} from 'react-icons/fa'
import { useAutoText } from '../i18n/auto'
import NotFound from './NotFound'
import Price from '../components/Price'
import PlaceImage from '../components/PlaceImage'
import LocationMap from '../components/LocationMap'
import { offers, hotelHref } from '../data/services'
import { useBook, useFormat, usePlaceName } from '../hooks'

const amenityIcons = { pool: FaSwimmingPool, spa: FaSpa, gym: FaDumbbell, breakfast: FaCoffee, wifi: FaWifi, parking: FaParking, airport: FaPlaneArrival, restaurant: FaConciergeBell }

// Room types offered for every hotel unless the hotel lists its own (`rooms`).
const DEFAULT_ROOMS = [
  { id: 'standard', factor: 1, guests: 2 },
  { id: 'deluxe', factor: 1.35, guests: 2 },
  { id: 'suite', factor: 2, guests: 4 },
]
const MAX_ROOMS = 5
const MAX_NIGHTS = 30

const isoDate = (d) => d.toISOString().slice(0, 10)
const addDays = (iso, n) => isoDate(new Date(new Date(`${iso}T00:00:00Z`).getTime() + n * 864e5))
const nightsBetween = (a, b) => Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 864e5)

function Counter({ id, label, value, min, max, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="g-book__field">
      <span id={id}>{label}</span>
      <div className="g-stepper" role="group" aria-labelledby={id}>
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={t('guides.book.fewer')}><FaMinus /></button>
        <output aria-live="polite">{value}</output>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={t('guides.book.more')}><FaPlus /></button>
      </div>
    </div>
  )
}

function HotelBooking({ hotel, rooms, room, onRoom }) {
  const { t } = useTranslation()
  const f = useFormat()
  const book = useBook()
  const [today] = useState(() => isoDate(new Date()))
  const [checkIn, setCheckIn] = useState(() => addDays(isoDate(new Date()), 1))
  const [checkOut, setCheckOut] = useState(() => addDays(isoDate(new Date()), 3))
  const [guests, setGuests] = useState(2)
  const [roomCount, setRoomCount] = useState(1)

  const type = rooms.find((r) => r.id === room) || rooms[0]
  const nightly = Math.round(Number(hotel.price) * type.factor)
  const nights = nightsBetween(checkIn, checkOut)
  const total = nightly * Math.max(nights, 0) * roomCount
  const tooMany = guests > type.guests * roomCount
  const datesOk = checkIn >= today && nights >= 1 && nights <= MAX_NIGHTS
  const valid = datesOk && !tooMany

  const changeCheckIn = (value) => {
    setCheckIn(value)
    // Keep the stay length when moving the arrival date; never let check-out fall before check-in.
    if (value && nightsBetween(value, checkOut) < 1) setCheckOut(addDays(value, Math.max(nights, 1)))
  }

  return (
    <aside className="g-book hotel-book" id="book">
      <div className="g-book__rate">
        <span className="tour-card__from">{t('common.from')}</span>
        <Price usd={Number(hotel.price)} unit={t('common.per.night')} />
      </div>

      <div className="hotel-book__dates">
        <label className="g-book__field">
          <span>{t('hotel.checkIn')}</span>
          <input type="date" value={checkIn} min={today} onChange={(e) => changeCheckIn(e.target.value)} />
        </label>
        <label className="g-book__field">
          <span>{t('hotel.checkOut')}</span>
          <input type="date" value={checkOut} min={addDays(checkIn || today, 1)} onChange={(e) => setCheckOut(e.target.value)} />
        </label>
      </div>

      <label className="g-book__field">
        <span>{t('hotel.roomType')}</span>
        <select value={type.id} onChange={(e) => onRoom(e.target.value)}>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{t(`hotel.roomTypes.${r.id}.name`, { defaultValue: r.name || r.id })} — {f.money(Math.round(Number(hotel.price) * r.factor))}</option>
          ))}
        </select>
      </label>

      <div className="hotel-book__counts">
        <Counter id="hotel-guests" label={t('hotel.guests')} value={guests} min={1} max={MAX_ROOMS * 4} onChange={setGuests} />
        <Counter id="hotel-rooms" label={t('hotel.rooms')} value={roomCount} min={1} max={MAX_ROOMS} onChange={setRoomCount} />
      </div>
      {tooMany && <p className="hotel-book__warn">{t('hotel.tooMany', { count: type.guests * roomCount })}</p>}

      <dl className="tour-book__sum">
        <div>
          <dt>{f.money(nightly)} × {t('hotel.nights', { count: Math.max(nights, 0) })}{roomCount > 1 ? ` × ${roomCount}` : ''}</dt>
          <dd><Price usd={total} /></dd>
        </div>
      </dl>

      <button
        className="btn btn--primary btn--block"
        disabled={!valid}
        onClick={() =>
          book({
            id: `${hotel.id}-${type.id}-${checkIn}`,
            name: `${hotel.name} · ${t(`hotel.roomTypes.${type.id}.name`, { defaultValue: type.name || type.id })}`,
            kind: 'accommodation',
            price: total,
            meta: [
              `${f.date(checkIn, { day: 'numeric', month: 'short' })} – ${f.date(checkOut, { day: 'numeric', month: 'short' })}`,
              t('hotel.nights', { count: nights }),
              t('guides.book.peopleCount', { count: guests }),
            ].join(' · '),
          })
        }
      >
        {t('hotel.book')}
      </button>
      <p className="g-book__note"><FaCheckCircle /> {t('hotel.note')}</p>
    </aside>
  )
}

export default function Hotel() {
  const { id } = useParams()
  const { t } = useTranslation()
  const at = useAutoText()
  const place = usePlaceName()
  const hotels = offers.accommodation || []
  const hotel = hotels.find((h) => h.id === id)
  const rooms = hotel?.rooms?.length ? hotel.rooms : DEFAULT_ROOMS
  const [room, setRoom] = useState(rooms[0].id)
  if (!hotel) return <NotFound />

  const photos = [hotel.photo, ...(hotel.gallery || [])].filter(Boolean).slice(0, 3)
  const similar = hotels
    .filter((h) => h.id !== hotel.id)
    .sort((a, b) => (b.location === hotel.location) - (a.location === hotel.location))
    .slice(0, 3)
  const chooseRoom = (rid) => {
    setRoom(rid)
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="section section--flush hotel">
      <div className="container">
        <Link to="/services/accommodation" className="back-link"><FaArrowLeft className="flip-rtl" /> {t('hotel.back')}</Link>

        <header className="hotel__head">
          <div>
            {hotel.stars ? <span className="stars" aria-label={`${hotel.stars}★`}>{'★'.repeat(Number(hotel.stars))}</span> : null}
            <h1>{hotel.name}</h1>
            <p className="hotel__loc"><FaMapMarkerAlt /> {[hotel.address, place(hotel.location)].filter(Boolean).join(', ')}</p>
          </div>
          {hotel.rating ? (
            <div className="hotel__score">
              <strong>{hotel.rating}</strong>
              <span><FaStar /> {hotel.reviews ? `${hotel.reviews} ${t('common.reviews')}` : ''}</span>
            </div>
          ) : null}
        </header>

        <div className={`hotel__gallery hotel__gallery--${photos.length}`}>
          {photos.map((p, i) => (
            <div key={p} className="hotel__photo"><PlaceImage wiki={p} alt={i === 0 ? hotel.name : ''} width={i === 0 ? 960 : 500} /></div>
          ))}
        </div>

        <div className="tour-detail hotel__layout">
          <div className="tour-detail__main">
            {hotel.tags?.length ? (
              <div className="chips">{hotel.tags.map((tag) => <span key={tag} className="chip">{at(tag)}</span>)}</div>
            ) : null}

            {hotel.description && (
              <>
                <h2>{t('hotel.about')}</h2>
                <p className="hotel__text">{at(hotel.description)}</p>
              </>
            )}

            {hotel.amenities?.length ? (
              <>
                <h2>{t('rich.amenities')}</h2>
                <ul className="hotel__amenities">
                  {hotel.amenities.map((a) => {
                    const Icon = amenityIcons[a]
                    return <li key={a}>{Icon && <Icon />} {t(`rich.amenity.${a}`, { defaultValue: at(a) })}</li>
                  })}
                </ul>
              </>
            ) : null}

            <h2>{t('hotel.roomsTitle')}</h2>
            <div className="hotel__rooms">
              {rooms.map((r) => (
                <article key={r.id} className={`hotel-room ${room === r.id ? 'is-selected' : ''}`}>
                  <FaBed className="hotel-room__icon" />
                  <div className="hotel-room__text">
                    <strong>{t(`hotel.roomTypes.${r.id}.name`, { defaultValue: r.name || r.id })}</strong>
                    <small>{t(`hotel.roomTypes.${r.id}.desc`, { defaultValue: '' })} · {t('hotel.upTo', { count: r.guests })}</small>
                  </div>
                  <Price usd={Math.round(Number(hotel.price) * r.factor)} unit={t('common.per.night')} />
                  <button className="btn btn--outline btn--sm" onClick={() => chooseRoom(r.id)} aria-pressed={room === r.id}>
                    {room === r.id ? t('hotel.selected') : t('hotel.select')}
                  </button>
                </article>
              ))}
            </div>

            <h2>{t('hotel.policies')}</h2>
            <dl className="tour-facts hotel__facts">
              <div><FaSignInAlt /><dt>{t('hotel.checkIn')}</dt><dd>{t('hotel.from', { time: hotel.checkIn || '14:00' })}</dd></div>
              <div><FaSignOutAlt /><dt>{t('hotel.checkOut')}</dt><dd>{t('hotel.until', { time: hotel.checkOut || '12:00' })}</dd></div>
              <div><FaIdCard /><dt>{t('hotel.passport')}</dt><dd>{t('hotel.passportText')}</dd></div>
            </dl>

            {hotel.lat && hotel.lng ? (
              <>
                <h2>{t('hotel.location')}</h2>
                <LocationMap name={hotel.name} city={place(hotel.location)} address={hotel.address} lat={hotel.lat} lng={hotel.lng} />
              </>
            ) : null}
          </div>

          <HotelBooking key={hotel.id} hotel={hotel} rooms={rooms} room={room} onRoom={setRoom} />
        </div>

        {similar.length > 0 && (
          <>
            <h2 className="section-title hotel__similar-title">{t('hotel.similar')}</h2>
            <div className="hotel__similar">
              {similar.map((h) => (
                <Link key={h.id} to={hotelHref(h)} className="hotel-mini">
                  <div className="hotel-mini__img"><PlaceImage wiki={h.photo} alt="" width={500} /></div>
                  <div className="hotel-mini__body">
                    <strong>{h.name}</strong>
                    <small><FaMapMarkerAlt /> {place(h.location)}{h.rating ? ` · ★ ${h.rating}` : ''}</small>
                    <Price usd={Number(h.price)} unit={t('common.per.night')} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
