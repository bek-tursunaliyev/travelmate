import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHero } from './Places'
import NotFound from './NotFound'
import { legalDoc, legalDocs } from '../data/legal'
import { useFormat } from '../hooks'

// /legal/privacy, /legal/terms, /legal/cookies
export default function Legal() {
  const { doc } = useParams()
  const { t, i18n } = useTranslation()
  const f = useFormat()
  const page = legalDocs.includes(doc) ? legalDoc(doc, i18n.resolvedLanguage) : null
  if (!page) return <NotFound />

  return (
    <>
      <PageHero title={page.title} subtitle={`${t('legal.updated')}: ${f.date(page.updated, { day: 'numeric', month: 'long', year: 'numeric' })}`}>
        <nav className="pills legal-tabs">
          {legalDocs.map((d) => (
            <Link key={d} to={`/legal/${d}`} className={`pill ${d === doc ? 'is-active' : ''}`}>{legalDoc(d, i18n.resolvedLanguage).title}</Link>
          ))}
        </nav>
      </PageHero>
      <section className="section section--flush">
        <div className="container legal">
          {page.sections.map(([heading, text]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
