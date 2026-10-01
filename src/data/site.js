// Home-page content the admin panel edits: the hero carousel.
// Slide text is per language ({ en, uz, ru }); other languages fall back to the
// translation files for the default slides (`i18n` index), then to English.

const defaultHeroSlides = [
  {
    id: 'slide-registan', i18n: 0,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/RegistanSquare_Samarkand.jpg/1280px-RegistanSquare_Samarkand.jpg',
    title: { en: 'Discover the Silk Road like a local', uz: "Buyuk Ipak yo'lini mahalliy aholidek kashf eting", ru: 'Откройте Шёлковый путь как местный' },
    text: {
      en: 'From the blue domes of Samarkand to the ancient walls of Khiva — plan, book and explore every step with one app.',
      uz: "Samarqandning moviy gumbazlaridan Xivaning qadimiy devorlarigacha — har bir qadamni bitta ilova orqali rejalashtiring va bron qiling.",
      ru: 'От голубых куполов Самарканда до древних стен Хивы — планируйте и бронируйте каждый шаг в одном приложении.',
    },
  },
  {
    id: 'slide-shah-i-zinda', i18n: 1,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Shah-i-Zinda%2C_Samarkand_%28Shohi-Zinda_majmuasi%2C_Samarqand%2C_%D0%A8%D0%B0%D1%85%D0%B8_%D0%97%D0%B8%D0%BD%D0%B4%D0%B0%29.jpg/1280px-Shah-i-Zinda%2C_Samarkand_%28Shohi-Zinda_majmuasi%2C_Samarqand%2C_%D0%A8%D0%B0%D1%85%D0%B8_%D0%97%D0%B8%D0%BD%D0%B4%D0%B0%29.jpg',
    title: { en: 'Travel together, worry less', uz: 'Birga sayohat qiling, kamroq tashvishlaning', ru: 'Путешествуйте вместе, волнуйтесь меньше' },
    text: {
      en: 'Hotels, guides, transfers, tickets and eSIM in one place. No more juggling a dozen apps on the road.',
      uz: "Mehmonxona, gid, transfer, chiptalar va eSIM — bir joyda. Yo'lda o'nlab ilovalar bilan ovora bo'lmang.",
      ru: 'Отели, гиды, трансферы, билеты и eSIM в одном месте. Больше никаких десятков приложений в дороге.',
    },
  },
  {
    id: 'slide-charvak', i18n: 2,
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Lac_Tcharvak.jpg',
    title: { en: 'Mountains, lakes and cities await', uz: "Tog'lar, ko'llar va shaharlar sizni kutmoqda", ru: 'Горы, озёра и города ждут вас' },
    text: {
      en: 'From Chimgan and Lake Charvak to the Aral Sea — hand-picked trips from trusted local partners.',
      uz: "Chimyon va Chorvoq ko'lidan Orol dengizigacha — ishonchli mahalliy hamkorlardan saralangan sayohatlar.",
      ru: 'От Чимгана и Чарвака до Аральского моря — отобранные поездки от проверенных местных партнёров.',
    },
  },
  {
    id: 'slide-khiva', i18n: 3,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Islam_Khodja_Madrasa_01.jpg/1280px-Islam_Khodja_Madrasa_01.jpg',
    title: { en: 'All of Uzbekistan, one booking away', uz: "Butun O'zbekiston — bir bron uzoqlikda", ru: 'Весь Узбекистан — в одном бронировании' },
    text: {
      en: 'Local eSIM, domestic flights, fair exchange rates and rides between every region.',
      uz: "Mahalliy eSIM, ichki reyslar, adolatli valyuta kursi va barcha viloyatlar orasida transfer.",
      ru: 'Местная eSIM, внутренние рейсы, честный курс обмена и трансферы между всеми регионами.',
    },
  },
]

// Legacy home-page statistics (no longer shown or edited; kept so older saved content still loads).
const defaultStats = [
  { key: 'travelers', value: 2.4, suffix: 'M+', digits: 1 },
  { key: 'countries', value: 190, suffix: '+', digits: 0 },
  { key: 'partners', value: 12500, suffix: '+', digits: 0 },
  { key: 'rating', value: 4.9, suffix: '/5', digits: 1 },
]

export let heroSlides = defaultHeroSlides
export let stats = defaultStats

export function setSite(next = {}) {
  if (Array.isArray(next.heroSlides) && next.heroSlides.length) heroSlides = next.heroSlides
  if (Array.isArray(next.stats)) stats = next.stats
}

export const defaultSite = { heroSlides: defaultHeroSlides, stats: defaultStats }

// Text of a slide in the current language.
export function slideText(slide, field, lng, t) {
  return slide[field]?.[lng]
    || (slide.i18n != null && t ? t(`hero.slides.${slide.i18n}.${field}`, { defaultValue: '' }) : '')
    || slide[field]?.en
    || ''
}
