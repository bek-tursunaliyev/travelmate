// Local guides listed on /guides. Prices are per hour in USD (private tour, whole group).
// `tours` link to offers.guide ids in services.js.

export const guideCities = ['tashkent', 'samarkand', 'bukhara', 'khiva']

export const guideLanguages = ['en', 'ru', 'uz', 'de', 'fr', 'ja', 'tr', 'es']

const defaultGuides = [
  {
    id: 'dilnoza-karimova', name: 'Dilnoza Karimova', city: 'samarkand', languages: ['en', 'ru', 'uz'],
    rating: 4.9, reviews: 412, price: 18, years: 9, verified: true, responds: 1,
    topics: ['history', 'architecture'], tours: ['gd-1'],
    bio: 'Art historian born in Samarkand. I show the Registan, Shah-i-Zinda and Bibi-Khanym through the stories of the craftsmen who built them.',
  },
  {
    id: 'timur-rakhimov', name: 'Timur Rakhimov', city: 'samarkand', languages: ['en', 'de', 'uz'],
    rating: 4.8, reviews: 268, price: 15, years: 6, verified: true, responds: 2,
    topics: ['history', 'photography'], tours: ['gd-1'],
    bio: 'Licensed guide and amateur photographer. I time every stop for the best light and the fewest crowds.',
  },
  {
    id: 'aziz-nurmatov', name: 'Aziz Nurmatov', city: 'bukhara', languages: ['en', 'fr', 'ru'],
    rating: 4.9, reviews: 355, price: 16, years: 11, verified: true, responds: 1,
    topics: ['history', 'crafts'], tours: ['gd-2'],
    bio: 'Third-generation Bukharan. Expect the old trading domes, master artisans at work and the best tea houses around Lyabi-Hauz.',
  },
  {
    id: 'malika-yusupova', name: 'Malika Yusupova', city: 'bukhara', languages: ['en', 'ja', 'uz'],
    rating: 4.7, reviews: 143, price: 14, years: 4, verified: true, responds: 3,
    topics: ['crafts', 'food'], tours: ['gd-2'],
    bio: 'Former suzani embroiderer turned guide. Small groups, slow pace and plenty of time with local families.',
  },
  {
    id: 'jasur-abdullaev', name: 'Jasur Abdullaev', city: 'tashkent', languages: ['en', 'ru', 'tr'],
    rating: 4.8, reviews: 301, price: 12, years: 7, verified: true, responds: 1,
    topics: ['food', 'city'], tours: ['gd-3', 'gd-6'],
    bio: 'Food lover and Tashkent local. Metro stations, Chorsu bazaar and the plov spots taxi drivers eat at.',
  },
  {
    id: 'kamola-saidova', name: 'Kamola Saidova', city: 'tashkent', languages: ['en', 'es', 'ru'],
    rating: 4.9, reviews: 188, price: 20, years: 8, verified: true, responds: 2,
    topics: ['nature', 'city'], tours: ['gd-5', 'gd-3'],
    bio: 'Mountain guide and city walker. I run day trips to Chimgan and Charvak and relaxed walks through modern Tashkent.',
  },
  {
    id: 'bekzod-ollaberganov', name: 'Bekzod Ollaberganov', city: 'khiva', languages: ['en', 'ru', 'uz'],
    rating: 4.8, reviews: 176, price: 13, years: 10, verified: true, responds: 2,
    topics: ['history', 'architecture'], tours: ['gd-4'],
    bio: 'Grew up inside Itchan Kala. Sunset from the city walls and the minarets most visitors never climb.',
  },
  {
    id: 'shahnoza-ergasheva', name: 'Shahnoza Ergasheva', city: 'khiva', languages: ['en', 'de'],
    rating: 4.6, reviews: 74, price: 11, years: 3, verified: false, responds: 4,
    topics: ['crafts', 'photography'], tours: ['gd-4'],
    bio: 'Woodcarving workshops and photo walks through the lanes of old Khiva.',
  },
]

export let guides = defaultGuides
export let guideById = Object.fromEntries(guides.map((g) => [g.id, g]))

export function setGuides(next = {}) {
  if (!Array.isArray(next.guides)) return
  guides = next.guides
  guideById = Object.fromEntries(guides.map((g) => [g.id, g]))
}

export const defaultGuideData = { guides: defaultGuides }

// Booking lengths offered on the profile page (hours).
export const guideDurations = [2, 4, 8]

// Largest group one guide takes on a private tour.
export const MAX_GROUP = 10
