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
  { id: 'tashkent-city-park', name: 'Tashkent City Park', city: 'Tashkent', address: 'Tashkent City, Olmazor district', lat: 41.3163, lng: 69.2486 },
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
  // Real films: `wiki` loads the official poster and the synopsis from Wikipedia. Showtimes are sample data.
  cinema: [
    { id: 'cn-1', title: 'Spider-Man: Brand New Day', wiki: 'Spider-Man:_Brand_New_Day', venue: 'magic-cinema', date: '2026-10-03', times: ['12:40', '16:10', '19:30', '22:15'], time: '19:30', hall: 'IMAX', price: 7, seats: 34, genre: 'Action · Superhero', age: '12+', lang: 'UZ · RU' },
    { id: 'cn-2', title: 'The Odyssey', wiki: 'The_Odyssey_(2026_film)', venue: 'cinematica', date: '2026-10-03', times: ['13:00', '17:20', '21:00'], time: '21:00', hall: 'Hall 3', price: 6, seats: 12, genre: 'Epic · Adventure', age: '16+', lang: 'RU · EN' },
    { id: 'cn-3', title: 'Toy Story 5', wiki: 'Toy_Story_5', venue: 'kinopark-samarkand', date: '2026-10-04', times: ['10:30', '13:00', '15:30', '18:00'], time: '18:00', hall: 'Hall 1', price: 4, seats: 40, genre: 'Animation · Family', age: '0+', lang: 'UZ · RU' },
    { id: 'cn-4', title: 'Supergirl', wiki: 'Supergirl_(2026_film)', venue: 'magic-cinema', date: '2026-10-04', times: ['14:00', '18:45', '21:30'], time: '21:30', hall: 'Hall 2', price: 6, seats: 22, genre: 'Action · Sci-fi', age: '12+', lang: 'RU' },
    { id: 'cn-5', title: 'Minions & Monsters', wiki: 'Minions_3', venue: 'bukhara-kino', date: '2026-10-05', times: ['11:00', '14:20', '17:00'], time: '17:00', hall: 'Hall 1', price: 4, seats: 30, genre: 'Animation · Comedy', age: '0+', lang: 'UZ · RU' },
    { id: 'cn-6', title: 'Project Hail Mary', wiki: 'Project_Hail_Mary_(film)', venue: 'cinematica', date: '2026-10-05', times: ['15:10', '20:15'], time: '20:15', hall: 'VIP', price: 9, seats: 6, genre: 'Sci-fi · Drama', age: '12+', lang: 'RU · EN' },
  ],
  events: [
    { id: 'ev-0', title: { en: 'Tashkent Beer Festival', uz: 'Toshkent pivo festivali', ru: 'Ташкентский фестиваль пива' }, venue: 'tashkent-city-park', photo: 'Oktoberfest', date: '2026-10-10', time: '16:00', hall: { en: 'Open air · 18+', uz: 'Ochiq havoda · 18+', ru: 'Под открытым небом · 18+' }, price: 8, seats: 400, genre: { en: 'Festival', uz: 'Festival', ru: 'Фестиваль' },
      description: { en: 'Two days of craft and local beer, live bands, street food and games in Tashkent City Park. Entry ticket includes a festival glass. 18+, ID required.', uz: "Tashkent City Park'da ikki kunlik mahalliy va kraft pivo, jonli musiqa, ko'cha taomlari va o'yinlar. Kirish chiptasiga festival stakani kiradi. 18+, hujjat talab qilinadi.", ru: 'Два дня крафтового и местного пива, живая музыка, уличная еда и игры в Tashkent City Park. В билет входит фирменный бокал. 18+, нужен документ.' } },
    { id: 'ev-1', title: { en: 'Tashkent Jazz Night', uz: 'Toshkent jaz oqshomi', ru: 'Ташкентский вечер джаза' }, venue: 'ilkhom', photo: 'Amir_Timur_Square', date: '2026-10-11', time: '20:00', hall: { en: 'Standing', uz: 'Tik turgan holda', ru: 'Стоячие места' }, price: 15, seats: 48, genre: { en: 'Concert', uz: 'Konsert', ru: 'Концерт' },
      description: { en: 'An evening of jazz standards and Uzbek folk themes with local and guest musicians at the Ilkhom Theatre.', uz: "Ilhom teatrida mahalliy va mehmon musiqachilar ijrosida jaz standartlari va o'zbek xalq kuylari oqshomi.", ru: 'Вечер джазовых стандартов и узбекских народных мотивов с местными и приглашёнными музыкантами в театре «Ильхом».' } },
    { id: 'ev-2', title: { en: 'Silk & Spices Festival', uz: 'Ipak va ziravorlar festivali', ru: 'Фестиваль «Шёлк и специи»' }, venue: 'lyabi-hauz', photo: 'Lyab-i_Hauz', date: '2026-10-17', time: '11:00', hall: { en: 'Open air', uz: 'Ochiq havoda', ru: 'Под открытым небом' }, price: 10, seats: 120, genre: { en: 'Festival', uz: 'Festival', ru: 'Фестиваль' },
      description: { en: 'Crafts fair, silk and spice market, folk dance and music around the Lyab-i Hauz pool in old Bukhara.', uz: "Eski Buxoroda Labi hovuz atrofida hunarmandlar yarmarkasi, ipak va ziravorlar bozori, xalq raqslari va musiqasi.", ru: 'Ярмарка ремёсел, рынок шёлка и специй, народные танцы и музыка у Ляби-хауза в старой Бухаре.' } },
    { id: 'ev-3', title: { en: 'Registan Light Show', uz: 'Registon yorug‘lik shousi', ru: 'Световое шоу на Регистане' }, venue: 'registan', photo: 'Registan', date: '2026-10-18', time: '21:00', hall: { en: 'Open air', uz: 'Ochiq havoda', ru: 'Под открытым небом' }, price: 12, seats: 64, genre: { en: 'Show', uz: 'Shou', ru: 'Шоу' },
      description: { en: 'A light and sound show projected onto the three madrasas of the Registan, telling the story of Samarkand.', uz: "Registonning uchta madrasasiga proyeksiya qilinadigan, Samarqand tarixini hikoya qiluvchi yorug'lik va ovoz shousi.", ru: 'Световое шоу на фасадах трёх медресе Регистана, рассказывающее историю Самарканда.' } },
    { id: 'ev-4', title: { en: 'Uzbekistan vs Iran — Football', uz: 'O‘zbekiston — Eron: futbol', ru: 'Узбекистан — Иран: футбол' }, venue: 'milliy-stadium', photo: 'Tashkent', date: '2026-11-14', time: '19:00', hall: { en: 'Sector B', uz: 'B sektor', ru: 'Сектор B' }, price: 18, seats: 230, genre: { en: 'Sport', uz: 'Sport', ru: 'Спорт' },
      description: { en: 'International friendly at the Milliy Stadium. Gates open 90 minutes before kick-off.', uz: "Milliy stadionda xalqaro o'rtoqlik o'yini. Darvozalar o'yin boshlanishidan 90 daqiqa oldin ochiladi.", ru: 'Товарищеский матч на стадионе «Миллий». Вход открывается за 90 минут до начала.' } },
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

// Text of a per-language field ({ en, uz, ru } or a plain string).
export const localized = (v, lng) => (v && typeof v === 'object' ? v[lng] || v.en || v.uz || '' : v || '')

export const findTicket = (cat, id) => (tickets[cat] || []).find((tk) => tk.id === id)

// Display name of a venue reference (falls back to plain text for older data).
export const venueLabel = (tk) => {
  const v = venueById(tk.venue)
  return v ? `${v.name}, ${v.city}` : tk.venue || ''
}

export const ticketName = (tk, lng) => localized(tk.title, lng) || `${tk.from} → ${tk.to}`

// Every language version of a field, for search.
export const allLanguages = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.values(v) : v)
