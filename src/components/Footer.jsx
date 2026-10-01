import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
} from 'react-icons/fa'
import Logo from './Logo'
import { StoreButtons } from './Navbar'
import { services, serviceHref } from '../data/services'

const YEAR = new Date().getFullYear()

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
              <li><FaEnvelope /> <a href="mailto:travelmatee@gmail.com">travelmatee@gmail.com</a></li>
            </ul>
          </div>

          <div>
            <h4>{t('footer.company')}</h4>
            <ul>
              <li><Link to="/#faq">{t('footer.aboutUs')}</Link></li>
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
              <li><a href="mailto:travelmatee@gmail.com">{t('footer.help')}</a></li>
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
            <Link to="/legal/privacy">{t('footer.privacy')}</Link>
            <Link to="/legal/terms">{t('footer.terms')}</Link>
            <Link to="/legal/cookies">{t('footer.cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
