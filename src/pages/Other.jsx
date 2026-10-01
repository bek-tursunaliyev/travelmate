import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaArrowLeft, FaMapMarkerAlt, FaSearch, FaTrashAlt, FaCheckCircle, FaSuitcaseRolling } from 'react-icons/fa'
import { PageHero } from './Places'
import NotFound from './NotFound'
import { TourCard } from './Tours'
import SearchBar from '../components/SearchBar'
import PlaceImage from '../components/PlaceImage'
import { placePhoto } from '../data/places'
import Price from '../components/Price'
import { OfferCard, CurrencyConverter } from '../components/Offers'
import { ServiceCard, TicketItem, Tickets } from '../components/Sections'
import { services, serviceById, serviceHref, offers } from '../data/services'
import { searchAll, countResults } from '../data/search'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useFormat } from '../hooks'

/* ------------------------------ /search?q= ------------------------------ */

export function SearchResults() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const r = searchAll(q, t)
  const total = countResults(r)

  return (
    <>
      <PageHero title={t('search.title')} photo="Tashkent">
        <div className="page-hero__search">
          <SearchBar key={q} initial={q} compact />
        </div>
      </PageHero>

      <section className="section section--flush">
        <div className="container">
          {total === 0 ? (
            <div className="empty-state">
              <FaSearch />
              <h2>{t('search.none', { q })}</h2>
              <p>{t('search.noneText')}</p>
            </div>
          ) : (
            <>
              <p className="results-count">{t('search.resultsFor', { count: total, q })}</p>

              {r.tours.length > 0 && (
                <div className="result-group">
                  <h2>{t('search.tours')} <span>{r.tours.length}</span></h2>
                  <div className="tour-grid">
                    {r.tours.map((tour) => <TourCard key={tour.slug} tour={tour} />)}
                  </div>
                </div>
              )}

              {r.places.length > 0 && (
                <div className="result-group">
                  <h2>{t('search.places')} <span>{r.places.length}</span></h2>
                  <div className="place-grid place-grid--4">
                    {r.places.map((p) => (
                      <Link key={`${p.list}-${p.slug}`} to={`/place/${p.list}/${p.slug}`} className="place-card">
                        <div className="place-card__media">
                          <PlaceImage wiki={placePhoto(p)} alt={p.name} />
                          <span className="place-card__rank">{t(`place.types.${p.type}`)}</span>
                        </div>
                        <div className="place-card__body">
                          <h3>{p.name}</h3>
                          <p><FaMapMarkerAlt /> {p.country}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {r.services.length > 0 && (
                <div className="result-group">
                  <h2>{t('search.services')} <span>{r.services.length}</span></h2>
                  <div className="services-grid">
                    {r.services.map((s) => <ServiceCard key={s.id} service={s} />)}
                  </div>
                </div>
              )}

              {r.tickets.length > 0 && (
                <div className="result-group">
                  <h2>{t('search.tickets')} <span>{r.tickets.length}</span></h2>
                  <div className="passes">
                    {r.tickets.map((tk) => <TicketItem key={tk.id} tk={tk} cat={tk.cat} />)}
                  </div>
                </div>
              )}

              {r.offers.length > 0 && (
                <div className="result-group">
                  <h2>{t('search.offers')} <span>{r.offers.length}</span></h2>
                  <div className="offers-grid">
                    {r.offers.map((o) => <OfferCard key={o.id} offer={o} service={o.service} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

/* ------------------------------ /services/:id ------------------------------ */

// Header photo per service page.
const servicePhotos = { accommodation: 'Lyab-i_Hauz', food: 'Chorsu_Bazaar', exchange: 'Amir_Timur_Square', rentcar: 'Charvak_Reservoir' }

export function ServicePage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const service = serviceById[id]
  if (serviceHref(id) !== `/services/${id}`) return <Navigate to={serviceHref(id)} replace />
  if (!service) return <NotFound />
  const Icon = service.icon

  return (
    <>
      <PageHero title={t(`services.items.${id}.title`)} subtitle={t(`services.items.${id}.desc`)} photo={servicePhotos[id]}>
        <Link to="/#services" className="back-link"><FaArrowLeft className="flip-rtl" /> {t('services.all')}</Link>
        <span className="page-hero__icon" style={{ '--c': service.color }}><Icon /></span>
      </PageHero>

      <div className="container service-tabs">
        {services.map((s) => (
          <Link key={s.id} to={serviceHref(s.id)} className={`pill ${s.id === id ? 'is-active' : ''}`}>
            <s.icon /> {t(`services.items.${s.id}.title`)}
          </Link>
        ))}
      </div>

      <section className="section section--flush">
        <div className="container">
          {id === 'exchange' && <CurrencyConverter />}
          <h2 className="section-title">{t('service.offers')}</h2>
          <div className="offers-grid">
            {offers[id].map((o) => <OfferCard key={o.id} offer={o} service={id} />)}
          </div>
        </div>
      </section>
    </>
  )
}

/* ------------------------------ /tickets ------------------------------ */

export function TicketsPage() {
  const { t } = useTranslation()
  const Icon = serviceById.tickets.icon
  return (
    <>
      <PageHero title={t('tickets.title')} subtitle={t('tickets.subtitle')} photo="Afrosiyob_(train)">
        <Link to="/#services" className="back-link"><FaArrowLeft className="flip-rtl" /> {t('services.all')}</Link>
        <span className="page-hero__icon" style={{ '--c': serviceById.tickets.color }}><Icon /></span>
      </PageHero>
      <div className="container service-tabs">
        {services.map((s) => (
          <Link key={s.id} to={serviceHref(s.id)} className={`pill ${s.id === 'tickets' ? 'is-active' : ''}`}>
            <s.icon /> {t(`services.items.${s.id}.title`)}
          </Link>
        ))}
      </div>
      <Tickets />
    </>
  )
}

/* ------------------------------ /profile ------------------------------ */

export function Profile() {
  const { t } = useTranslation()
  const { user, bookings, removeBooking } = useAuth()
  const toast = useToast()
  const f = useFormat()

  if (!user) return <Navigate to="/login" state={{ from: '/profile' }} replace />

  const kindLabel = (kind) =>
    serviceById[kind] ? t(`services.items.${kind}.title`) : t(`tickets.categories.${kind}`)
  const total = bookings.reduce((sum, b) => sum + (b.price || 0), 0)

  return (
    <>
      <PageHero title={t('profile.title')} photo="Shah-i-Zinda">
        <div className="profile-card">
          <img src={user.picture} alt="" referrerPolicy="no-referrer" />
          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <small><FaCheckCircle /> {user.demo ? t('profile.demo') : t('profile.signedIn')}</small>
          </div>
        </div>
      </PageHero>

      <section className="section section--flush" id="bookings">
        <div className="container">
          <h2 className="section-title">
            {t('profile.bookings')} <span className="badge">{bookings.length}</span>
          </h2>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <FaSuitcaseRolling />
              <h2>{t('profile.empty')}</h2>
              <Link to="/#services" className="btn btn--primary">{t('profile.explore')}</Link>
            </div>
          ) : (
            <>
              <ul className="bookings">
                {bookings.map((b) => (
                  <li key={b.id} className="booking">
                    <div className="booking__info">
                      <span className="booking__kind">{kindLabel(b.kind)}</span>
                      <strong>{b.name}</strong>
                      <small>
                        {b.meta && (/^\d{4}-\d{2}-\d{2}$/.test(b.meta) ? f.date(b.meta, { day: 'numeric', month: 'long' }) : b.meta)}
                        {b.meta && ' · '}
                        {t('profile.bookedOn')} {f.date(b.bookedAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </small>
                    </div>
                    {b.price ? <Price usd={b.price} className="booking__price" /> : <span className="booking__price">{t('common.free')}</span>}
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => { removeBooking(b.id); toast(t('toast.canceled'), 'info') }}
                    >
                      <FaTrashAlt /> <span className="hide-xs">{t('profile.cancel')}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="bookings__total">Σ <Price usd={total} /></p>
            </>
          )}
        </div>
      </section>
    </>
  )
}
