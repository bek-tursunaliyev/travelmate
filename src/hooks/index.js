import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

/* ---------- Wikipedia summary (real photos + descriptions) ---------- */

const wikiCache = new Map()

function loadWiki(title) {
  if (!wikiCache.has(title)) {
    const cached = sessionStorage.getItem(`wiki_${title}`)
    const promise = cached
      ? Promise.resolve(JSON.parse(cached))
      : fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
          .then((d) => {
            const data = {
              thumb: d.thumbnail?.source || null,
              image: d.originalimage?.source || d.thumbnail?.source || null,
              extract: d.extract || '',
              url: d.content_urls?.desktop?.page || null,
            }
            try { sessionStorage.setItem(`wiki_${title}`, JSON.stringify(data)) } catch { /* quota */ }
            return data
          })
          .catch(() => {
            wikiCache.delete(title)
            return { thumb: null, image: null, extract: '', url: null }
          })
    wikiCache.set(title, promise)
  }
  return wikiCache.get(title)
}

// Wikimedia serves pre-rendered thumbnails at standard widths.
export const sizedThumb = (src, width = 500) =>
  src ? src.replace(/\/(\d+)px-([^/?]+)(\?.*)?$/, `/${width}px-$2`) : src

export function useWiki(title) {
  const [state, setState] = useState({ loading: true, data: null, title })
  useEffect(() => {
    let alive = true
    if (!title) return undefined
    loadWiki(title).then((data) => alive && setState({ loading: false, data, title }))
    return () => { alive = false }
  }, [title])
  // Derived during render so a new title never shows the previous place's data.
  return state.title === title ? state : { loading: true, data: null, title }
}

/* ---------- Visibility + counters ---------- */

const defaultObserverOptions = { threshold: 0.2 }

export function useInView(options = defaultObserverOptions) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return undefined
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
  }, [inView, options])
  return [ref, inView]
}

export function useCountUp(target, start, duration = 1600) {
  const [value, setValue] = useState(0)
  const current = useRef(0)
  useEffect(() => {
    if (!start) return undefined
    let raf
    // Animate from wherever we are now, so later target changes tick up smoothly.
    const from = current.current
    const span = from === 0 ? duration : 600
    const t0 = performance.now()
    const tick = (now) => {
      // rAF timestamps can be slightly earlier than t0, so clamp to [0, 1].
      const p = Math.min(1, Math.max(0, (now - t0) / span))
      current.current = from + (target - from) * (1 - Math.pow(1 - p, 3))
      setValue(current.current)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start, duration])
  return value
}

export function useClickOutside(ref, onOutside) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [ref, onOutside])
}

/* ---------- Booking (requires Google login) ---------- */

export function useBook() {
  const { user, addBooking } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  return useCallback(
    (item) => {
      if (!user) {
        toast(t('auth.required'), 'info')
        navigate('/login', { state: { from: location.pathname + location.search + location.hash } })
        return
      }
      if (addBooking(item)) toast(t('toast.booked', { name: item.name }))
      else toast(t('toast.already'), 'info')
    },
    [user, addBooking, toast, navigate, location, t],
  )
}

/* ---------- Formatting ---------- */

// Browsers ship little or no Uzbek date data (Chrome prints "M10 5"), so format it by hand.
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const UZ_DAYS = ['Yak', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha']

function formatUzDate(d, opts) {
  const parts = []
  if (opts.weekday) parts.push(`${UZ_DAYS[d.getDay()]},`)
  if (opts.day) parts.push(d.getDate())
  if (opts.month) parts.push(opts.month === 'long' ? UZ_MONTHS[d.getMonth()] : UZ_MONTHS[d.getMonth()].slice(0, 3))
  if (opts.hour) parts.push(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
  return parts.join(' ')
}

export function useFormat() {
  const { i18n } = useTranslation()
  const lng = i18n.resolvedLanguage || 'en'
  const dateFmt = (d, opts = { day: 'numeric', month: 'short' }) =>
    lng === 'uz' ? formatUzDate(new Date(d), opts) : new Intl.DateTimeFormat(lng, opts).format(new Date(d))
  return {
    date: dateFmt,
    money: (v, currency = 'USD') =>
      new Intl.NumberFormat(lng, { style: 'currency', currency, maximumFractionDigits: v < 1 ? 4 : 2, minimumFractionDigits: 0 }).format(v),
    number: (v, digits = 0) => new Intl.NumberFormat(lng, { maximumFractionDigits: digits }).format(v),
  }
}
