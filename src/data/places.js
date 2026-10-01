// Uzbekistan places: regions (sub-navbar), cities and landmarks.
// `wiki` is the English Wikipedia title used for the description; `photo` (a Wikipedia title or an
// image URL) overrides the picture when the article's own image is a map.
// These are defaults — the admin panel can replace every list (see setPlaces).
import { translatePlaceText } from './placeNames'

const defaultRegions = [
  { slug: 'tashkent-city', name: 'Tashkent', country: 'Capital city', wiki: 'Tashkent', photo: 'Amir_Timur_Square', tags: ['capital', 'metro', 'bazaar'] },
  { slug: 'samarkand-region', name: 'Samarkand Region', country: 'Centre: Samarkand', wiki: 'Samarqand_Region', photo: 'Registan', tags: ['samarkand', 'silk road'] },
  { slug: 'bukhara-region', name: 'Bukhara Region', country: 'Centre: Bukhara', wiki: 'Bukhara_Region', photo: 'Po-i-Kalyan', tags: ['bukhara', 'old town'] },
  { slug: 'khorezm-region', name: 'Khorezm Region', country: 'Centre: Urgench', wiki: 'Xorazm_Region', photo: 'Itchan_Kala', tags: ['khiva', 'urgench'] },
  { slug: 'karakalpakstan', name: 'Karakalpakstan', country: 'Centre: Nukus', wiki: 'Karakalpakstan', photo: 'Moynaq', tags: ['nukus', 'aral sea', 'savitsky'] },
  { slug: 'fergana-region', name: 'Fergana Region', country: 'Centre: Fergana', wiki: 'Fergana_Region', photo: 'Margilan', tags: ['fergana', 'silk', 'ceramics'] },
  { slug: 'andijan-region', name: 'Andijan Region', country: 'Centre: Andijan', wiki: 'Andijan_Region', photo: 'Andijan', tags: ['andijan', 'fergana valley'] },
  { slug: 'namangan-region', name: 'Namangan Region', country: 'Centre: Namangan', wiki: 'Namangan_Region', photo: 'Namangan', tags: ['namangan', 'fergana valley'] },
  { slug: 'kashkadarya-region', name: 'Kashkadarya Region', country: 'Centre: Karshi', wiki: 'Qashqadaryo_Region', photo: 'Ak-Saray_Palace', tags: ['shahrisabz', 'karshi'] },
  { slug: 'surkhandarya-region', name: 'Surkhandarya Region', country: 'Centre: Termez', wiki: 'Surxondaryo_Region', photo: 'Fayaz_Tepe', tags: ['termez', 'buddhist'] },
  { slug: 'navoiy-region', name: 'Navoiy Region', country: 'Centre: Navoiy', wiki: 'Navoiy_Region', photo: 'Sarmishsay', tags: ['nurata', 'petroglyphs'] },
  { slug: 'jizzakh-region', name: 'Jizzakh Region', country: 'Centre: Jizzakh', wiki: 'Jizzakh_Region', photo: 'Aydar_Lake', tags: ['aydar lake', 'zaamin'] },
  { slug: 'tashkent-region', name: 'Tashkent Region', country: 'Mountains & lakes', wiki: 'Tashkent_Region', photo: 'Charvak_Reservoir', tags: ['chimgan', 'charvak'] },
  { slug: 'sirdaryo-region', name: 'Sirdaryo Region', country: 'Centre: Gulistan', wiki: 'Sirdaryo_Region', tags: ['gulistan'] },
]

const defaultDestinations = [
  { slug: 'tashkent', name: 'Tashkent', country: 'Capital city', wiki: 'Tashkent', tags: ['capital', 'metro', 'tashkent'] },
  { slug: 'samarkand', name: 'Samarkand', country: 'Samarkand Region', wiki: 'Samarkand', tags: ['silk road', 'registan'] },
  { slug: 'bukhara', name: 'Bukhara', country: 'Bukhara Region', wiki: 'Bukhara', tags: ['silk road', 'old town'] },
  { slug: 'khiva', name: 'Khiva', country: 'Khorezm Region', wiki: 'Khiva', tags: ['itchan kala', 'khorezm'] },
  { slug: 'shahrisabz', name: 'Shahrisabz', country: 'Kashkadarya Region', wiki: 'Shahrisabz', tags: ['amir temur', 'ak-saray'] },
  { slug: 'nukus', name: 'Nukus', country: 'Karakalpakstan', wiki: 'Nukus', tags: ['savitsky', 'aral sea'] },
  { slug: 'termez', name: 'Termez', country: 'Surkhandarya Region', wiki: 'Termez', tags: ['buddhist', 'ancient'] },
  { slug: 'fergana', name: 'Fergana', country: 'Fergana Region', wiki: 'Fergana', tags: ['fergana valley'] },
  { slug: 'kokand', name: 'Kokand', country: 'Fergana Region', wiki: 'Kokand', tags: ['khudayar khan', 'fergana valley'] },
  { slug: 'margilan', name: 'Margilan', country: 'Fergana Region', wiki: 'Margilan', tags: ['silk', 'ikat'] },
  { slug: 'namangan', name: 'Namangan', country: 'Namangan Region', wiki: 'Namangan', tags: ['fergana valley', 'gardens'] },
  { slug: 'andijan', name: 'Andijan', country: 'Andijan Region', wiki: 'Andijan', tags: ['babur', 'fergana valley'] },
]

const defaultLandmarks = [
  { slug: 'registan', name: 'Registan', country: 'Samarkand', wiki: 'Registan', tags: ['samarkand', 'madrasa'] },
  { slug: 'shah-i-zinda', name: 'Shah-i-Zinda', country: 'Samarkand', wiki: 'Shah-i-Zinda', tags: ['samarkand', 'necropolis'] },
  { slug: 'itchan-kala', name: 'Itchan Kala', country: 'Khiva', wiki: 'Itchan_Kala', tags: ['khiva', 'old town'] },
  { slug: 'po-i-kalyan', name: 'Po-i-Kalyan', country: 'Bukhara', wiki: 'Po-i-Kalyan', tags: ['bukhara', 'minaret'] },
  { slug: 'gur-e-amir', name: 'Gur-e-Amir', country: 'Samarkand', wiki: 'Gur-e-Amir', tags: ['samarkand', 'mausoleum'] },
  { slug: 'ark-of-bukhara', name: 'Ark of Bukhara', country: 'Bukhara', wiki: 'Ark_of_Bukhara', tags: ['bukhara', 'fortress'] },
  { slug: 'bibi-khanym', name: 'Bibi-Khanym Mosque', country: 'Samarkand', wiki: 'Bibi-Khanym_Mosque', tags: ['samarkand', 'mosque'] },
  { slug: 'chor-minor', name: 'Chor Minor', country: 'Bukhara', wiki: 'Chor_Minor', tags: ['bukhara'] },
  { slug: 'lyab-i-hauz', name: 'Lyab-i Hauz', country: 'Bukhara', wiki: 'Lyab-i_Hauz', tags: ['bukhara', 'old town'] },
  { slug: 'samanid-mausoleum', name: 'Samanid Mausoleum', country: 'Bukhara', wiki: 'Samanid_Mausoleum', tags: ['bukhara', 'mausoleum'] },
  { slug: 'ulugh-beg-observatory', name: 'Ulugh Beg Observatory', country: 'Samarkand', wiki: 'Ulugh_Beg_Observatory', tags: ['samarkand', 'science'] },
  { slug: 'ak-saray', name: 'Ak-Saray Palace', country: 'Shahrisabz', wiki: 'Ak-Saray_Palace', tags: ['amir temur', 'shahrisabz'] },
  { slug: 'chorsu-bazaar', name: 'Chorsu Bazaar', country: 'Tashkent', wiki: 'Chorsu_Bazaar', tags: ['tashkent', 'market'] },
  { slug: 'savitsky-museum', name: 'Savitsky Museum', country: 'Nukus', wiki: 'Savitsky_Museum', tags: ['nukus', 'art'] },
]

export const typeOfList = { regions: 'region', destinations: 'destination', landmarks: 'landmark' }

// Menus shown in the sub-navbar and the mobile drawer.
export const menuLists = ['regions', 'destinations']

// Live bindings: setPlaces() reassigns these and every importer sees the new values.
export let regions = defaultRegions
export let destinations = defaultDestinations
export let landmarks = defaultLandmarks
export let placeLists = {}
export let allPlaces = []
// Famous places carousel on the home page.
export let famousPlaces = []

// Names and subtitles follow the site language (uz / ru); the English originals stay on
// nameEn / countryEn for search.
let lang = 'en'
const localize = (p) => ({
  ...p,
  nameEn: p.nameEn || p.name,
  countryEn: p.countryEn || p.country,
  name: translatePlaceText(p.nameEn || p.name, lang),
  country: translatePlaceText(p.countryEn || p.country, lang),
})

function rebuild() {
  placeLists = { regions: regions.map(localize), destinations: destinations.map(localize), landmarks: landmarks.map(localize) }
  allPlaces = Object.entries(placeLists).flatMap(([list, items]) =>
    items.map((p, i) => ({ ...p, list, type: typeOfList[list], rank: i + 1 })),
  )
  famousPlaces = allPlaces.filter((p) => p.list === 'landmarks')
}
rebuild()

export function setPlaces(next = {}) {
  if (Array.isArray(next.regions)) regions = next.regions
  if (Array.isArray(next.destinations)) destinations = next.destinations
  if (Array.isArray(next.landmarks)) landmarks = next.landmarks
  rebuild()
}

export function setPlaceLanguage(lng) {
  if (lng === lang) return
  lang = lng
  rebuild()
}

export const defaultPlaces = { regions: defaultRegions, destinations: defaultDestinations, landmarks: defaultLandmarks }

export function findPlace(list, slug) {
  return allPlaces.find((p) => p.list === list && p.slug === slug)
}

// Picture source for a place: an explicit photo wins over the article's own image.
export const placePhoto = (p) => p.photo || p.wiki

export const topSearches = ['Samarkand', 'eSIM', 'Airport taxi', 'Tashkent → Samarkand', 'Khiva', 'Rent a car']

export const trending = [
  { list: 'destinations', slug: 'samarkand', growth: 48 },
  { list: 'destinations', slug: 'bukhara', growth: 36 },
  { list: 'destinations', slug: 'khiva', growth: 31 },
  { list: 'destinations', slug: 'tashkent', growth: 24 },
  { list: 'destinations', slug: 'shahrisabz', growth: 19 },
]
