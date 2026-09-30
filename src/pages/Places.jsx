import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaArrowRight, FaArrowLeft, FaSearch, FaExternalLinkAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { placeLists, findPlace, typeOfList } from '../data/places'
import { services } from '../data/services'
import PlaceImage from '../components/PlaceImage'
import { ServiceCard } from '../components/Sections'
import { useWiki, sizedThumb } from '../hooks'
import NotFound from './NotFound'

export function PageHero({ title, subtitle, children, image }) {
  return (
    <section className="page-hero" style={image ? { '--img': `url(${image})` } : undefined}>
      <div className="container">
        {children}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  )
}

export function Popular() {
  const { list } = useParams()
  const { t } = useTranslation()
  const items = placeLists[list]
  if (!items) return <NotFound />

  return (
    <>
      <PageHero title={t(`subnav.${list}`)} subtitle={t('popular.subtitle')}>
        <div className="pills">
          {Object.keys(placeLists).map((l) => (
            <Link key={l} to={`/popular/${l}`} className={`pill ${l === list ? 'is-active' : ''}`}>{t(`subnav.${l}`)}</Link>
          ))}
        </div>
      </PageHero>
      <section className="section section--flush">
        <div className="container place-grid">
          {items.slice(0, 10).map((p, i) => (
            <Link key={p.slug} to={`/place/${list}/${p.slug}`} className="place-card">
              <div className="place-card__media">
                <PlaceImage wiki={p.wiki} alt={p.name} />
                <span className="place-card__rank">#{i + 1}</span>
              </div>
              <div className="place-card__body">
                <h3>{p.name}</h3>
                <p><FaMapMarkerAlt /> {p.country}</p>
                <span className="place-card__go">{t('popular.explore')} <FaArrowRight className="flip-rtl" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function Place() {
  const { list, slug } = useParams()
  const { t } = useTranslation()
  const place = findPlace(list, slug)
  const { loading, data } = useWiki(place?.wiki)
  if (!place) return <NotFound />

  const type = typeOfList[list]
  const others = placeLists[list].filter((p) => p.slug !== slug).slice(0, 4)
  const searchTerm = type === 'landmark' ? place.country.split(',')[0] : place.name

  return (
    <>
      <PageHero title={place.name} subtitle={place.country} image={sizedThumb(data?.thumb, 1280)}>
        <Link to={`/popular/${list}`} className="back-link"><FaArrowLeft className="flip-rtl" /> {t(`subnav.${list}`)}</Link>
        <span className="pill is-active">{t(`place.types.${type}`)} · #{place.rank}</span>
      </PageHero>

      <section className="section section--flush">
        <div className="container place-detail">
          <div className="place-detail__media">
            <PlaceImage wiki={place.wiki} alt={place.name} width={960} />
          </div>
          <div className="place-detail__text">
            <h2>{t('place.about')} {place.name}</h2>
            {loading ? (
              <div className="skeleton-lines"><span /><span /><span /><span /></div>
            ) : (
              <p>{data?.extract || t('place.noInfo')}</p>
            )}
            {data?.url && (
              <a className="source-link" href={data.url} target="_blank" rel="noreferrer">
                {t('place.source')} <FaExternalLinkAlt />
              </a>
            )}
            <div className="chips">
              {place.tags.map((tag) => (
                <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`} className="chip">#{tag}</Link>
              ))}
            </div>
            <Link to={`/search?q=${encodeURIComponent(searchTerm)}`} className="btn btn--primary">
              <FaSearch /> {t('place.searchHere')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2 className="section-title">{t('place.plan')}</h2>
          <div className="services-grid">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">{t(`subnav.${list}`)}</h2>
          <div className="place-grid place-grid--4">
            {others.map((p) => (
              <Link key={p.slug} to={`/place/${list}/${p.slug}`} className="place-card">
                <div className="place-card__media"><PlaceImage wiki={p.wiki} alt={p.name} /></div>
                <div className="place-card__body">
                  <h3>{p.name}</h3>
                  <p><FaMapMarkerAlt /> {p.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
