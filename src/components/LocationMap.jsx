import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { FaMapMarkerAlt, FaRoute } from 'react-icons/fa'

const MapView = lazy(() => import('./MapView'))

export const directionsUrl = {
  google: (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  yandex: (lat, lng) => `https://yandex.uz/maps/?rtext=~${lat}%2C${lng}&rtt=auto`,
}

// Lazy map with a Suspense skeleton; accepts the same props as MapView.
export function LazyMap(props) {
  return (
    <Suspense fallback={<div className="map-view map-view--loading" style={{ height: props.height || 360 }} />}>
      <MapView {...props} />
    </Suspense>
  )
}

// One place: name and address, the map, and "get directions" buttons.
export default function LocationMap({ name, city, address, lat, lng, height = 320 }) {
  const { t } = useTranslation()
  const hasCoords = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng)) && lat !== '' && lng !== ''
  const label = [name, city].filter(Boolean).join(', ')
  return (
    <div className="location">
      <div className="location__head">
        <FaMapMarkerAlt />
        <div>
          <strong>{label}</strong>
          {address && <small>{address}</small>}
        </div>
      </div>
      {hasCoords ? (
        <>
          <LazyMap markers={[{ id: 'place', lat, lng, label }]} selectedId="place" height={height} />
          <div className="location__actions">
            <a className="btn btn--outline btn--sm" href={directionsUrl.google(lat, lng)} target="_blank" rel="noreferrer"><FaRoute /> Google Maps</a>
            <a className="btn btn--outline btn--sm" href={directionsUrl.yandex(lat, lng)} target="_blank" rel="noreferrer"><FaRoute /> Yandex Maps</a>
          </div>
        </>
      ) : (
        <p className="location__nomap">{t('tickets.noMap')}</p>
      )}
    </div>
  )
}
