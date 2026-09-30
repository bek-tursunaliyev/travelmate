import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en'
import uz from './locales/uz'
import ru from './locales/ru'
import zh from './locales/zh'
import es from './locales/es'
import fr from './locales/fr'
import de from './locales/de'
import ar from './locales/ar'
import hi from './locales/hi'
import pt from './locales/pt'
import ja from './locales/ja'

// 10 most widely used languages + Uzbek
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
]

const resources = Object.fromEntries(
  Object.entries({ en, uz, ru, zh, es, fr, de, ar, hi, pt, ja }).map(([k, v]) => [k, { translation: v }]),
)

function applyDocumentLang(lng) {
  const lang = languages.find((l) => l.code === lng) || languages[0]
  document.documentElement.lang = lang.code
  document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
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
i18n.on('languageChanged', applyDocumentLang)

export default i18n
