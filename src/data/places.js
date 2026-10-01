// Top-10 lists shown in the sub-navbar dropdowns and on /popular/:type pages.
// `wiki` is the English Wikipedia title used to load a real photo + description.

export const regions = [
  { slug: 'central-asia', name: 'Central Asia', country: 'Uzbekistan · Kazakhstan · Kyrgyzstan', wiki: 'Central_Asia', tags: ['silk road', 'uzbekistan', 'mountains'] },
  { slug: 'southeast-asia', name: 'Southeast Asia', country: 'Thailand · Vietnam · Indonesia', wiki: 'Southeast_Asia', tags: ['beach', 'islands', 'food'] },
  { slug: 'western-europe', name: 'Western Europe', country: 'France · Italy · Spain', wiki: 'Western_Europe', tags: ['museums', 'history', 'cities'] },
  { slug: 'middle-east', name: 'Middle East', country: 'UAE · Jordan · Oman', wiki: 'Middle_East', tags: ['desert', 'luxury'] },
  { slug: 'mediterranean', name: 'Mediterranean', country: 'Greece · Croatia · Turkey', wiki: 'Mediterranean_Basin', tags: ['sea', 'islands', 'beach'] },
  { slug: 'caribbean', name: 'Caribbean', country: 'Cuba · Jamaica · Bahamas', wiki: 'Caribbean', tags: ['beach', 'islands'] },
  { slug: 'scandinavia', name: 'Scandinavia', country: 'Norway · Sweden · Denmark', wiki: 'Scandinavia', tags: ['fjords', 'northern lights'] },
  { slug: 'east-asia', name: 'East Asia', country: 'Japan · South Korea · China', wiki: 'East_Asia', tags: ['culture', 'cities', 'food'] },
  { slug: 'south-america', name: 'South America', country: 'Peru · Brazil · Argentina', wiki: 'South_America', tags: ['andes', 'amazon'] },
  { slug: 'north-africa', name: 'North Africa', country: 'Morocco · Egypt · Tunisia', wiki: 'North_Africa', tags: ['desert', 'pyramids', 'medina'] },
]

export const destinations = [
  { slug: 'samarkand', name: 'Samarkand', country: 'Uzbekistan', wiki: 'Samarkand', tags: ['silk road', 'registan', 'uzbekistan'] },
  { slug: 'istanbul', name: 'Istanbul', country: 'Türkiye', wiki: 'Istanbul', tags: ['bosphorus', 'turkey'] },
  { slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', wiki: 'Dubai', tags: ['uae', 'shopping', 'desert'] },
  { slug: 'paris', name: 'Paris', country: 'France', wiki: 'Paris', tags: ['eiffel', 'romance', 'museums'] },
  { slug: 'tokyo', name: 'Tokyo', country: 'Japan', wiki: 'Tokyo', tags: ['anime', 'sushi', 'japan'] },
  { slug: 'bali', name: 'Bali', country: 'Indonesia', wiki: 'Bali', tags: ['beach', 'temples', 'surf'] },
  { slug: 'rome', name: 'Rome', country: 'Italy', wiki: 'Rome', tags: ['colosseum', 'history', 'italy'] },
  { slug: 'bukhara', name: 'Bukhara', country: 'Uzbekistan', wiki: 'Bukhara', tags: ['silk road', 'uzbekistan', 'old town'] },
  { slug: 'barcelona', name: 'Barcelona', country: 'Spain', wiki: 'Barcelona', tags: ['gaudi', 'beach', 'spain'] },
  { slug: 'new-york', name: 'New York City', country: 'United States', wiki: 'New_York_City', tags: ['usa', 'manhattan', 'nyc'] },
]

export const landmarks = [
  { slug: 'registan', name: 'Registan', country: 'Samarkand, Uzbekistan', wiki: 'Registan', tags: ['madrasa', 'samarkand'] },
  { slug: 'eiffel-tower', name: 'Eiffel Tower', country: 'Paris, France', wiki: 'Eiffel_Tower', tags: ['paris'] },
  { slug: 'colosseum', name: 'Colosseum', country: 'Rome, Italy', wiki: 'Colosseum', tags: ['rome', 'ancient'] },
  { slug: 'great-wall', name: 'Great Wall of China', country: 'China', wiki: 'Great_Wall_of_China', tags: ['china', 'beijing'] },
  { slug: 'taj-mahal', name: 'Taj Mahal', country: 'Agra, India', wiki: 'Taj_Mahal', tags: ['india', 'agra'] },
  { slug: 'machu-picchu', name: 'Machu Picchu', country: 'Cusco, Peru', wiki: 'Machu_Picchu', tags: ['peru', 'inca', 'andes'] },
  { slug: 'burj-khalifa', name: 'Burj Khalifa', country: 'Dubai, UAE', wiki: 'Burj_Khalifa', tags: ['dubai', 'skyscraper'] },
  { slug: 'hagia-sophia', name: 'Hagia Sophia', country: 'Istanbul, Türkiye', wiki: 'Hagia_Sophia', tags: ['istanbul', 'mosque'] },
  { slug: 'statue-of-liberty', name: 'Statue of Liberty', country: 'New York, USA', wiki: 'Statue_of_Liberty', tags: ['new york', 'usa'] },
  { slug: 'petra', name: 'Petra', country: 'Jordan', wiki: 'Petra', tags: ['jordan', 'ancient'] },
]

// Attractions in Uzbekistan — the home page "Famous places" carousel and the /places default tab.
export const uzbekistan = [
  { slug: 'registan', name: 'Registan', country: 'Samarkand', wiki: 'Registan', tags: ['samarkand', 'madrasa', 'uzbekistan'] },
  { slug: 'shah-i-zinda', name: 'Shah-i-Zinda', country: 'Samarkand', wiki: 'Shah-i-Zinda', tags: ['samarkand', 'necropolis', 'uzbekistan'] },
  { slug: 'itchan-kala', name: 'Itchan Kala', country: 'Khiva', wiki: 'Itchan_Kala', tags: ['khiva', 'old town', 'uzbekistan'] },
  { slug: 'po-i-kalyan', name: 'Po-i-Kalyan', country: 'Bukhara', wiki: 'Po-i-Kalyan', tags: ['bukhara', 'minaret', 'uzbekistan'] },
  { slug: 'gur-e-amir', name: 'Gur-e-Amir', country: 'Samarkand', wiki: 'Gur-e-Amir', tags: ['samarkand', 'mausoleum', 'uzbekistan'] },
  { slug: 'ark-of-bukhara', name: 'Ark of Bukhara', country: 'Bukhara', wiki: 'Ark_of_Bukhara', tags: ['bukhara', 'fortress', 'uzbekistan'] },
  { slug: 'bibi-khanym', name: 'Bibi-Khanym Mosque', country: 'Samarkand', wiki: 'Bibi-Khanym_Mosque', tags: ['samarkand', 'mosque', 'uzbekistan'] },
  { slug: 'chor-minor', name: 'Chor Minor', country: 'Bukhara', wiki: 'Chor_Minor', tags: ['bukhara', 'uzbekistan'] },
  { slug: 'lyab-i-hauz', name: 'Lyab-i Hauz', country: 'Bukhara', wiki: 'Lyab-i_Hauz', tags: ['bukhara', 'old town', 'uzbekistan'] },
  { slug: 'samanid-mausoleum', name: 'Samanid Mausoleum', country: 'Bukhara', wiki: 'Samanid_Mausoleum', tags: ['bukhara', 'mausoleum', 'uzbekistan'] },
  { slug: 'ulugh-beg-observatory', name: 'Ulugh Beg Observatory', country: 'Samarkand', wiki: 'Ulugh_Beg_Observatory', tags: ['samarkand', 'science', 'uzbekistan'] },
  { slug: 'shahrisabz', name: 'Shahrisabz', country: 'Kashkadarya', wiki: 'Shahrisabz', tags: ['amir temur', 'ak-saray', 'uzbekistan'] },
]

export const placeLists = { regions, destinations, landmarks, uzbekistan }

// Menus shown in the sub-navbar and the mobile drawer.
export const menuLists = ['regions', 'destinations']

export const typeOfList = { regions: 'region', destinations: 'destination', landmarks: 'landmark', uzbekistan: 'landmark' }

export const allPlaces = Object.entries(placeLists).flatMap(([list, items]) =>
  items.map((p, i) => ({ ...p, list, type: typeOfList[list], rank: i + 1 })),
)

export function findPlace(list, slug) {
  return allPlaces.find((p) => p.list === list && p.slug === slug)
}

// Famous places carousel on the home page: Uzbekistan only.
export const famousPlaces = allPlaces.filter((p) => p.list === 'uzbekistan')

export const heroSlides = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/RegistanSquare_Samarkand.jpg/1280px-RegistanSquare_Samarkand.jpg',
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1800&q=75&auto=format&fit=crop',
]

export const topSearches = ['Samarkand', 'eSIM', 'Airport taxi', 'Tashkent → Samarkand', 'Dubai', 'Rent a car']

export const trending = [
  { list: 'destinations', slug: 'samarkand', growth: 48 },
  { list: 'destinations', slug: 'istanbul', growth: 36 },
  { list: 'destinations', slug: 'bukhara', growth: 31 },
  { list: 'destinations', slug: 'dubai', growth: 24 },
  { list: 'destinations', slug: 'tokyo', growth: 19 },
]
