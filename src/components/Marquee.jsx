import { useEffect, useRef } from 'react'

const SPEED = 0.045 // px per ms (~45 px/s)
const RESUME_MS = 1600 // pause after the user lets go before auto-scrolling again
const DRAG_THRESHOLD = 6

/**
 * Endless horizontal strip that scrolls by itself and can be dragged (mouse) or swiped (touch).
 * `children(copy)` renders one copy of the items; it is called twice so the strip loops seamlessly.
 * There are no arrow buttons: the only controls are dragging and the trackpad / shift+wheel.
 */
export default function Marquee({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    let last = performance.now()
    let pos = el.scrollLeft
    let holdUntil = 0
    let hovering = false
    let drag = null
    let moved = false

    // One copy is exactly half the scroll width; jump back by it to loop without a seam.
    const half = () => el.scrollWidth / 2
    const wrap = () => {
      const h = half()
      if (h <= 0) return
      if (el.scrollLeft >= h) el.scrollLeft -= h
      else if (el.scrollLeft <= 0) el.scrollLeft += h
    }

    let expected = null
    const tick = (now) => {
      const dt = Math.min(now - last, 64)
      last = now
      // Anything that moved the strip besides us (a swipe and its momentum, a trackpad) pauses autoplay.
      if (expected !== null && Math.abs(el.scrollLeft - expected) > 1.5) hold()
      if (!reduced && !drag && !hovering && now > holdUntil && !document.hidden) {
        pos += SPEED * dt
        el.scrollLeft = pos
        // scrollLeft is rounded by the browser, so keep the fractional position ourselves.
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft
      }
      wrap()
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft
      expected = el.scrollLeft
      raf = requestAnimationFrame(tick)
    }

    function hold() { holdUntil = performance.now() + RESUME_MS }

    // Mouse drag (touch uses native scrolling, which is smoother on phones).
    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      drag = { x: e.clientX, left: el.scrollLeft }
      moved = false
    }
    const onPointerMove = (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!moved && Math.abs(dx) < DRAG_THRESHOLD) return
      if (!moved) {
        moved = true
        el.classList.add('is-dragging')
        el.setPointerCapture?.(e.pointerId)
      }
      el.scrollLeft = drag.left - dx
      wrap()
      drag.left = el.scrollLeft + dx
    }
    const endDrag = () => {
      if (!drag) return
      drag = null
      el.classList.remove('is-dragging')
      hold()
    }
    // A drag must not also open the card under the pointer.
    const onClick = (e) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }
    const onEnter = () => { hovering = true }
    const onLeave = () => { hovering = false; endDrag() }
    const onTouch = () => hold()
    const onWheel = () => hold()

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('click', onClick, true)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('touchstart', onTouch, { passive: true })
    el.addEventListener('touchmove', onTouch, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: true })
    const onDragStart = (e) => e.preventDefault() // stop native image / link dragging
    el.addEventListener('dragstart', onDragStart)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('click', onClick, true)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('touchstart', onTouch)
      el.removeEventListener('touchmove', onTouch)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return (
    <div className={`marquee ${className}`} ref={ref}>
      <div className="marquee__track">
        {children(0)}
        {children(1)}
      </div>
    </div>
  )
}
