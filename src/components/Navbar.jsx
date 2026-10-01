import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaGlobe, FaChevronDown, FaMobileAlt, FaApple, FaGooglePlay, FaBars, FaTimes,
  FaUserCircle, FaSignOutAlt, FaSuitcaseRolling, FaCheck, FaMoon, FaSun,
} from 'react-icons/fa'
import Logo from './Logo'
import SubNav from './SubNav'
import { languages } from '../i18n'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'
import { useClickOutside } from '../hooks'
import { menuLists } from '../data/places'

const navLinks = [
  { to: '/', key: 'home', end: true },
  { to: '/#services', key: 'services' },
  { to: '/places', key: 'places' },
  { to: '/tickets', key: 'tickets' },
  { to: '/#why', key: 'why' },
]

function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, close)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  return { open, setOpen, ref, close }
}

export function LanguageSwitcher({ inline = false }) {
  const { i18n, t } = useTranslation()
  const { open, setOpen, ref, close } = useDropdown()
  const current = languages.find((l) => l.code === i18n.resolvedLanguage) || languages[0]

  const choose = (code) => {
    i18n.changeLanguage(code)
    close()
  }

  if (inline) {
    return (
      <div className="lang-grid" role="listbox" aria-label={t('nav.language')}>
        {languages.map((l) => (
          <button key={l.code} className={`lang-option ${l.code === current.code ? 'is-active' : ''}`} onClick={() => choose(l.code)}>
            <span className="lang-option__code">{l.code.toUpperCase()}</span>
            {l.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="dropdown" ref={ref}>
      <button className="btn-ghost lang-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={t('nav.language')}>
        <FaGlobe />
        <span>{current.code.toUpperCase()}</span>
        <FaChevronDown className={`chev ${open ? 'is-open' : ''}`} />
      </button>
      {open && (
        <div className="dropdown__panel lang-panel">
          <p className="dropdown__title">{t('nav.language')}</p>
          {languages.map((l) => (
            <button key={l.code} className={`lang-row ${l.code === current.code ? 'is-active' : ''}`} onClick={() => choose(l.code)}>
              <span className="lang-option__code">{l.code.toUpperCase()}</span>
              <span className="lang-row__label">{l.label}</span>
              {l.code === current.code && <FaCheck className="lang-row__check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button className="icon-btn theme-btn" onClick={toggle} aria-label={t('nav.theme')} title={t('nav.theme')} aria-pressed={dark}>
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  )
}

export function StoreButtons({ small = false }) {
  const { t } = useTranslation()
  return (
    <div className={`store-buttons ${small ? 'store-buttons--small' : ''}`}>
      <a className="store-btn" href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
        <FaApple />
        <span><small>{t('app.downloadOn')}</small>App Store</span>
      </a>
      <a className="store-btn" href="https://play.google.com/store/search?q=TravelMate&c=apps" target="_blank" rel="noreferrer">
        <FaGooglePlay />
        <span><small>{t('app.getItOn')}</small>Google Play</span>
      </a>
    </div>
  )
}

function AppButton() {
  const { t } = useTranslation()
  const { open, setOpen, ref } = useDropdown()
  return (
    <div className="dropdown" ref={ref}>
      <button className="btn-ghost" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <FaMobileAlt />
        <span className="hide-lg">{t('nav.getApp')}</span>
      </button>
      {open && (
        <div className="dropdown__panel app-panel">
          <div className="app-panel__phone"><FaMobileAlt /></div>
          <h4>{t('app.title')}</h4>
          <p>{t('app.text')}</p>
          <StoreButtons small />
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { t } = useTranslation()
  const { user, bookings, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { open, setOpen, ref, close } = useDropdown()

  const onLogout = () => {
    logout()
    close()
    toast(t('auth.loggedOut'), 'info')
    navigate('/')
  }

  return (
    <div className="dropdown" ref={ref}>
      <button className="user-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <img src={user.picture} alt="" referrerPolicy="no-referrer" />
        <span className="hide-md">{user.givenName}</span>
        <FaChevronDown className={`chev ${open ? 'is-open' : ''}`} />
      </button>
      {open && (
        <div className="dropdown__panel user-panel">
          <div className="user-panel__head">
            <img src={user.picture} alt="" referrerPolicy="no-referrer" />
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <Link to="/profile" className="user-panel__link" onClick={close}>
            <FaUserCircle /> {t('nav.profile')}
          </Link>
          <Link to="/profile#bookings" className="user-panel__link" onClick={close}>
            <FaSuitcaseRolling /> {t('profile.bookings')}
            {bookings.length > 0 && <span className="badge">{bookings.length}</span>}
          </Link>
          <button className="user-panel__link user-panel__logout" onClick={onLogout}>
            <FaSignOutAlt /> {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ open, onClose }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const toast = useToast()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Portal to <body>: the header's backdrop-filter would otherwise trap position:fixed.
  return createPortal(
    <>
      <div className={`drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer__head">
          <Logo onClick={onClose} />
          <button className="icon-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>

        {user ? (
          <Link to="/profile" className="drawer__user" onClick={onClose}>
            <img src={user.picture} alt="" referrerPolicy="no-referrer" />
            <div><strong>{user.name}</strong><small>{user.email}</small></div>
          </Link>
        ) : (
          <div className="drawer__auth">
            <Link to="/login" className="btn btn--outline" onClick={onClose}>{t('nav.login')}</Link>
            <Link to="/signup" className="btn btn--primary" onClick={onClose}>{t('nav.signup')}</Link>
          </div>
        )}

        <nav className="drawer__links">
          {navLinks.map((l) => (
            <Link key={l.key} to={l.to} onClick={onClose}>{t(`nav.${l.key}`)}</Link>
          ))}
          {menuLists.map((list) => (
            <Link key={list} to={`/popular/${list}`} onClick={onClose}>{t(`subnav.${list}`)}</Link>
          ))}
        </nav>

        <p className="drawer__label">{t('nav.language')}</p>
        <LanguageSwitcher inline />

        <p className="drawer__label">{t('nav.getApp')}</p>
        <StoreButtons small />

        {user && (
          <button
            className="btn btn--outline drawer__logout"
            onClick={() => { logout(); onClose(); toast(t('auth.loggedOut'), 'info') }}
          >
            <FaSignOutAlt /> {t('nav.logout')}
          </button>
        )}
      </aside>
    </>,
    document.body,
  )
}

export default function Navbar() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (l) =>
    l.to.includes('#') ? location.pathname === '/' && location.hash === l.to.slice(1) : location.pathname === l.to && !location.hash

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar container">
        <Logo />

        <nav className="navbar__links" aria-label="Main">
          {navLinks.map((l) => (
            <NavLink key={l.key} to={l.to} className={() => (isActive(l) ? 'is-active' : '')}>
              {t(`nav.${l.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <ThemeToggle />
          <LanguageSwitcher />
          <AppButton />
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost-primary hide-sm">{t('nav.login')}</Link>
              <Link to="/signup" className="btn btn--primary hide-sm">{t('nav.signup')}</Link>
            </>
          )}
          <button className="icon-btn burger" onClick={() => setMenuOpen(true)} aria-label={t('nav.menu')}>
            <FaBars />
          </button>
        </div>
      </div>
      <SubNav />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
