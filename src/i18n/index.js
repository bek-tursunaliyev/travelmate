import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en'
import { setPlaceLanguage } from '../data/places'

// English ships with the app (it is the fallback); every other language is its own small chunk,
// downloaded only when a visitor uses it.
const loaders = import.meta.glob(['./locales/*.js', '!./locales/en.js'])
const lazyLocales = {
  type: 'backend',
  init() {},
  read(lng, ns, done) {
    const load = loaders[`./locales/${lng}.js`]
    if (!load) return done(null, {})
    load().then((m) => done(null, m.default), (err) => done(err, null))
  },
}

// Languages of the main travel markets for Uzbekistan (15)
export const languages = [
  { code: 'en', label: 'English' },
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية', rtl: true },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'it', label: 'Italiano' },
  { code: 'kk', label: 'Қазақша' },
]


function applyDocumentLang(lng) {
  const lang = languages.find((l) => l.code === lng) || languages[0]
  document.documentElement.lang = lang.code
  document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr'
}

// Resolves once the visitor's language is loaded; main.jsx renders after it.
export const i18nReady = i18n
  .use(lazyLocales)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    react: { useSuspense: false },
    fallbackLng: 'en',
    supportedLngs: languages.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    returnObjects: false,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'tm_lang',
      caches: ['localStorage'],
    },
  })

applyDocumentLang(i18n.resolvedLanguage)
setPlaceLanguage(i18n.resolvedLanguage)
// Registered before any component subscribes, so place names are swapped before React re-renders.
i18n.on('languageChanged', (lng) => {
  applyDocumentLang(lng)
  setPlaceLanguage(i18n.resolvedLanguage || lng)
})

export default i18n
