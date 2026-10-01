import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaFacebookF, FaInstagram, FaTelegramPlane, FaYoutube, FaLinkedinIn,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
} from 'react-icons/fa'
import Logo from './Logo'
import { StoreButtons } from './Navbar'
import { services, serviceHref } from '../data/services'

const YEAR = new Date().getFullYear()

const socials = [
  { icon: FaTelegramPlane, href: 'https://t.me/', label: 'Telegram' },
  { icon: FaInstagram, href: 'https://instagram.com/', label: 'Instagram' },
  { icon: FaFacebookF, href: 'https://facebook.com/', label: 'Facebook' },
  { icon: FaYoutube, href: 'https://youtube.com/', label: 'YouTube' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com/', label: 'LinkedIn' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo light />
            <p>{t('footer.about')}</p>
            <ul className="footer__contact">
              <li><FaMapMarkerAlt /> {t('footer.address')}</li>
              <li><FaPhoneAlt /> <a href="tel:+998916550112">+998 91 655 01 12</a></li>
              <li><FaEnvelope /> <a href="mailto:support@travelmate.uz">support@travelmate.uz</a></li>
            </ul>
            <div className="socials">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>
              ))}
            </div>
          </div>

          <div>
            <h4>{t('footer.company')}</h4>
            <ul>
              <li><Link to="/#why">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/#famous">{t('famous.title')}</Link></li>
              <li><Link to="/popular/destinations">{t('subnav.destinations')}</Link></li>
              <li><Link to="/popular/landmarks">{t('subnav.landmarks')}</Link></li>
              <li><Link to="/popular/regions">{t('subnav.regions')}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t('footer.servicesCol')}</h4>
            <ul>
              {services.map((s) => (
                <li key={s.id}><Link to={serviceHref(s.id)}>{t(`services.items.${s.id}.title`)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('footer.support')}</h4>
            <ul>
              <li><a href="mailto:support@travelmate.uz">{t('footer.help')}</a></li>
              <li><a href="tel:+998916550112">{t('footer.contact')}</a></li>
              <li><Link to="/profile#bookings">{t('footer.myBookings')}</Link></li>
              <li><Link to="/login">{t('nav.login')}</Link></li>
              <li><Link to="/signup">{t('nav.signup')}</Link></li>
            </ul>
            <h4 className="footer__app-title">{t('nav.getApp')}</h4>
            <StoreButtons small />
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {YEAR} TravelMate. {t('footer.rights')}</span>
          <div>
            <a href="#privacy">{t('footer.privacy')}</a>
            <a href="#terms">{t('footer.terms')}</a>
            <a href="#cookies">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
