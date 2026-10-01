import { FaBus, FaPlane, FaFilm, FaMusic } from 'react-icons/fa'

// Tickets inside Uzbekistan. SAMPLE DATA, editable in the admin panel.
// Cinema and events point to a venue (`venue` id) with coordinates for the map and directions;
// `photo` is an image URL or a Wikipedia title. Venue coordinates are approximate.

export const ticketCategories = [
  { id: 'bus', icon: FaBus },
  { id: 'flights', icon: FaPlane },
  { id: 'cinema', icon: FaFilm },
  { id: 'events', icon: FaMusic },
]

const defaultVenues = [
  { id: 'magic-cinema', name: 'Magic Cinema', city: 'Tashkent', address: 'Next Mall, Shota Rustaveli street', lat: 41.2885, lng: 69.2636 },
  { id: 'cinematica', name: 'Cinematica', city: 'Tashkent', address: 'Samarqand Darvoza mall', lat: 41.3164, lng: 69.2229 },
  { id: 'kinopark-samarkand', name: 'Kinopark Samarkand', city: 'Samarkand', address: 'University boulevard', lat: 39.6542, lng: 66.9597 },
  { id: 'bukhara-kino', name: 'Bukhara Kinoteatr', city: 'Bukhara', address: 'Mustaqillik street', lat: 39.7681, lng: 64.4219 },
  { id: 'ilkhom', name: 'Ilkhom Theatre', city: 'Tashkent', address: 'Pakhtakor street 5', lat: 41.3170, lng: 69.2655 },
  { id: 'lyabi-hauz', name: 'Lyab-i Hauz square', city: 'Bukhara', address: 'Old town', lat: 39.7739, lng: 64.4199 },
  { id: 'registan', name: 'Registan square', city: 'Samarkand', address: 'Registan street', lat: 39.6548, lng: 66.9757 },
  { id: 'milliy-stadium', name: 'Milliy Stadium', city: 'Tashkent', address: 'Chilanzar district', lat: 41.2936, lng: 69.2018 },
]

const defaultTickets = {
  bus: [
    { id: 'bus-1', from: 'Tashkent', to: 'Samarkand', depart: '07:30', arrive: '09:40', date: '2026-10-04', carrier: 'Afrosiyob train', price: 22, seats: 14, duration: '2h 10m' },
    { id: 'bus-2', from: 'Tashkent', to: 'Bukhara', depart: '08:00', arrive: '14:30', date: '2026-10-04', carrier: 'Uzbekistan Express', price: 14, seats: 9, duration: '6h 30m' },
    { id: 'bus-3', from: 'Samarkand', to: 'Bukhara', depart: '10:15', arrive: '14:00', date: '2026-10-05', carrier: 'Silk Road Bus', price: 8, seats: 21, duration: '3h 45m' },
    { id: 'bus-4', from: 'Tashkent', to: 'Fergana', depart: '06:45', arrive: '11:50', date: '2026-10-06', carrier: 'Kamchik Line', price: 10, seats: 5, duration: '5h 05m' },
    { id: 'bus-5', from: 'Bukhara', to: 'Khiva', depart: '09:00', arrive: '16:20', date: '2026-10-07', carrier: 'Khorezm Travel', price: 12, seats: 12, duration: '7h 20m' },
    { id: 'bus-6', from: 'Tashkent', to: 'Termez', depart: '20:30', arrive: '07:40', date: '2026-10-08', carrier: 'Sharq night train', price: 18, seats: 8, duration: '11h 10m' },
  ],
  // Domestic flights only: region to region.
  flights: [
    { id: 'fl-1', from: 'Tashkent', to: 'Nukus', depart: '07:20', arrive: '09:05', date: '2026-10-05', carrier: 'Uzbekistan Airways', price: 89, seats: 11, duration: '1h 45m' },
    { id: 'fl-2', from: 'Tashkent', to: 'Urgench', depart: '09:40', arrive: '11:20', date: '2026-10-05', carrier: 'Uzbekistan Airways', price: 85, seats: 7, duration: '1h 40m' },
    { id: 'fl-3', from: 'Tashkent', to: 'Termez', depart: '12:10', arrive: '13:35', date: '2026-10-06', carrier: 'Silk Avia', price: 69, seats: 4, duration: '1h 25m' },
    { id: 'fl-4', from: 'Tashkent', to: 'Bukhara', depart: '15:00', arrive: '16:20', date: '2026-10-06', carrier: 'Uzbekistan Airways', price: 64, seats: 16, duration: '1h 20m' },
    { id: 'fl-5', from: 'Samarkand', to: 'Nukus', depart: '08:30', arrive: '10:05', date: '2026-10-07', carrier: 'Silk Avia', price: 75, seats: 6, duration: '1h 35m' },
    { id: 'fl-6', from: 'Tashkent', to: 'Karshi', depart: '18:45', arrive: '19:55', date: '2026-10-08', carrier: 'Uzbekistan Airways', price: 58, seats: 19, duration: '1h 10m' },
    { id: 'fl-7', from: 'Tashkent', to: 'Namangan', depart: '10:15', arrive: '11:05', date: '2026-10-09', carrier: 'Silk Avia', price: 45, seats: 12, duration: '50m' },
    { id: 'fl-8', from: 'Urgench', to: 'Samarkand', depart: '13:30', arrive: '15:00', date: '2026-10-10', carrier: 'Uzbekistan Airways', price: 72, seats: 9, duration: '1h 30m' },
  ],
  cinema: [
    { id: 'cn-1', title: 'The Last Caravan', venue: 'magic-cinema', photo: 'Aydar_Lake', date: '2026-10-03', time: '19:30', hall: 'IMAX', price: 7, seats: 34, genre: 'Adventure' },
    { id: 'cn-2', title: 'Neon Horizon', venue: 'cinematica', photo: 'Tashkent_Television_Tower', date: '2026-10-03', time: '21:45', hall: 'Hall 3', price: 5, seats: 12, genre: 'Sci-Fi' },
    { id: 'cn-3', title: 'Silk & Steel', venue: 'kinopark-samarkand', photo: 'Gur-e-Amir', date: '2026-10-04', time: '18:00', hall: 'Hall 1', price: 4, seats: 40, genre: 'History' },
    { id: 'cn-4', title: 'Midnight in Bukhara', venue: 'bukhara-kino', photo: 'Lyab-i_Hauz', date: '2026-10-05', time: '20:15', hall: 'VIP', price: 9, seats: 6, genre: 'Romance' },
  ],
  events: [
    { id: 'ev-1', title: 'Tashkent Jazz Night', venue: 'ilkhom', photo: 'Amir_Timur_Square', date: '2026-10-11', time: '20:00', hall: 'Standing', price: 15, seats: 48, genre: 'Concert' },
    { id: 'ev-2', title: 'Silk & Spices Festival', venue: 'lyabi-hauz', photo: 'Lyab-i_Hauz', date: '2026-10-17', time: '11:00', hall: 'Open air', price: 10, seats: 120, genre: 'Festival' },
    { id: 'ev-3', title: 'Registan Light Show', venue: 'registan', photo: 'Registan', date: '2026-10-18', time: '21:00', hall: 'Open air', price: 12, seats: 64, genre: 'Show' },
    { id: 'ev-4', title: 'Uzbekistan vs Iran — Football', venue: 'milliy-stadium', photo: 'Tashkent', date: '2026-11-14', time: '19:00', hall: 'Sector B', price: 18, seats: 230, genre: 'Sport' },
  ],
}

export let tickets = defaultTickets
export let venues = defaultVenues
export let allTickets = []

function rebuild() {
  allTickets = Object.entries(tickets).flatMap(([cat, items]) => items.map((tk) => ({ ...tk, cat })))
}
rebuild()

export function setTickets(next = {}) {
  if (next.tickets && typeof next.tickets === 'object') {
    tickets = { ...defaultTickets, ...Object.fromEntries(Object.entries(next.tickets).filter(([, v]) => Array.isArray(v))) }
  }
  if (Array.isArray(next.venues)) venues = next.venues
  rebuild()
}

export const defaultTicketData = { tickets: defaultTickets, venues: defaultVenues }

export const venueById = (id) => venues.find((v) => v.id === id)

// Display name of a venue reference (falls back to plain text for older data).
export const venueLabel = (tk) => {
  const v = venueById(tk.venue)
  return v ? `${v.name}, ${v.city}` : tk.venue || ''
}

export const ticketName = (tk) => tk.title || `${tk.from} → ${tk.to}`
