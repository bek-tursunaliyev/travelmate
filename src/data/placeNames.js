// Uzbek and Russian names for places and their subtitles. Keys are the English texts used in
// places.js; anything missing (or added later in the admin panel) stays as typed.

const N = {
  // Cities and capitals
  Tashkent: ['Toshkent', 'Ташкент'],
  Samarkand: ['Samarqand', 'Самарканд'],
  Bukhara: ['Buxoro', 'Бухара'],
  Khiva: ['Xiva', 'Хива'],
  Urgench: ['Urganch', 'Ургенч'],
  Shahrisabz: ['Shahrisabz', 'Шахрисабз'],
  Nukus: ['Nukus', 'Нукус'],
  Termez: ['Termiz', 'Термез'],
  Fergana: ['Farg‘ona', 'Фергана'],
  Kokand: ['Qo‘qon', 'Коканд'],
  Margilan: ['Marg‘ilon', 'Маргилан'],
  Namangan: ['Namangan', 'Наманган'],
  Andijan: ['Andijon', 'Андижан'],
  Karshi: ['Qarshi', 'Карши'],
  Navoiy: ['Navoiy', 'Навои'],
  Jizzakh: ['Jizzax', 'Джизак'],
  Gulistan: ['Guliston', 'Гулистан'],
  Karakalpakstan: ['Qoraqalpog‘iston', 'Каракалпакстан'],
  // Regions
  'Samarkand Region': ['Samarqand viloyati', 'Самаркандская область'],
  'Bukhara Region': ['Buxoro viloyati', 'Бухарская область'],
  'Khorezm Region': ['Xorazm viloyati', 'Хорезмская область'],
  'Fergana Region': ['Farg‘ona viloyati', 'Ферганская область'],
  'Andijan Region': ['Andijon viloyati', 'Андижанская область'],
  'Namangan Region': ['Namangan viloyati', 'Наманганская область'],
  'Kashkadarya Region': ['Qashqadaryo viloyati', 'Кашкадарьинская область'],
  'Surkhandarya Region': ['Surxondaryo viloyati', 'Сурхандарьинская область'],
  'Navoiy Region': ['Navoiy viloyati', 'Навоийская область'],
  'Jizzakh Region': ['Jizzax viloyati', 'Джизакская область'],
  'Tashkent Region': ['Toshkent viloyati', 'Ташкентская область'],
  'Sirdaryo Region': ['Sirdaryo viloyati', 'Сырдарьинская область'],
  'Tashkent Airport (TAS)': ['Toshkent aeroporti (TAS)', 'Аэропорт Ташкента (TAS)'],
  Chimgan: ['Chimyon', 'Чимган'],
  'Charvak Lake': ['Chorvoq ko‘li', 'Чарвакское водохранилище'],
  // Subtitles
  'Capital city': ['Poytaxt', 'Столица'],
  'Mountains & lakes': ['Tog‘lar va ko‘llar', 'Горы и озёра'],
  // Landmarks
  Registan: ['Registon', 'Регистан'],
  'Shah-i-Zinda': ['Shohi Zinda', 'Шахи-Зинда'],
  'Itchan Kala': ['Ichan qal’a', 'Ичан-Кала'],
  'Po-i-Kalyan': ['Poyi Kalon', 'Пои-Калян'],
  'Gur-e-Amir': ['Go‘ri Amir', 'Гур-Эмир'],
  'Ark of Bukhara': ['Buxoro Arki', 'Бухарский Арк'],
  'Bibi-Khanym Mosque': ['Bibixonim masjidi', 'Мечеть Биби-Ханым'],
  'Chor Minor': ['Chor Minor', 'Чор-Минор'],
  'Lyab-i Hauz': ['Labi hovuz', 'Ляби-Хауз'],
  'Samanid Mausoleum': ['Somoniylar maqbarasi', 'Мавзолей Саманидов'],
  'Ulugh Beg Observatory': ['Ulug‘bek rasadxonasi', 'Обсерватория Улугбека'],
  'Ak-Saray Palace': ['Oqsaroy', 'Дворец Ак-Сарай'],
  'Chorsu Bazaar': ['Chorsu bozori', 'Базар Чорсу'],
  'Savitsky Museum': ['Savitskiy muzeyi', 'Музей Савицкого'],
}

const COL = { uz: 0, ru: 1 }

// "Centre: Samarkand" style subtitles.
function centre(text, lng) {
  const m = /^Centre: (.+)$/.exec(text)
  if (!m) return null
  const city = translatePlaceText(m[1], lng)
  return lng === 'uz' ? `Markazi: ${city}` : `Центр: ${city}`
}

export function translatePlaceText(text, lng) {
  if (!text || !(lng in COL)) return text
  return N[text]?.[COL[lng]] || centre(text, lng) || text
}
