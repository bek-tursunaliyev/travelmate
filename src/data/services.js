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

// Each hotel has its own page with rooms, details and booking.
export const hotelHref = (offer) => `/hotels/${encodeURIComponent(offer.id)}`

// Tickets, places and guides have their own pages; every other service lists offers on /services/:id
const ownPages = { tickets: '/tickets', places: '/places', guide: '/guides', tours: '/tours', taxi: '/transfers', esim: '/esim' }
export const serviceHref = (id) => ownPages[id] || `/services/${id}`

// Offers shown on /services/:id — unit maps to common.per.<unit>
const defaultOffers = {
  accommodation: [
    { id: 'acc-1', name: 'Hyatt Regency Tashkent', location: 'Tashkent', address: 'Navoi street 1A', lat: 41.3119, lng: 69.2794, photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/148_Hotel_Hyatt_Regency%2C_Mustafo_Kamol_Otaturk_Ko%27chasi_%28Taixkent%29.jpg/960px-148_Hotel_Hyatt_Regency%2C_Mustafo_Kamol_Otaturk_Ko%27chasi_%28Taixkent%29.jpg', stars: 5, price: 140, unit: 'night', rating: 4.7, reviews: 2210, checkIn: '14:00', amenities: ['pool', 'spa', 'gym', 'breakfast', 'wifi', 'parking', 'airport'], tags: ['City centre', 'Pool'], checkOut: '12:00', gallery: ['Amir_Timur_Square', 'Tashkent'], description: 'Five-star hotel in the business centre of Tashkent, a short walk from Amir Timur square and the Navoi Theatre. Large rooms with city views, an indoor pool and spa, and an airport shuttle on request.' },
    { id: 'acc-2', name: 'Hotel Uzbekistan', location: 'Tashkent', address: 'Mirobod district, Amir Timur square', lat: 41.3124, lng: 69.2830, photo: 'Amir_Timur_Square', stars: 4, price: 70, unit: 'night', rating: 4.3, reviews: 3480, checkIn: '14:00', amenities: ['breakfast', 'wifi', 'parking', 'restaurant'], tags: ['Landmark', 'Amir Timur square'], checkOut: '12:00', gallery: ['Tashkent', 'Tashkent_Metro'], description: 'The landmark hotel of Tashkent, overlooking Amir Timur square. Renovated rooms, a restaurant with Uzbek and European cuisine, and the metro one minute away — a practical base for exploring the capital.' },
    { id: 'acc-3', name: 'Registan Plaza Hotel', location: 'Samarkand', address: 'Shohruh Mirzo street 53', lat: 39.6559, lng: 66.9585, photo: 'Registan', stars: 4, price: 65, unit: 'night', rating: 4.8, reviews: 1284, checkIn: '14:00', amenities: ['breakfast', 'wifi', 'parking', 'pool', 'restaurant'], tags: ['Free cancellation', 'Breakfast'], checkOut: '12:00', gallery: ['Gur-e-Amir', 'Bibi-Khanym_Mosque'], description: 'Modern hotel a ten-minute walk from the Registan. Bright rooms, an outdoor pool for hot summer days and a generous breakfast before you set off to Gur-e-Amir and Shah-i-Zinda.' },
    { id: 'acc-4', name: 'Silk Road Boutique', location: 'Bukhara', address: 'Old town, near Lyab-i Hauz', lat: 39.7741, lng: 64.4187, photo: 'Lyab-i_Hauz', stars: 3, price: 48, unit: 'night', rating: 4.9, reviews: 932, checkIn: '13:00', amenities: ['breakfast', 'wifi', 'airport'], tags: ['Old town', 'Courtyard'], checkOut: '12:00', gallery: ['Po-i-Kalyan', 'Chor_Minor'], description: 'Small family-run boutique hotel in a restored merchant house in the old town, steps from Lyab-i Hauz. Painted ceilings, a quiet courtyard and breakfast served under the vines.' },
    { id: 'acc-5', name: 'Orient Star Khiva', location: 'Khiva', address: 'Itchan Kala, Muhammad Amin Khan madrasa', lat: 41.3789, lng: 60.3593, photo: 'Itchan_Kala', stars: 3, price: 55, unit: 'night', rating: 4.6, reviews: 418, checkIn: '14:00', amenities: ['breakfast', 'wifi', 'restaurant'], tags: ['Inside Itchan Kala', 'Historic madrasa'], checkOut: '12:00', gallery: ['Itchan_Kala', 'Kalta_Minor'], description: 'Sleep inside a 19th-century madrasa within the walls of Itchan Kala. Rooms are former student cells, simply furnished; at night the old town is almost yours alone.' },
    { id: 'acc-6', name: 'Charvak Lake Resort', location: 'Tashkent region', address: 'Charvak reservoir, Bostanliq district', lat: 41.6195, lng: 70.0352, photo: 'Charvak_Reservoir', stars: 4, price: 110, unit: 'night', rating: 4.8, reviews: 920, checkIn: '15:00', amenities: ['pool', 'spa', 'breakfast', 'wifi', 'parking'], tags: ['Lake view', 'Mountains'], checkOut: '12:00', gallery: ['Charvak_Reservoir', 'Chimgan'], description: 'Resort on the shore of Lake Charvak, 80 km from Tashkent, with mountain views, an outdoor pool and spa. A good base for hiking in Chimgan or a quiet weekend away from the city.' },
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
    { id: 'fd-1', name: 'Central Asian Plov Centre (Besh Qozon)', location: 'Tashkent', address: 'Iftixor street 1, near the TV tower', lat: 41.3412, lng: 69.2868, photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Central_Asian_Plov_Centre_in_Tashkent.jpg/960px-Central_Asian_Plov_Centre_in_Tashkent.jpg', cuisine: 'Uzbek · Plov', hours: '07:00–15:00', price: 6, unit: 'meal', rating: 4.8, reviews: 9800, tags: ['Iconic', 'Lunch'] },
    { id: 'fd-2', name: 'Platan', location: 'Samarkand', address: 'Pushkin street 5', lat: 39.6588, lng: 66.9610, photo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/One_of_the_best_SHASHLIK_restaurant_in_Samarkand..jpg', cuisine: 'Uzbek & European', hours: '11:00–23:00', price: 15, unit: 'meal', rating: 4.7, reviews: 2300, tags: ['Terrace', 'Shashlik'] },
    { id: 'fd-3', name: 'Old Bukhara', location: 'Bukhara', address: 'Samarkand street, old town', lat: 39.7739, lng: 64.4166, photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Uzbek_lagman.jpg/960px-Uzbek_lagman.jpg', cuisine: 'Uzbek · Bukhara', hours: '10:00–23:00', price: 12, unit: 'meal', rating: 4.7, reviews: 1850, tags: ['Rooftop', 'Live music'] },
    { id: 'fd-4', name: 'Caravan', location: 'Tashkent', address: 'Abdulla Qahhor street 22', lat: 41.2934, lng: 69.2608, photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Samarkand_Zigir-pilaf.jpg/960px-Samarkand_Zigir-pilaf.jpg', cuisine: 'Uzbek fusion', hours: '11:00–00:00', price: 18, unit: 'meal', rating: 4.8, reviews: 3100, tags: ['Craft shop', 'Garden'] },
    { id: 'fd-5', name: 'Siyob bazaar samsa tour', location: 'Samarkand', address: 'Siyob bazaar, Shahi Zinda street', lat: 39.6618, lng: 66.9808, photo: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/%27Parmuda%27-uzbek_samsa-02.jpg/960px-%27Parmuda%27-uzbek_samsa-02.jpg", cuisine: 'Street food', hours: '08:00–18:00', price: 9, unit: 'meal', rating: 4.9, reviews: 610, tags: ['Tandoor samsa'] },
    { id: 'fd-6', name: 'Terrassa Khiva', location: 'Khiva', address: 'Itchan Kala, west gate', lat: 41.3786, lng: 60.3612, photo: 'Itchan_Kala', cuisine: 'Khorezm cuisine', hours: '10:00–22:00', price: 11, unit: 'meal', rating: 4.6, reviews: 720, tags: ['City wall view'] },
  ],
  exchange: [
    { id: 'ex-1', name: 'Kapitalbank exchange desk', location: 'Tashkent, Amir Temur sq.', price: 0, unit: 'rate', rating: 4.7, reviews: 1210, tags: ['0% commission', '24/7'] },
    { id: 'ex-2', name: 'Hamkorbank', location: 'Samarkand, Registan st.', price: 0, unit: 'rate', rating: 4.6, reviews: 640, tags: ['0% commission'] },
    { id: 'ex-3', name: 'Airport exchange TAS', location: 'Tashkent Airport', price: 0, unit: 'rate', rating: 4.3, reviews: 2980, tags: ['Arrivals hall'] },
    { id: 'ex-4', name: 'Asakabank', location: 'Bukhara, Lyabi-Hauz', price: 0, unit: 'rate', rating: 4.5, reviews: 380, tags: ['Card cash-out'] },
  ],
  rentcar: [
    { id: 'rc-1', name: 'Chevrolet Onix', company: 'car24', location: 'Tashkent', photo: 'Chevrolet_Onix', seats: 5, transmission: 'auto', fuel: 'petrol', price: 18, unit: 'day', tags: ['Economy', 'Unlimited km'] },
    { id: 'rc-2', name: 'Chevrolet Cobalt', company: 'my-rent', location: 'Tashkent', photo: 'Chevrolet_Cobalt', seats: 5, transmission: 'auto', fuel: 'petrol', price: 25, unit: 'day', tags: ['No deposit'] },
    { id: 'rc-3', name: 'Chevrolet Tracker', company: 'inrent', location: 'Tashkent', photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/2023_Chevrolet_Tracker_1.2_Turbo_Premier.jpg/960px-2023_Chevrolet_Tracker_1.2_Turbo_Premier.jpg', seats: 5, transmission: 'auto', fuel: 'petrol', price: 40, unit: 'day', tags: ['SUV'] },
    { id: 'rc-4', name: 'Chevrolet Malibu', company: 'orient', location: 'Tashkent', photo: 'Chevrolet_Malibu', seats: 5, transmission: 'auto', fuel: 'petrol', price: 55, unit: 'day', tags: ['Comfort', 'Airport delivery'] },
    { id: 'rc-5', name: 'Kia K5', company: 'inrent', location: 'Tashkent', photo: 'Kia_K5', seats: 5, transmission: 'auto', fuel: 'petrol', price: 60, unit: 'day', tags: ['Business'] },
    { id: 'rc-6', name: 'Hyundai Sonata', company: 'hertz', location: 'Tashkent', photo: 'Hyundai_Sonata', seats: 5, transmission: 'auto', fuel: 'petrol', price: 65, unit: 'day', tags: ['Business'] },
    { id: 'rc-7', name: 'BYD Song Plus', company: 'orient', location: 'Tashkent', photo: 'BYD_Song', seats: 5, transmission: 'auto', fuel: 'electric', price: 70, unit: 'day', tags: ['Electric'] },
    { id: 'rc-8', name: 'Mercedes-Benz E-Class', company: 'sixt', location: 'Tashkent Airport', photo: 'Mercedes-Benz_E-Class', seats: 5, transmission: 'auto', fuel: 'petrol', price: 120, unit: 'day', tags: ['Premium', 'Airport'] },
    { id: 'rc-9', name: 'Toyota Land Cruiser', company: 'rentcar-uz', location: 'Tashkent', photo: 'Toyota_Land_Cruiser', seats: 7, transmission: 'auto', fuel: 'diesel', price: 150, unit: 'day', tags: ['4x4', 'Driver available'] },
  ],
}

// Car rental companies in Uzbekistan shown on the rent-a-car page. Public facts only; link to their sites.
const defaultCompanies = [
  { id: 'sixt', name: 'Sixt', website: 'https://www.sixt.com/car-rental/uzbekistan/', info: { en: 'International brand with several branches in Tashkent, including the airport. Drivers 25+.', uz: "Toshkentda, jumladan aeroportda bir nechta filiali bor xalqaro brend. Haydovchi 25 yoshdan katta bo'lishi kerak.", ru: 'Международный бренд, несколько офисов в Ташкенте, включая аэропорт. Водители от 25 лет.' } },
  { id: 'hertz', name: 'Hertz Uzbekistan', website: 'https://hertz.com.uz/', info: { en: 'Car rental and car sharing in Tashkent.', uz: 'Toshkentda avtomobil ijarasi va karshering.', ru: 'Прокат и каршеринг в Ташкенте.' } },
  { id: 'inrent', name: 'InRent', website: 'https://inrent.uz/en/', info: { en: 'Local company since 2019 with 30+ models from economy to premium.', uz: "2019-yildan beri ishlaydi, ekonomdan premiumgacha 30 dan ortiq model.", ru: 'Работает с 2019 года, более 30 моделей от эконом до премиум.' } },
  { id: 'orient', name: 'Orient Rent Car', website: 'https://orientrentcar.uz/en/', info: { en: 'Premium, comfort and standard cars, minivans and EVs across Uzbekistan; airport delivery and 24/7 support.', uz: "Butun O'zbekiston bo'ylab premium, komfort, standart, miniven va elektromobillar; aeroportga yetkazish va 24/7 yordam.", ru: 'Премиум, комфорт, стандарт, минивэны и электромобили по всему Узбекистану; доставка в аэропорт, поддержка 24/7.' } },
  { id: 'car24', name: 'Car24', website: 'https://car24.uz/', info: { en: 'Daily rentals in Tashkent from about 225,000 so\'m a day.', uz: "Toshkentda kunlik ijara, taxminan 225 000 so'mdan.", ru: 'Посуточная аренда в Ташкенте примерно от 225 000 сум.' } },
  { id: 'my-rent', name: 'My-Rent', website: 'https://my-rent.uz/', info: { en: 'Fast rental in about 10 minutes, including no-deposit options.', uz: "Taxminan 10 daqiqada ijara, depozitsiz variantlar ham bor.", ru: 'Аренда примерно за 10 минут, есть варианты без залога.' } },
  { id: 'rentcar-uz', name: 'Rentcar.uz', website: 'https://rentcar.uz/ru', info: { en: 'Standard and economy cars, also with a driver.', uz: 'Standart va ekonom avtomobillar, haydovchi bilan ham.', ru: 'Стандарт и эконом, также с водителем.' } },
]

export let rentalCompanies = defaultCompanies
export const companyById = (id) => rentalCompanies.find((c) => c.id === id)
export function setRentalCompanies(list) {
  if (Array.isArray(list)) rentalCompanies = list
}
export { defaultCompanies }

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
