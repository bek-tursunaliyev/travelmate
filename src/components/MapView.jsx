import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// MapLibre finds its worker next to its own file, which breaks once Vite bundles it (blank maps).
// Let Vite build the worker and hand MapLibre the resulting URL instead.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { useTheme } from '../context/ThemeContext'

// Vector map in the site's own colours: OpenFreeMap tiles (free, no API key) with the
// "positron" style repainted from the TravelMate palette, in light and dark mode.
// Loaded lazily (React.lazy) so MapLibre is only downloaded when a map is shown.

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

maplibregl.setWorkerUrl(workerUrl)

const PALETTE = {
  light: {
    background: '#eef4f4', water: '#bfe0e3', park: '#d6eadb', residential: '#e6eeee', building: '#d9e5e5',
    road: '#ffffff', roadCasing: '#d3e2e3', major: '#ffffff', motorway: '#f8dccb', motorwayCasing: '#eab79c',
    rail: '#c4d5d6', boundary: '#97b3b6', text: '#33504f', textMuted: '#5a7073', halo: '#ffffff',
  },
  dark: {
    background: '#0e1d20', water: '#123d42', park: '#14302b', residential: '#122427', building: '#183134',
    road: '#1e3a3e', roadCasing: '#0e1d20', major: '#27494d', motorway: '#5b3d2f', motorwayCasing: '#3a2a22',
    rail: '#24403f', boundary: '#3b5a5d', text: '#c3d6d8', textMuted: '#93aaad', halo: '#0b1719',
  },
}

let baseStyle
async function loadStyle() {
  baseStyle ??= fetch(STYLE_URL).then((r) => {
    if (!r.ok) throw new Error(`map style ${r.status}`)
    return r.json()
  })
  return JSON.parse(JSON.stringify(await baseStyle))
}

// Repaint each layer of the base style by its role.
function themed(style, mode) {
  const c = PALETTE[mode]
  // Only set properties that exist for the layer's type: a stray "line-color" on a fill layer makes the style invalid.
  const paint = (layer, values) => {
    const prefix = layer.type === 'symbol' ? 'text-' : `${layer.type}-`
    const valid = Object.fromEntries(Object.entries(values).filter(([k]) => k.startsWith(prefix)))
    layer.paint = { ...(layer.paint || {}), ...valid }
  }
  // Main colour of fill/line/circle layers; labels (symbol layers) are coloured separately below.
  const color = (layer, value) => {
    if (['fill', 'line', 'circle', 'background'].includes(layer.type)) paint(layer, { [`${layer.type}-color`]: value })
  }
  for (const layer of style.layers) {
    const id = layer.id
    if (layer.type === 'background') paint(layer, { 'background-color': c.background })
    else if (id === 'water' || id.startsWith('landcover_ice') || id.startsWith('landcover_glacier')) color(layer, c.water)
    else if (id === 'waterway') color(layer, c.water)
    else if (id === 'park' || id === 'landcover_wood') paint(layer, { 'fill-color': c.park, 'fill-opacity': 1, 'line-color': c.park })
    else if (id === 'landuse_residential') paint(layer, { 'fill-color': c.residential, 'fill-opacity': 1 })
    else if (id === 'building') paint(layer, { 'fill-color': c.building, 'fill-outline-color': c.building })
    else if (id.startsWith('aeroway') && layer.type === 'fill') color(layer, c.residential)
    else if (id.startsWith('aeroway')) color(layer, c.roadCasing)
    else if (id.includes('motorway') && id.includes('casing')) color(layer, c.motorwayCasing)
    else if (id.includes('motorway')) color(layer, c.motorway)
    else if (id.includes('casing')) color(layer, c.roadCasing)
    else if (id.startsWith('highway_major')) color(layer, c.major)
    else if (id.startsWith('highway') || id.startsWith('road')) color(layer, c.road)
    else if (id.startsWith('railway')) color(layer, c.rail)
    else if (id.startsWith('boundary')) color(layer, c.boundary)
    if (layer.type === 'symbol') {
      const major = /city|country|state/.test(id)
      paint(layer, { 'text-color': major ? c.text : c.textMuted, 'text-halo-color': c.halo, 'text-halo-width': 1.4 })
    }
  }
  return style
}

function pinElement(label, active) {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = `map-pin ${active ? 'is-active' : ''}`
  el.setAttribute('aria-label', label)
  el.innerHTML = '<span></span>'
  return el
}

/**
 * markers: [{ id, lat, lng, label }]; selectedId highlights and centres one marker;
 * onSelect(id) fires when a pin is clicked.
 */
export default function MapView({ markers, selectedId, onSelect, height = 360, zoom = 14 }) {
  const el = useRef(null)
  const map = useRef(null)
  const pins = useRef(new Map())
  const onSelectRef = useRef(onSelect)
  const { theme } = useTheme()
  const mode = theme === 'dark' ? 'dark' : 'light'
  const [failed, setFailed] = useState(false)
  // Until the first tiles are drawn the box shows a shimmer instead of an empty dark rectangle.
  const [ready, setReady] = useState(false)
  const points = markers.filter((m) => Number.isFinite(Number(m.lat)) && Number.isFinite(Number(m.lng)))
  const key = points.map((m) => `${m.id}:${m.lat}:${m.lng}`).join('|')

  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  // Create the map (again when the theme or the set of markers changes).
  useEffect(() => {
    if (!el.current || !points.length) return undefined
    let alive = true
    let instance
    loadStyle()
      .then((style) => {
        if (!alive) return
        instance = new maplibregl.Map({
          container: el.current,
          style: themed(style, mode),
          center: [Number(points[0].lng), Number(points[0].lat)],
          zoom,
          attributionControl: { compact: true },
          cooperativeGestures: true,
        })
        map.current = instance
        instance.once('load', () => alive && setReady(true))
        instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
        pins.current = new Map()
        points.forEach((m) => {
          const pin = pinElement(m.label, m.id === selectedId)
          pin.addEventListener('click', () => onSelectRef.current?.(m.id))
          const popup = new maplibregl.Popup({ offset: 26, closeButton: false }).setText(m.label)
          const marker = new maplibregl.Marker({ element: pin, anchor: 'bottom' }).setLngLat([Number(m.lng), Number(m.lat)]).setPopup(popup).addTo(instance)
          pins.current.set(m.id, { pin, marker })
        })
        if (points.length > 1) {
          const bounds = new maplibregl.LngLatBounds()
          points.forEach((m) => bounds.extend([Number(m.lng), Number(m.lat)]))
          instance.fitBounds(bounds, { padding: 56, maxZoom: 13, duration: 0 })
        }
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
      instance?.remove()
      map.current = null
    }
  }, [mode, key]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to and highlight the selected marker without rebuilding the map.
  useEffect(() => {
    pins.current.forEach(({ pin, marker }, id) => {
      pin.classList.toggle('is-active', id === selectedId)
      if (id === selectedId && map.current) {
        map.current.flyTo({ center: marker.getLngLat(), zoom: Math.max(map.current.getZoom(), 14), speed: 1.4 })
        if (!marker.getPopup().isOpen()) marker.togglePopup()
      } else if (marker.getPopup().isOpen()) marker.togglePopup()
    })
  }, [selectedId])

  if (!points.length || failed) return <div className="map-view map-view--empty" style={{ height }} />
  return <div ref={el} className={`map-view ${ready ? '' : 'map-view--loading'}`} style={{ height }} />
}
