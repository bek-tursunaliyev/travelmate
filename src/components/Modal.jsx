import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FaTimes } from 'react-icons/fa'

// Accessible dialog: Escape and backdrop close it, the page behind does not scroll.
// Portalled to <body> because the header's backdrop-filter would trap position:fixed.
export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="g-modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={`g-modal__box ${wide ? 'g-modal__box--wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="g-modal__head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close" autoFocus><FaTimes /></button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
