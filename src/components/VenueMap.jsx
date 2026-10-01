import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../context/ThemeContext'

// Small venue map on OpenStreetMap tiles (no API key). CSS filters tint the tiles to the site's
// palette and turn them dark in dark mode; the pin uses the brand colour.
// Loaded lazily so Leaflet is only downloaded when someone opens a map.
export default function VenueMap({ lat, lng, label }) {
  const el = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!el.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return undefined
    const map = L.map(el.current, { center: [lat, lng], zoom: 15, scrollWheelZoom: false, zoomControl: true })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)
    const icon = L.divIcon({ className: 'venue-pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 30] })
    L.marker([lat, lng], { icon, title: label, alt: label }).addTo(map)
    return () => map.remove()
  }, [lat, lng, label])

  return <div ref={el} className={`venue-map venue-map--${theme === 'dark' ? 'dark' : 'light'}`} role="img" aria-label={label} />
}
