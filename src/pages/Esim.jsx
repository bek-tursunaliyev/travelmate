import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaArrowLeft, FaQrcode, FaShoppingBag, FaSignal, FaCheck, FaMobileAlt, FaWifi, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { PageHero } from './Places'
import Price from '../components/Price'
import { esimOperators, esimPlans, esimOperatorById, esimDurations } from '../data/esim'
import { services, serviceHref } from '../data/services'
import { useBook } from '../hooks'

// Operator mark: the uploaded logo, or the name as a wordmark in the brand colour.
export function OperatorMark({ op, size = 'md' }) {
  if (!op) return null
  return op.logo ? (
    <img className={`op-mark op-mark--img op-mark--${size}`} src={op.logo} alt={op.name} loading="lazy" />
  ) : (
    <span className={`op-mark op-mark--${size}`} style={{ '--op-bg': op.color, '--op-ink': op.ink }}>{op.name}</span>
  )
}

function PlanCard({ plan }) {
  const { t } = useTranslation()
  const book = useBook()
  const op = esimOperatorById(plan.operator)
  const data = plan.gb ? `${plan.gb} GB` : t('esim.unlimited')
  return (
    <article className={`esim-plan ${plan.popular ? 'is-popular' : ''}`}>
      <div className="esim-plan__top">
        <OperatorMark op={op} />
        {plan.popular && <span className="esim-plan__badge">{t('esim.popular')}</span>}
      </div>
      <strong className="esim-plan__data">{data}</strong>
      <ul className="esim-plan__facts">
        <li><FaCalendarAlt /> {t('esim.days', { count: Number(plan.days) })}</li>
        <li><FaSignal /> {op?.network || '4G'}</li>
        <li><FaMapMarkerAlt /> {t('esim.coverage')}</li>
      </ul>
      <div className="esim-plan__foot">
        <Price usd={Number(plan.price)} />
        <button
          className="btn btn--primary btn--sm"
          onClick={() => book({ id: plan.id, name: `${op?.name || ''} eSIM · ${data} · ${t('esim.days', { count: Number(plan.days) })}`, kind: 'esim', price: Number(plan.price), meta: t('esim.qrByEmail') })}
        >
          {t('esim.buy')}
        </button>
      </div>
    </article>
  )
}

export default function EsimPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [devicesOpen, setDevicesOpen] = useState(false)
  const operator = esimOperatorById(params.get('op')) ? params.get('op') : ''
  const duration = esimDurations.some((d) => d.id === params.get('days')) ? params.get('days') : ''

  const update = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }
  const test = esimDurations.find((d) => d.id === duration)?.test
  const plans = esimPlans
    .filter((p) => (!operator || p.operator === operator) && (!test || test(Number(p.days))))
    .sort((a, b) => Number(a.price) - Number(b.price))

  return (
    <>
      <PageHero title={t('esim.title')} subtitle={t('esim.subtitle')} photo="Tashkent">
        <Link to="/#services" className="back-link"><FaArrowLeft className="flip-rtl" /> {t('services.all')}</Link>
      </PageHero>

      <div className="container service-tabs">
        {services.map((s) => (
          <Link key={s.id} to={serviceHref(s.id)} className={`pill ${s.id === 'esim' ? 'is-active' : ''}`}>
            <s.icon /> {t(`services.items.${s.id}.title`)}
          </Link>
        ))}
      </div>

      <section className="section section--flush">
        <div className="container">
          <div className="esim-ops" role="radiogroup" aria-label={t('esim.operator')}>
            <button role="radio" aria-checked={!operator} className={`esim-op ${!operator ? 'is-active' : ''}`} onClick={() => update({ op: '' })}>
              {t('esim.allOperators')}
            </button>
            {esimOperators.map((op) => (
              <button
                key={op.id}
                role="radio"
                aria-checked={operator === op.id}
                className={`esim-op ${operator === op.id ? 'is-active' : ''}`}
                onClick={() => update({ op: op.id })}
              >
                <OperatorMark op={op} size="sm" />
              </button>
            ))}
          </div>

          <div className="g-toolbar">
            <p className="g-toolbar__count">{t('esim.count', { count: plans.length })}</p>
            <div className="g-where__options" role="radiogroup" aria-label={t('esim.validity')}>
              {['', ...esimDurations.map((d) => d.id)].map((id) => (
                <button key={id || 'all'} role="radio" aria-checked={duration === id} className={`g-seg ${duration === id ? 'is-active' : ''}`} onClick={() => update({ days: id })}>
                  {t(`esim.durations.${id || 'all'}`)}
                </button>
              ))}
            </div>
          </div>

          {plans.length ? (
            <div className="esim-grid">{plans.map((p) => <PlanCard key={p.id} plan={p} />)}</div>
          ) : (
            <div className="empty-state g-empty">
              <FaWifi />
              <h2>{t('esim.emptyTitle')}</h2>
              <button className="btn btn--primary" onClick={() => setParams({}, { replace: true })}>{t('esim.showAll')}</button>
            </div>
          )}

          <div className="esim-how">
            <h2 className="section-title">{t('esim.howTitle')}</h2>
            <ol>
              {[['choose', FaShoppingBag], ['scan', FaQrcode], ['connect', FaWifi]].map(([k, Icon], i) => (
                <li key={k}>
                  <span className="esim-how__icon"><Icon /></span>
                  <small>{i + 1}</small>
                  <strong>{t(`esim.how.${k}.title`)}</strong>
                  <p>{t(`esim.how.${k}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="esim-compat">
            <FaMobileAlt className="esim-compat__icon" />
            <div>
              <h3>{t('esim.compatTitle')}</h3>
              <p>{t('esim.compatText')}</p>
              {devicesOpen ? (
                <ul className="esim-compat__list">
                  {t('esim.devices', { returnObjects: true }).map((d) => <li key={d}><FaCheck /> {d}</li>)}
                </ul>
              ) : (
                <button className="g-link" onClick={() => setDevicesOpen(true)}>{t('esim.showDevices')}</button>
              )}
            </div>
          </div>

          <div className="esim-faq">
            <h2 className="section-title">{t('esim.faqTitle')}</h2>
            {t('esim.faq', { returnObjects: true }).map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
