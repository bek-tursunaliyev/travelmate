import { FaBus, FaPlane, FaFilm, FaMusic } from 'react-icons/fa'

export const ticketCategories = [
  { id: 'bus', icon: FaBus },
  { id: 'flights', icon: FaPlane },
  { id: 'cinema', icon: FaFilm },
  { id: 'events', icon: FaMusic },
]

// `title` is the booking name; for routes, from/to render as a journey.
export const tickets = {
  bus: [
    { id: 'bus-1', from: 'Tashkent', to: 'Samarkand', depart: '07:30', arrive: '09:40', date: '2026-10-04', carrier: 'Afrosiyob train', price: 22, seats: 14, duration: '2h 10m' },
    { id: 'bus-2', from: 'Tashkent', to: 'Bukhara', depart: '08:00', arrive: '14:30', date: '2026-10-04', carrier: 'Uzbekistan Express', price: 14, seats: 9, duration: '6h 30m' },
    { id: 'bus-3', from: 'Samarkand', to: 'Bukhara', depart: '10:15', arrive: '14:00', date: '2026-10-05', carrier: 'Silk Road Bus', price: 8, seats: 21, duration: '3h 45m' },
    { id: 'bus-4', from: 'Tashkent', to: 'Fergana', depart: '06:45', arrive: '11:50', date: '2026-10-06', carrier: 'Kamchik Line', price: 10, seats: 5, duration: '5h 05m' },
    { id: 'bus-5', from: 'Bukhara', to: 'Khiva', depart: '09:00', arrive: '16:20', date: '2026-10-07', carrier: 'Khorezm Travel', price: 12, seats: 12, duration: '7h 20m' },
    { id: 'bus-6', from: 'Tashkent', to: 'Almaty', depart: '21:00', arrive: '07:30', date: '2026-10-08', carrier: 'Central Asia Coach', price: 28, seats: 8, duration: '10h 30m' },
  ],
  flights: [
    { id: 'fl-1', from: 'Tashkent', to: 'Istanbul', depart: '09:10', arrive: '12:40', date: '2026-10-05', carrier: 'Uzbekistan Airways · HY 271', price: 219, seats: 11, duration: '5h 30m' },
    { id: 'fl-2', from: 'Tashkent', to: 'Dubai', depart: '14:25', arrive: '17:05', date: '2026-10-06', carrier: 'flydubai · FZ 1942', price: 189, seats: 7, duration: '3h 40m' },
    { id: 'fl-3', from: 'Samarkand', to: 'Istanbul', depart: '06:50', arrive: '10:30', date: '2026-10-07', carrier: 'Turkish Airlines · TK 369', price: 245, seats: 4, duration: '5h 40m' },
    { id: 'fl-4', from: 'Tashkent', to: 'Seoul', depart: '22:40', arrive: '09:20', date: '2026-10-09', carrier: 'Asiana · OZ 574', price: 410, seats: 16, duration: '6h 40m' },
    { id: 'fl-5', from: 'Tashkent', to: 'London', depart: '11:00', arrive: '15:10', date: '2026-10-10', carrier: 'Uzbekistan Airways · HY 201', price: 480, seats: 6, duration: '7h 10m' },
    { id: 'fl-6', from: 'Tashkent', to: 'Moscow', depart: '07:15', arrive: '09:55', date: '2026-10-05', carrier: 'Aeroflot · SU 1873', price: 165, seats: 19, duration: '4h 40m' },
  ],
  cinema: [
    { id: 'cn-1', title: 'The Last Caravan', venue: 'Magic Cinema, Tashkent', date: '2026-10-03', time: '19:30', hall: 'IMAX', price: 7, seats: 34, genre: 'Adventure' },
    { id: 'cn-2', title: 'Neon Horizon', venue: 'Cinerama, Tashkent', date: '2026-10-03', time: '21:45', hall: 'Hall 3', price: 5, seats: 12, genre: 'Sci-Fi' },
    { id: 'cn-3', title: 'Silk & Steel', venue: 'Samarkand Cinema Park', date: '2026-10-04', time: '18:00', hall: 'Hall 1', price: 4, seats: 40, genre: 'History' },
    { id: 'cn-4', title: 'Midnight in Bukhara', venue: 'Bukhara Kinoteatr', date: '2026-10-05', time: '20:15', hall: 'VIP', price: 9, seats: 6, genre: 'Romance' },
  ],
  events: [
    { id: 'ev-1', title: 'Tashkent Jazz Night', venue: 'Ilkhom Theatre, Tashkent', date: '2026-10-11', time: '20:00', hall: 'Standing', price: 15, seats: 48, genre: 'Concert' },
    { id: 'ev-2', title: 'Silk & Spices Festival', venue: 'Lyabi-Hauz, Bukhara', date: '2026-10-17', time: '11:00', hall: 'Open air', price: 10, seats: 120, genre: 'Festival' },
    { id: 'ev-3', title: 'Registan Light Show', venue: 'Registan, Samarkand', date: '2026-10-18', time: '21:00', hall: 'Open air', price: 12, seats: 64, genre: 'Show' },
    { id: 'ev-4', title: 'Uzbekistan vs Iran — Football', venue: 'Milliy Stadium, Tashkent', date: '2026-11-14', time: '19:00', hall: 'Sector B', price: 18, seats: 230, genre: 'Sport' },
  ],
}

export const ticketName = (tk) => tk.title || `${tk.from} → ${tk.to}`

export const allTickets = Object.entries(tickets).flatMap(([cat, items]) =>
  items.map((tk) => ({ ...tk, cat })),
)
