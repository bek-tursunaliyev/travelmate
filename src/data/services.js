import {
  FaHotel, FaUserTie, FaTaxi, FaUtensils, FaExchangeAlt, FaSimCard, FaTicketAlt, FaCar, FaLandmark, FaRoute,
} from 'react-icons/fa'

// Service ids double as i18n keys: services.items.<id>.title / .desc
export const services = [
  { id: 'tours', icon: FaRoute, keywords: ['tour', 'tours', 'package', 'trip', 'tur', 'paket', 'тур'], color: '#0a717b' },
  { id: 'accommodation', icon: FaHotel, keywords: ['hotel', 'hostel', 'stay', 'mehmonxona', 'отель'], color: '#0A717B' },
  { id: 'guide', icon: FaUserTie, keywords: ['guide', 'tour', 'gid', 'экскурсия'], color: '#0d8a6a' },
  { id: 'taxi', icon: FaTaxi, keywords: ['taxi', 'transfer', 'ride', 'taksi', 'такси'], color: '#e0892b' },
  { id: 'food', icon: FaUtensils, keywords: ['food', 'restaurant', 'plov', 'taom', 'еда'], color: '#d0664a' },
  { id: 'exchange', icon: FaExchangeAlt, keywords: ['exchange', 'currency', 'money', 'valyuta', 'обмен'], color: '#3f7fbf' },
  { id: 'esim', icon: FaSimCard, keywords: ['esim', 'sim', 'internet', 'data', 'mobile'], color: '#7a5bc4' },
  { id: 'tickets', icon: FaTicketAlt, keywords: ['ticket', 'bus', 'flight', 'cinema', 'event', 'chipta', 'bilet'], color: '#F4A37A' },
  { id: 'places', icon: FaLandmark, keywords: ['places', 'attractions', 'sights', 'landmark', 'joylar', 'достопримечательности'], color: '#b5527a' },
  { id: 'rentcar', icon: FaCar, keywords: ['car', 'rent', 'rental', 'avto', 'аренда'], color: '#2d6f8f' },
]

export const serviceById = Object.fromEntries(services.map((s) => [s.id, s]))

// Tickets, places and guides have their own pages; every other service lists offers on /services/:id
const ownPages = { tickets: '/tickets', places: '/places', guide: '/guides', tours: '/tours', taxi: '/transfers', esim: '/esim' }
export const serviceHref = (id) => ownPages[id] || `/services/${id}`

// Offers shown on /services/:id — unit maps to common.per.<unit>
const defaultOffers = {
  accommodation: [
    { id: 'acc-1', name: 'Registan Plaza Hotel', location: 'Samarkand', price: 65, unit: 'night', rating: 4.8, reviews: 1284, tags: ['Free cancellation', 'Breakfast'] },
    { id: 'acc-2', name: 'Silk Road Boutique', location: 'Bukhara', price: 48, unit: 'night', rating: 4.9, reviews: 932, tags: ['Old town', 'Courtyard'] },
    { id: 'acc-3', name: 'Hyatt Regency', location: 'Tashkent', price: 140, unit: 'night', rating: 4.7, reviews: 2210, tags: ['Pool', 'Spa'] },
    { id: 'acc-4', name: 'Orient Star Guesthouse', location: 'Khiva', price: 35, unit: 'night', rating: 4.6, reviews: 418, tags: ['Inside Itchan Kala'] },
    { id: 'acc-5', name: 'Wyndham Tashkent', location: 'Tashkent', price: 95, unit: 'night', rating: 4.7, reviews: 1650, tags: ['Pool', 'City centre'] },
    { id: 'acc-6', name: 'Charvak Lake Resort', location: 'Tashkent region', price: 110, unit: 'night', rating: 4.8, reviews: 920, tags: ['Lake view', 'Mountains'] },
  ],
  guide: [
    { id: 'gd-1', name: 'Samarkand Old City walk', location: 'Samarkand', price: 25, unit: 'person', rating: 4.9, reviews: 2140, tags: ['3 hours', 'EN · RU · UZ'] },
    { id: 'gd-2', name: 'Bukhara heritage day tour', location: 'Bukhara', price: 30, unit: 'person', rating: 4.9, reviews: 1180, tags: ['6 hours', 'Lunch included'] },
    { id: 'gd-3', name: 'Tashkent metro & bazaars', location: 'Tashkent', price: 20, unit: 'person', rating: 4.8, reviews: 860, tags: ['4 hours', 'Chorsu bazaar'] },
    { id: 'gd-4', name: 'Itchan Kala by sunset', location: 'Khiva', price: 22, unit: 'person', rating: 4.8, reviews: 540, tags: ['2.5 hours'] },
    { id: 'gd-5', name: 'Chimgan mountains hike', location: 'Tashkent region', price: 45, unit: 'person', rating: 4.7, reviews: 390, tags: ['Full day', 'Transport'] },
    { id: 'gd-6', name: 'Tashkent food tour', location: 'Tashkent', price: 35, unit: 'person', rating: 4.9, reviews: 720, tags: ['Plov tasting'] },
  ],
  food: [
    { id: 'fd-1', name: 'Besh Qozon — Plov Center', location: 'Tashkent', price: 6, unit: 'meal', rating: 4.8, reviews: 9800, tags: ['Uzbek', 'Iconic'] },
    { id: 'fd-2', name: 'Platan', location: 'Samarkand', price: 15, unit: 'meal', rating: 4.7, reviews: 2300, tags: ['Terrace', 'Uzbek & European'] },
    { id: 'fd-3', name: 'Old Bukhara', location: 'Bukhara', price: 12, unit: 'meal', rating: 4.7, reviews: 1850, tags: ['Rooftop', 'Live music'] },
    { id: 'fd-4', name: 'Caravan', location: 'Tashkent', price: 18, unit: 'meal', rating: 4.8, reviews: 3100, tags: ['Craft shop', 'Garden'] },
    { id: 'fd-5', name: 'Samsa street tour', location: 'Samarkand', price: 9, unit: 'meal', rating: 4.9, reviews: 610, tags: ['Tandoor samsa'] },
    { id: 'fd-6', name: 'Terrassa Khiva', location: 'Khiva', price: 11, unit: 'meal', rating: 4.6, reviews: 720, tags: ['City wall view'] },
  ],
  exchange: [
    { id: 'ex-1', name: 'Kapitalbank exchange desk', location: 'Tashkent, Amir Temur sq.', price: 0, unit: 'rate', rating: 4.7, reviews: 1210, tags: ['0% commission', '24/7'] },
    { id: 'ex-2', name: 'Hamkorbank', location: 'Samarkand, Registan st.', price: 0, unit: 'rate', rating: 4.6, reviews: 640, tags: ['0% commission'] },
    { id: 'ex-3', name: 'Airport exchange TAS', location: 'Tashkent Airport', price: 0, unit: 'rate', rating: 4.3, reviews: 2980, tags: ['Arrivals hall'] },
    { id: 'ex-4', name: 'Asakabank', location: 'Bukhara, Lyabi-Hauz', price: 0, unit: 'rate', rating: 4.5, reviews: 380, tags: ['Card cash-out'] },
  ],
  rentcar: [
    { id: 'rc-1', name: 'Chevrolet Cobalt', location: 'Tashkent', price: 30, unit: 'day', rating: 4.6, reviews: 1320, tags: ['5 seats', 'Automatic'] },
    { id: 'rc-2', name: 'Chevrolet Tracker', location: 'Tashkent', price: 45, unit: 'day', rating: 4.7, reviews: 640, tags: ['SUV', 'Automatic'] },
    { id: 'rc-3', name: 'Chevrolet Malibu', location: 'Samarkand', price: 55, unit: 'day', rating: 4.8, reviews: 510, tags: ['Business', 'Automatic'] },
    { id: 'rc-4', name: 'Kia K5', location: 'Tashkent', price: 60, unit: 'day', rating: 4.8, reviews: 470, tags: ['Sedan', 'Automatic'] },
    { id: 'rc-5', name: 'BYD Song Plus EV', location: 'Tashkent', price: 70, unit: 'day', rating: 4.9, reviews: 290, tags: ['Electric', '500 km range'] },
    { id: 'rc-6', name: 'Toyota Land Cruiser', location: 'Bukhara', price: 150, unit: 'day', rating: 4.9, reviews: 210, tags: ['4x4', 'Desert trips'] },
  ],
}

export let offers = defaultOffers
export const offerServices = Object.keys(defaultOffers)

export function setOffers(next = {}) {
  offers = { ...defaultOffers, ...Object.fromEntries(Object.entries(next).filter(([, v]) => Array.isArray(v))) }
}

export { defaultOffers }

// Rates are expressed as "1 unit of currency = X USD"
// Polish złoty (PLN) is intentionally not offered anywhere on the site.
export const currencies = {
  USD: 1, EUR: 1.08, GBP: 1.27, RUB: 0.011, UZS: 0.0000787, TRY: 0.029,
  AED: 0.2723, CNY: 0.138, JPY: 0.0067, KZT: 0.0021,
}

// Prices are stored in USD; UZS is shown underneath as a reference.
export const usdToUzs = (usd) => usd / currencies.UZS
