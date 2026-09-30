import { Link } from 'react-router-dom'

// public/logo.png split into two alpha masks (logo-body / logo-arrow) so both
// parts can be recolored with CSS variables for light, dark and footer themes.
export default function Logo({ light = false, onClick }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} onClick={onClick} aria-label="TravelMate home">
      <span className="logo__mark" aria-hidden="true">
        <span className="logo__body" />
        <span className="logo__arrow" />
      </span>
      <span className="logo__name">
        Travel<span>Mate</span>
      </span>
    </Link>
  )
}
