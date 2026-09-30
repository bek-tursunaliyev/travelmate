import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { heroSlides } from '../data/places'
import SearchBar from './SearchBar'

const INTERVAL = 6000

export default function HeroCarousel() {
  const { t } = useTranslation()
  const slides = t('hero.slides', { returnObjects: true })
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const count = heroSlides.length

  const go = useCallback((i) => setIndex((i + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (paused) return undefined
    const id = setTimeout(next, INTERVAL)
    return () => clearTimeout(id)
  }, [index, paused, next])

  // Preload all slide images so transitions never flash.
  useEffect(() => {
    heroSlides.forEach((src) => { const img = new Image(); img.src = src })
  }, [])

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
      <div className="hero__media">
        {heroSlides.map((src, i) => (
          <div
            key={src}
            className={`hero__slide ${i === index ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden={i !== index}
          />
        ))}
        <div className="hero__overlay" />
      </div>

      <div className="container hero__content">
        <div className="hero__text" key={index}>
          <span className="hero__eyebrow">TravelMate · {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}</span>
          <h1>{slides[index]?.title}</h1>
          <p>{slides[index]?.text}</p>
        </div>

        <div onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
          <SearchBar />
        </div>
      </div>

      <div className="hero__controls">
        <button className="hero__arrow" onClick={prev} aria-label={t('hero.prev')}><FaChevronLeft className="flip-rtl" /></button>
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
        <button className="hero__arrow" onClick={next} aria-label={t('hero.next')}><FaChevronRight className="flip-rtl" /></button>
      </div>
    </section>
  )
}
