import { allPlaces } from './places'
import { services, offers } from './services'
import { allLanguages, allTickets, venueLabel } from './tickets'
import { tours, tourOperator } from './tours'

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[→\-–—>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// Every word of the query must appear somewhere in the haystack.
function matches(query, ...fields) {
  const words = norm(query).split(' ').filter(Boolean)
  if (!words.length) return false
  const hay = norm(fields.flat().join(' '))
  return words.every((w) => hay.includes(w))
}

export function searchAll(query, t) {
  const q = norm(query)
  if (!q) return { places: [], services: [], offers: [], tickets: [], tours: [] }

  const placeHits = allPlaces.filter((p) => matches(q, p.name, p.country, p.nameEn, p.countryEn, p.tags))

  const serviceHits = services.filter((s) =>
    matches(q, s.id, s.keywords, t(`services.items.${s.id}.title`), t(`services.items.${s.id}.desc`)),
  )

  const offerHits = Object.entries(offers).flatMap(([service, list]) =>
    list
      .filter((o) => matches(q, o.name, o.location, o.tags, t(`services.items.${service}.title`)))
      .map((o) => ({ ...o, service })),
  )

  const ticketHits = allTickets.filter((tk) =>
    matches(q, allLanguages(tk.title), tk.from, tk.to, tk.carrier, venueLabel(tk), allLanguages(tk.genre), t(`tickets.categories.${tk.cat}`)),
  )

  const tourHits = tours.filter((tour) => matches(q, tour.title, tour.route, tourOperator(tour).name, tour.highlights))

  return { places: placeHits, services: serviceHits, offers: offerHits, tickets: ticketHits, tours: tourHits }
}

export const countResults = (r) =>
  r.places.length + r.services.length + r.offers.length + r.tickets.length + r.tours.length
