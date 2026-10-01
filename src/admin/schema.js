// What the admin panel can edit. Each section points to an array inside the content document
// (`path`), names its id field (`key`) and lists the form fields.
//
// Field types: text, textarea, number, bool, date, time, color, image (URL or Wikipedia title),
// i18n ({ en, uz, ru }), list (one value per line), pairs (lines "title | text"), select.
import { tourCities } from '../data/tours'
import { guideCities } from '../data/guides'

const placeFields = [
  { k: 'name', type: 'text', required: true },
  { k: 'country', type: 'text' },
  { k: 'photo', type: 'image' },
  { k: 'wiki', type: 'text', hint: 'wiki' },
  { k: 'tags', type: 'list' },
]

const offerFields = [
  { k: 'name', type: 'text', required: true },
  { k: 'location', type: 'text' },
  { k: 'price', type: 'number' },
  { k: 'unit', type: 'select', options: ['night', 'person', 'meal', 'day', 'rate'] },
  { k: 'rating', type: 'number', step: 0.1 },
  { k: 'reviews', type: 'number' },
  { k: 'tags', type: 'list' },
]

const routeFields = [
  { k: 'from', type: 'text', required: true },
  { k: 'to', type: 'text', required: true },
  { k: 'date', type: 'date' },
  { k: 'depart', type: 'time' },
  { k: 'arrive', type: 'time' },
  { k: 'duration', type: 'text' },
  { k: 'carrier', type: 'text' },
  { k: 'price', type: 'number' },
  { k: 'seats', type: 'number' },
]

const showFields = [
  { k: 'title', type: 'text', required: true },
  { k: 'photo', type: 'image' },
  { k: 'venue', type: 'select', options: (doc) => doc.venues.map((v) => [v.id, `${v.name} · ${v.city}`]) },
  { k: 'date', type: 'date' },
  { k: 'time', type: 'time' },
  { k: 'hall', type: 'text' },
  { k: 'genre', type: 'text' },
  { k: 'price', type: 'number' },
  { k: 'seats', type: 'number' },
]

const placeRow = (r) => ({ title: r.name, sub: r.country, image: r.photo || r.wiki })
const offerRow = (r) => ({ title: r.name, sub: `${r.location || ''} · $${r.price} · ★ ${r.rating ?? '—'}` })
const routeRow = (r) => ({ title: `${r.from} → ${r.to}`, sub: `${r.date || ''} ${r.depart || ''} · ${r.carrier || ''} · $${r.price}` })
const showRow = (doc) => (r) => {
  const v = doc.venues.find((x) => x.id === r.venue)
  return { title: r.title, sub: `${r.date || ''} ${r.time || ''} · ${v ? v.name : r.venue || ''} · $${r.price}`, image: r.photo }
}

export const groups = [
  {
    id: 'home',
    sections: [
      {
        id: 'hero', path: ['heroSlides'], key: 'id',
        row: (r) => ({ title: r.title?.en || r.title?.uz, sub: r.text?.en || r.text?.uz, image: r.image }),
        fields: [
          { k: 'image', type: 'image', required: true },
          { k: 'title', type: 'i18n', required: true },
          { k: 'text', type: 'i18n', long: true },
        ],
      },
      {
        id: 'stats', path: ['stats'], key: 'key',
        row: (r) => ({ title: `${r.value}${r.suffix || ''}`, sub: r.label || r.key }),
        fields: [
          { k: 'label', type: 'text', hint: 'statLabel' },
          { k: 'value', type: 'number', step: 0.1, required: true },
          { k: 'suffix', type: 'text' },
          { k: 'digits', type: 'number' },
        ],
      },
    ],
  },
  {
    id: 'places',
    sections: [
      { id: 'landmarks', path: ['places', 'landmarks'], key: 'slug', row: placeRow, fields: placeFields },
      { id: 'destinations', path: ['places', 'destinations'], key: 'slug', row: placeRow, fields: placeFields },
      { id: 'regions', path: ['places', 'regions'], key: 'slug', row: placeRow, fields: placeFields },
    ],
  },
  {
    id: 'tours',
    sections: [
      {
        id: 'tours', path: ['tours'], key: 'slug',
        row: (r) => ({ title: r.title, sub: `${r.days} d · $${r.price} · ${(r.route || []).join(' → ')}`, image: r.wiki }),
        fields: [
          { k: 'title', type: 'text', required: true },
          { k: 'operator', type: 'select', options: (doc) => doc.operators.map((o) => [o.id, o.name]) },
          { k: 'days', type: 'number', required: true },
          { k: 'price', type: 'number', required: true },
          { k: 'wiki', type: 'image' },
          { k: 'route', type: 'list' },
          { k: 'group', type: 'select', options: ['small', 'private'] },
          { k: 'stay', type: 'select', options: ['guesthouse', 'comfort', 'luxury', 'yurt'] },
          { k: 'season', type: 'text' },
          { k: 'transport', type: 'list', hint: 'transport' },
          { k: 'highlights', type: 'list' },
          { k: 'itinerary', type: 'pairs' },
          { k: 'included', type: 'list', hint: 'included' },
          { k: 'excluded', type: 'list', hint: 'excluded' },
        ],
      },
      {
        id: 'operators', path: ['operators'], key: 'id',
        row: (r) => ({ title: r.name, sub: r.city }),
        fields: [
          { k: 'name', type: 'text', required: true },
          { k: 'city', type: 'select', options: tourCities },
        ],
      },
    ],
  },
  {
    id: 'guides',
    sections: [
      {
        id: 'guides', path: ['guides'], key: 'id',
        row: (r) => ({ title: r.name, sub: `${r.city} · $${r.price}/h · ★ ${r.rating}` }),
        fields: [
          { k: 'name', type: 'text', required: true },
          { k: 'city', type: 'select', options: guideCities },
          { k: 'languages', type: 'list', hint: 'langCodes' },
          { k: 'price', type: 'number' },
          { k: 'rating', type: 'number', step: 0.1 },
          { k: 'reviews', type: 'number' },
          { k: 'years', type: 'number' },
          { k: 'responds', type: 'number' },
          { k: 'verified', type: 'bool' },
          { k: 'topics', type: 'list' },
          { k: 'tours', type: 'list' },
          { k: 'bio', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'offers',
    sections: ['accommodation', 'food', 'exchange', 'rentcar', 'guide'].map((id) => ({
      id: `offers-${id}`, path: ['offers', id], key: 'id', row: offerRow, fields: offerFields,
    })),
  },
  {
    id: 'esim',
    sections: [
      {
        id: 'esimPlans', path: ['esimPlans'], key: 'id',
        row: (r) => ({ title: `${r.operator} · ${r.gb ? `${r.gb} GB` : '∞'} · ${r.days} d`, sub: `$${r.price}${r.popular ? ' · ★' : ''}` }),
        fields: [
          { k: 'operator', type: 'select', options: (doc) => doc.esimOperators.map((o) => [o.id, o.name]) },
          { k: 'gb', type: 'number', hint: 'gb' },
          { k: 'days', type: 'number', required: true },
          { k: 'price', type: 'number', required: true },
          { k: 'popular', type: 'bool' },
        ],
      },
      {
        id: 'esimOperators', path: ['esimOperators'], key: 'id',
        row: (r) => ({ title: r.name, sub: r.network, image: r.logo }),
        fields: [
          { k: 'name', type: 'text', required: true },
          { k: 'logo', type: 'image', hint: 'logo' },
          { k: 'color', type: 'color' },
          { k: 'ink', type: 'color' },
          { k: 'network', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'tickets',
    sections: [
      { id: 'trains', path: ['tickets', 'bus'], key: 'id', row: routeRow, fields: routeFields },
      { id: 'flights', path: ['tickets', 'flights'], key: 'id', row: routeRow, fields: routeFields, hint: 'domestic' },
      { id: 'cinema', path: ['tickets', 'cinema'], key: 'id', rowFor: showRow, fields: showFields },
      { id: 'events', path: ['tickets', 'events'], key: 'id', rowFor: showRow, fields: showFields },
      {
        id: 'venues', path: ['venues'], key: 'id',
        row: (r) => ({ title: r.name, sub: `${r.city} · ${r.address || ''} · ${r.lat}, ${r.lng}` }),
        fields: [
          { k: 'name', type: 'text', required: true },
          { k: 'city', type: 'text', required: true },
          { k: 'address', type: 'text' },
          { k: 'lat', type: 'number', step: 0.0001, hint: 'coords' },
          { k: 'lng', type: 'number', step: 0.0001 },
        ],
      },
    ],
  },
  {
    id: 'transfers',
    sections: [
      {
        id: 'transferDestinations', path: ['transferDestinations'], key: 'id',
        row: (r) => ({ title: r.name, sub: `${r.km} km · ${r.hours} h` }),
        fields: [
          { k: 'name', type: 'text', required: true },
          { k: 'km', type: 'number', required: true },
          { k: 'hours', type: 'number', step: 0.5 },
        ],
      },
      {
        id: 'vehicleClasses', path: ['vehicleClasses'], key: 'id',
        row: (r) => ({ title: r.name || r.id, sub: `${r.passengers} pax · ${r.luggage} bags · $${r.rate}/km`, image: r.wiki }),
        fields: [
          { k: 'name', type: 'text' },
          { k: 'models', type: 'text' },
          { k: 'wiki', type: 'image' },
          { k: 'passengers', type: 'number', required: true },
          { k: 'luggage', type: 'number' },
          { k: 'rate', type: 'number', step: 0.01, hint: 'rate' },
          { k: 'min', type: 'number' },
        ],
      },
    ],
  },
]

export const allSections = groups.flatMap((g) => g.sections.map((s) => ({ ...s, group: g.id })))
