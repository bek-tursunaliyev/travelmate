import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaStar, FaMapMarkerAlt, FaExchangeAlt } from 'react-icons/fa'
import { currencies, serviceById } from '../data/services'
import { useBook, useFormat } from '../hooks'

export function OfferCard({ offer, service }) {
  const { t } = useTranslation()
  const f = useFormat()
  const book = useBook()
  const s = serviceById[service]
  const Icon = s.icon

  return (
    <article className="offer" style={{ '--c': s.color }}>
      <div className="offer__top">
        <span className="offer__icon"><Icon /></span>
        <span className="rating"><FaStar /> {offer.rating} <small>({f.number(offer.reviews)} {t('common.reviews')})</small></span>
      </div>
      <h3>{offer.name}</h3>
      <p className="offer__loc"><FaMapMarkerAlt /> {offer.location}</p>
      <div className="chips chips--small">
        {offer.tags.map((tag) => <span key={tag} className="chip chip--static">{tag}</span>)}
      </div>
      <div className="offer__foot">
        {offer.unit === 'rate' ? (
          <span className="offer__price"><b>{t('common.free')}</b></span>
        ) : (
          <span className="offer__price">
            <span><small>{t('common.from')}</small> <b>{f.money(offer.price)}</b> <small>{t(`common.per.${offer.unit}`)}</small></span>
            <small className="price__uzs">≈ {f.uzs(offer.price)}</small>
          </span>
        )}
        <button
          className="btn btn--primary btn--sm"
          onClick={() => book({ id: offer.id, name: offer.name, kind: service, price: offer.price, meta: offer.location })}
        >
          {t('common.book')}
        </button>
      </div>
    </article>
  )
}

export function CurrencyConverter() {
  const { t } = useTranslation()
  const f = useFormat()
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('UZS')
  const codes = Object.keys(currencies)

  const value = Number(amount.replace(',', '.'))
  const valid = Number.isFinite(value) && value >= 0
  const rate = currencies[from] / currencies[to]
  const result = valid ? value * rate : 0

  const quick = useMemo(() => ['EUR', 'RUB', 'UZS', 'TRY'].filter((c) => c !== from), [from])

  return (
    <div className="converter">
      <h3><FaExchangeAlt /> {t('service.converter')}</h3>
      <div className="converter__row">
        <label>
          <span>{t('service.amount')}</span>
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={valid ? '' : 'is-invalid'} />
        </label>
        <label>
          <span>{t('service.from')}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {codes.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <button className="icon-btn converter__swap" onClick={() => { setFrom(to); setTo(from) }} aria-label={t('service.swap')}>
          <FaExchangeAlt />
        </button>
        <label>
          <span>{t('service.to')}</span>
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {codes.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <div className="converter__result">
        <span>{t('service.result')}</span>
        <strong>{f.money(result, to)}</strong>
        <small>1 {from} = {f.number(rate, rate < 1 ? 6 : 2)} {to} · {t('service.rateNote')}</small>
      </div>
      <div className="converter__quick">
        {quick.map((c) => (
          <span key={c}>1 {from} = <b>{f.number(currencies[from] / currencies[c], 2)}</b> {c}</span>
        ))}
      </div>
    </div>
  )
}
