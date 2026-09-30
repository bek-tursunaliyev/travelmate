import {
  FaHotel, FaUserTie, FaTaxi, FaUtensils, FaExchangeAlt, FaSimCard, FaTicketAlt, FaCar,
} from 'react-icons/fa'

// Service ids double as i18n keys: services.items.<id>.title / .desc
export const services = [
  { id: 'accommodation', icon: FaHotel, keywords: ['hotel', 'hostel', 'stay', 'mehmonxona', 'отель'], color: '#0A717B' },
  { id: 'guide', icon: FaUserTie, keywords: ['guide', 'tour', 'gid', 'экскурсия'], color: '#0d8a6a' },
  { id: 'taxi', icon: FaTaxi, keywords: ['taxi', 'transfer', 'ride', 'taksi', 'такси'], color: '#e0892b' },
  { id: 'food', icon: FaUtensils, keywords: ['food', 'restaurant', 'plov', 'taom', 'еда'], color: '#d0664a' },
  { id: 'exchange', icon: FaExchangeAlt, keywords: ['exchange', 'currency', 'money', 'valyuta', 'обмен'], color: '#3f7fbf' },
  { id: 'esim', icon: FaSimCard, keywords: ['esim', 'sim', 'internet', 'data', 'mobile'], color: '#7a5bc4' },
  { id: 'tickets', icon: FaTicketAlt, keywords: ['ticket', 'bus', 'flight', 'cinema', 'event', 'chipta', 'bilet'], color: '#F4A37A' },
  { id: 'rentcar', icon: FaCar, keywords: ['car', 'rent', 'rental', 'avto', 'аренда'], color: '#2d6f8f' },
]

export const serviceById = Object.fromEntries(services.map((s) => [s.id, s]))

// Tickets have their own page; every other service lists offers on /services/:id
export const serviceHref = (id) => (id === 'tickets' ? '/tickets' : `/services/${id}`)

// Offers shown on /services/:id — unit maps to common.per.<unit>
export const offers = {
  accommodation: [
    { id: 'acc-1', name: 'Registan Plaza Hotel', location: 'Samarkand', price: 65, unit: 'night', rating: 4.8, reviews: 1284, tags: ['Free cancellation', 'Breakfast'] },
    { id: 'acc-2', name: 'Silk Road Boutique', location: 'Bukhara', price: 48, unit: 'night', rating: 4.9, reviews: 932, tags: ['Old town', 'Courtyard'] },
    { id: 'acc-3', name: 'Hyatt Regency', location: 'Tashkent', price: 140, unit: 'night', rating: 4.7, reviews: 2210, tags: ['Pool', 'Spa'] },
    { id: 'acc-4', name: 'Orient Star Guesthouse', location: 'Khiva', price: 35, unit: 'night', rating: 4.6, reviews: 418, tags: ['Inside Itchan Kala'] },
    { id: 'acc-5', name: 'Galata Loft Apartments', location: 'Istanbul', price: 90, unit: 'night', rating: 4.7, reviews: 1650, tags: ['Kitchen', 'City view'] },
    { id: 'acc-6', name: 'Marina Suites', location: 'Dubai', price: 180, unit: 'night', rating: 4.8, reviews: 3120, tags: ['Sea view', 'Pool'] },
  ],
  guide: [
    { id: 'gd-1', name: 'Samarkand Old City walk', location: 'Samarkand', price: 25, unit: 'person', rating: 4.9, reviews: 2140, tags: ['3 hours', 'EN · RU · UZ'] },
    { id: 'gd-2', name: 'Bukhara heritage day tour', location: 'Bukhara', price: 30, unit: 'person', rating: 4.9, reviews: 1180, tags: ['6 hours', 'Lunch included'] },
    { id: 'gd-3', name: 'Tashkent metro & bazaars', location: 'Tashkent', price: 20, unit: 'person', rating: 4.8, reviews: 860, tags: ['4 hours', 'Chorsu bazaar'] },
    { id: 'gd-4', name: 'Itchan Kala by sunset', location: 'Khiva', price: 22, unit: 'person', rating: 4.8, reviews: 540, tags: ['2.5 hours'] },
    { id: 'gd-5', name: 'Chimgan mountains hike', location: 'Tashkent region', price: 45, unit: 'person', rating: 4.7, reviews: 390, tags: ['Full day', 'Transport'] },
    { id: 'gd-6', name: 'Tashkent food tour', location: 'Tashkent', price: 35, unit: 'person', rating: 4.9, reviews: 720, tags: ['Plov tasting'] },
  ],
  taxi: [
    { id: 'tx-1', name: 'Airport transfer', location: 'Tashkent (TAS)', price: 12, unit: 'ride', rating: 4.8, reviews: 8420, tags: ['Meet & greet', 'Fixed price'] },
    { id: 'tx-2', name: 'Economy city ride', location: 'Tashkent', price: 3, unit: 'ride', rating: 4.6, reviews: 15200, tags: ['4 seats'] },
    { id: 'tx-3', name: 'Comfort city ride', location: 'Tashkent', price: 6, unit: 'ride', rating: 4.7, reviews: 6300, tags: ['A/C', 'New cars'] },
    { id: 'tx-4', name: 'Intercity Tashkent → Samarkand', location: 'Tashkent', price: 55, unit: 'ride', rating: 4.8, reviews: 1900, tags: ['4 hours', 'Door to door'] },
    { id: 'tx-5', name: 'Minivan (7 seats)', location: 'All cities', price: 25, unit: 'ride', rating: 4.7, reviews: 740, tags: ['Luggage space'] },
    { id: 'tx-6', name: 'Business class', location: 'Tashkent', price: 15, unit: 'ride', rating: 4.9, reviews: 980, tags: ['Premium cars'] },
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
  esim: [
    { id: 'es-1', name: 'Uzbekistan 5 GB · 7 days', location: 'Uzbekistan', price: 6, unit: 'plan', rating: 4.8, reviews: 5400, tags: ['4G/5G', 'Instant QR'] },
    { id: 'es-2', name: 'Uzbekistan 10 GB · 15 days', location: 'Uzbekistan', price: 10, unit: 'plan', rating: 4.9, reviews: 12480, tags: ['Best seller'] },
    { id: 'es-3', name: 'Uzbekistan 20 GB · 30 days', location: 'Uzbekistan', price: 17, unit: 'plan', rating: 4.8, reviews: 3900, tags: ['Hotspot'] },
    { id: 'es-4', name: 'Central Asia 10 GB · 30 days', location: '5 countries', price: 19, unit: 'plan', rating: 4.7, reviews: 1500, tags: ['Multi-country'] },
    { id: 'es-5', name: 'Türkiye 10 GB · 15 days', location: 'Türkiye', price: 12, unit: 'plan', rating: 4.7, reviews: 2750, tags: ['4G/5G'] },
    { id: 'es-6', name: 'Global 5 GB · 30 days', location: '190+ countries', price: 25, unit: 'plan', rating: 4.6, reviews: 4100, tags: ['Worldwide'] },
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

// Rates are expressed as "1 unit of currency = X USD"
export const currencies = {
  USD: 1, EUR: 1.08, GBP: 1.27, RUB: 0.011, UZS: 0.0000787, TRY: 0.029,
  AED: 0.2723, CNY: 0.138, JPY: 0.0067, KZT: 0.0021,
}

// Favorites shown on the home page (name is translated via favorites.items.<key>)
export const favorites = [
  { key: 'esim', service: 'esim', offerId: 'es-2', count: 12480, rating: 4.9 },
  { key: 'taxi', service: 'taxi', offerId: 'tx-1', count: 8420, rating: 4.8 },
  { key: 'guide', service: 'guide', offerId: 'gd-1', count: 2140, rating: 4.9 },
  { key: 'train', service: 'tickets', offerId: 'bus-1', count: 6930, rating: 4.8 },
  { key: 'hotel', service: 'accommodation', offerId: 'acc-2', count: 1932, rating: 4.9 },
]
