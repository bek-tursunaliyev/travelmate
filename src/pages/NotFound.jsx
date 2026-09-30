import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaCompass } from 'react-icons/fa'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="empty-page">
      <FaCompass className="empty-page__icon" />
      <h1>404 · {t('common.notFound')}</h1>
      <p>{t('common.notFoundText')}</p>
      <Link to="/" className="btn btn--primary">{t('common.home')}</Link>
    </section>
  )
}
