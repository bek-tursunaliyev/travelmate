import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to #hash targets (e.g. /#services) or to the top on page change.
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // `key` changes on every navigation, so clicking the same #link again re-scrolls.
  useEffect(() => {
    if (!hash) return undefined
    let tries = 0
    const id = setInterval(() => {
      const el = document.getElementById(hash.slice(1))
      if (el || ++tries > 20) {
        clearInterval(id)
        if (el) {
          const offset = document.querySelector('.header')?.offsetHeight || 0
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset - 8, behavior: 'smooth' })
        }
      }
    }, 50)
    return () => clearInterval(id)
  }, [hash, key])

  return null
}
