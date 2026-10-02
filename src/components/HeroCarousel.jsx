import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { heroSlides } from '../data/site'
import { useLocalizedText } from '../i18n/auto'
import SearchBar from './SearchBar'

const INTERVAL = 6000

export default function HeroCarousel() {
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage
  const lt = useLocalizedText()
  // Written translation for this language → the translation file (built-in slides) → automatic.
  const slideText = (slide, field) => slide[field]?.[lng]
    || (slide.i18n != null ? t(`hero.slides.${slide.i18n}.${field}`, { defaultValue: '' }) : '')
    || lt(slide[field])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const count = heroSlides.length
  const current = heroSlides[index % count] || heroSlides[0]

  const go = useCallback((i) => setIndex((i + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (paused) return undefined
    const id = setTimeout(next, INTERVAL)
    return () => clearTimeout(id)
  }, [index, paused, next])

  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
    touchX.current = null
  }

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={onTouchEnd}
    >
      {/* One video stays in place; only the slide texts change. The two corner marks sit on the video like a burned-in watermark. */}
      <div className="hero__media">
        <video className="hero__video" src="/hero.mp4" poster="/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="hero__overlay" />
        <img className="hero__mark hero__mark--partner" src="/uzairways-white.svg" alt="" aria-hidden="true" />
        <span className="hero__mark hero__mark--brand" aria-hidden="true">
          <span className="hero__mark-logo"><span className="logo__body" /><span className="logo__arrow" /></span>
          TravelMate
        </span>
      </div>

      <div className="container hero__content">
        <div className="hero__text" key={index}>
          <span className="hero__eyebrow">TravelMate · {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}</span>
          <h1>{current && slideText(current, 'title')}</h1>
          <p>{current && slideText(current, 'text')}</p>
        </div>

        <div onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
          <SearchBar />
        </div>
      </div>

      <div className="hero__controls">
        <div className="hero__dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === index ? 'is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`${i + 1}`}
            >
              {i === index && !paused && <span className="hero__progress" style={{ animationDuration: `${INTERVAL}ms` }} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
