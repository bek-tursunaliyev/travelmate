// Site content: one JSON document the admin panel edits and /api/content stores.
// The data modules keep working as plain imports; applyContent() swaps their live bindings.
import { defaultSite, setSite } from '../data/site.js'
import { defaultPlaces, setPlaces } from '../data/places.js'
import { defaultOffers, setOffers, defaultCompanies, setRentalCompanies } from '../data/services.js'
import { defaultTicketData, setTickets } from '../data/tickets.js'
import { defaultEsim, setEsim } from '../data/esim.js'
import { defaultTourData, setTours } from '../data/tours.js'
import { defaultGuideData, setGuides } from '../data/guides.js'
import { defaultTransferData, setTransfers } from '../data/transfers.js'

const CACHE_KEY = 'tm_content'

export const clone = (v) => JSON.parse(JSON.stringify(v))

export function defaultContent() {
  return clone({
    ...defaultSite,
    places: defaultPlaces,
    offers: defaultOffers,
    rentalCompanies: defaultCompanies,
    ...defaultTicketData,
    ...defaultEsim,
    ...defaultTourData,
    ...defaultGuideData,
    ...defaultTransferData,
  })
}

// Pushes a content document into the data modules. Missing keys keep their defaults.
export function applyContent(doc) {
  if (!doc || typeof doc !== 'object') return
  setSite(doc)
  setPlaces(doc.places)
  setOffers(doc.offers)
  setRentalCompanies(doc.rentalCompanies)
  setTickets(doc)
  setEsim(doc)
  setTours(doc)
  setGuides(doc)
  setTransfers(doc)
}

// Last content seen by this browser, so repeat visits render the latest data immediately.
export function readCachedContent() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY))
  } catch {
    return null
  }
}

export function cacheContent(doc) {
  try {
    if (doc) localStorage.setItem(CACHE_KEY, JSON.stringify(doc))
    else localStorage.removeItem(CACHE_KEY)
  } catch { /* quota or private mode */ }
}

export async function fetchContent() {
  const res = await fetch('/api/content', { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`content ${res.status}`)
  const data = await res.json()
  return data.content || null
}
