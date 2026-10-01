import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft, ArrowDown, Check, MapPin, Lock, Users, Briefcase, Minus, Plus, ChevronDown, Info, ShieldCheck,
} from 'lucide-react'
import Price from '../components/Price'
import PlaceImage from '../components/PlaceImage'
import {
  PICKUP, transferDestinations, vehicleClasses, destinationById, vehicleById, transferPrice,
} from '../data/transfers'
import { useAuth } from '../context/AuthContext'
import { useBook, useFormat } from '../hooks'

const DRAFT_KEY = 'tm_transfer_draft'
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function Steps({ step }) {
  const { t } = useTranslation()
  return (
    <ol className="tf-steps" aria-label={t('transfer.stepOf', { n: step })}>
      {['vehicle', 'details'].map((k, i) => (
        <li key={k} className={i + 1 === step ? 'is-current' : i + 1 < step ? 'is-done' : ''} aria-current={i + 1 === step ? 'step' : undefined}>
          <span className="tf-steps__dot">{i + 1 < step ? <Check size={14} /> : i + 1}</span>
          {t(`transfer.steps.${k}`)}
        </li>
      ))}
    </ol>
  )
}

// Tashkent is fixed; the drop-off is a select on step 1 and read-only on step 2.
function Route({ destination, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="tf-route">
      <div className="tf-route__stop">
        <span className="tf-route__label">{t('transfer.pickup')}</span>
        <span className="tf-route__value"><MapPin size={16} /> {PICKUP} <Lock size={13} className="tf-route__lock" aria-label={t('transfer.pickupFixed')} /></span>
      </div>
      <ArrowDown size={16} className="tf-route__arrow" aria-hidden="true" />
      <div className="tf-route__stop">
        <span className="tf-route__label">{t('transfer.dropoff')}</span>
        {onChange ? (
          <label className="tf-select">
            <MapPin size={16} />
            <select value={destination?.id || ''} onChange={(e) => onChange(e.target.value)} aria-label={t('transfer.dropoff')}>
              <option value="" disabled>{t('transfer.choose')}</option>
              {transferDestinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <ChevronDown size={16} className="tf-select__chev" />
          </label>
        ) : (
          <span className="tf-route__value"><MapPin size={16} /> {destination.name}</span>
        )}
      </div>
      {destination && <p className="tf-route__meta">{t('transfer.duration', { hours: destination.hours, km: destination.km })}</p>}
    </div>
  )
}

/* ------------------------------ Step 1: /transfers ------------------------------ */

function VehicleCard({ vehicle, destination, selected, onSelect }) {
  const { t } = useTranslation()
  return (
    <article className={`tf-vehicle ${selected ? 'is-selected' : ''}`}>
      <div className="tf-vehicle__img"><PlaceImage wiki={vehicle.wiki} alt="" width={330} /></div>
      <div className="tf-vehicle__info">
        <h3>{t(`transfer.vehicles.${vehicle.id}`)}</h3>
        <p className="tf-vehicle__cap">
          <span><Users size={14} /> {vehicle.passengers}</span>
          <span><Briefcase size={14} /> {vehicle.luggage}</span>
          <span className="sr-only">{t('transfer.capacity', { p: vehicle.passengers, l: vehicle.luggage })}</span>
        </p>
        <p className="tf-vehicle__models">{t('transfer.similar', { models: vehicle.models })}</p>
      </div>
      <div className="tf-vehicle__buy">
        {destination ? (
          <span className="tf-vehicle__price"><small>{t('transfer.from')}</small> <Price usd={transferPrice(vehicle, destination)} /></span>
        ) : (
          <span className="tf-vehicle__noprice">—</span>
        )}
        <button
          className={`btn btn--sm ${selected ? 'btn--primary' : 'btn--outline'}`}
          onClick={onSelect}
          disabled={!destination}
          aria-pressed={selected}
        >
          {selected && <Check size={15} />} {selected ? t('transfer.selected') : t('transfer.select')}
        </button>
      </div>
    </article>
  )
}

export function TransferSelect() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const destination = destinationById[params.get('to')]
  const selectedId = vehicleById[params.get('vehicle')] ? params.get('vehicle') : ''

  const setDestination = (id) => {
    const next = new URLSearchParams(params)
    next.set('to', id)
    setParams(next, { replace: true })
  }

  return (
    <section className="tf">
      <div className="container">
        <Link to="/#services" className="tf-back"><ArrowLeft size={16} className="flip-rtl" /> {t('services.all')}</Link>
        <Steps step={1} />
        <h1 className="tf-title">{t('transfer.title')}</h1>

        <div className="tf-layout tf-layout--select">
          <aside className="tf-side">
            <Route destination={destination} onChange={setDestination} />
            <div className="tf-why">
              <h2>{t('transfer.why')}</h2>
              <ul>
                {['pricing', 'driver', 'easy', 'cancel'].map((k) => <li key={k}><Check size={16} /> {t(`transfer.whyItems.${k}`)}</li>)}
              </ul>
            </div>
          </aside>

          <div className="tf-vehicles">
            {!destination && <p className="tf-hint"><Info size={16} /> {t('transfer.pricesHint')}</p>}
            {vehicleClasses.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                destination={destination}
                selected={selectedId === v.id}
                onSelect={() => navigate(`/transfers/book?to=${destination.id}&vehicle=${v.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Step 2: /transfers/book ------------------------------ */

function Stepper({ id, label, icon: Icon, value, min, max, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="tf-field">
      <span id={id} className="tf-field__label">{label}</span>
      <div className="tf-stepper" role="group" aria-labelledby={id}>
        <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={t('guides.book.fewer')}><Minus size={16} /></button>
        <output><Icon size={15} /> {value}</output>
        <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t('guides.book.more')}><Plus size={16} /></button>
      </div>
      <small className="tf-field__hint">{t('transfer.max', { count: max })}</small>
    </div>
  )
}

function Field({ id, label, error, optional, children }) {
  const { t } = useTranslation()
  return (
    <div className={`tf-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="tf-field__label">
        {label} {optional && <span className="tf-field__opt">{t('transfer.optionalTag')}</span>}
      </label>
      {children}
      {error && <small className="tf-field__error" id={`${id}-error`}>{error}</small>}
    </div>
  )
}

function readDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY)) || {}
  } catch {
    return {}
  }
}

export function TransferCheckout() {
  const { t } = useTranslation()
  const f = useFormat()
  const book = useBook()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const destination = destinationById[params.get('to')]
  const vehicle = vehicleById[params.get('vehicle')]

  // The form survives the Google sign-in redirect via sessionStorage.
  const [today] = useState(() => isoDate(new Date()))
  const [form, setForm] = useState(() => {
    const draft = readDraft()
    const [first = '', ...rest] = (user?.name || '').split(' ')
    return {
      date: draft.date && draft.date >= isoDate(new Date()) ? draft.date : isoDate(new Date(Date.now() + 864e5)),
      time: draft.time || '10:00',
      passengers: draft.passengers || 1,
      luggage: draft.luggage ?? 1,
      first: draft.first ?? first,
      last: draft.last ?? rest.join(' '),
      phone: draft.phone || '',
      email: draft.email ?? (user?.email || ''),
      whatsapp: draft.whatsapp || '',
      request: draft.request || '',
    }
  })
  const [extrasOpen, setExtrasOpen] = useState(() => Boolean(form.whatsapp || form.request))
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form)) } catch { /* private mode */ }
  }, [form])

  if (!destination || !vehicle) {
    return <Navigate to={destination ? `/transfers?to=${destination.id}` : '/transfers'} replace />
  }

  const price = transferPrice(vehicle, destination)
  const passengers = Math.min(form.passengers, vehicle.passengers)
  const luggage = Math.min(form.luggage, vehicle.luggage)
  const set = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }))
  const setNum = (key) => (value) => setForm((s) => ({ ...s, [key]: value }))

  const errors = {}
  if (!form.date || form.date < today) errors.date = t('transfer.errors.date')
  if (!form.time) errors.time = t('transfer.errors.required')
  if (!form.first.trim()) errors.first = t('transfer.errors.required')
  if (!form.last.trim()) errors.last = t('transfer.errors.required')
  if (!PHONE_RE.test(form.phone.trim())) errors.phone = t('transfer.errors.phone')
  if (!EMAIL_RE.test(form.email.trim())) errors.email = t('transfer.errors.email')
  const err = (key) => (submitted ? errors[key] : undefined)
  const changeHref = `/transfers?to=${destination.id}&vehicle=${vehicle.id}`

  const submit = (e) => {
    e?.preventDefault()
    setSubmitted(true)
    const firstInvalid = ['date', 'time', 'first', 'last', 'phone', 'email'].find((k) => errors[k])
    if (firstInvalid) {
      formRef.current?.querySelector(`#tf-${firstInvalid}`)?.focus()
      return
    }
    const item = {
      id: `transfer-${destination.id}-${vehicle.id}-${form.date}-${form.time}`,
      name: t('transfer.bookingName', { from: PICKUP, to: destination.name, vehicle: t(`transfer.vehicles.${vehicle.id}`) }),
      kind: 'taxi',
      price,
      meta: `${f.date(form.date, { day: 'numeric', month: 'long' })} · ${form.time} · ${t('guides.book.peopleCount', { count: passengers })}`,
    }
    // Existing booking flow: signs the user in first if needed, then saves the booking.
    book(item)
    if (user) {
      try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
      navigate('/profile#bookings')
    }
  }

  const summaryRows = [
    ['vehicle', t(`transfer.vehicles.${vehicle.id}`)],
    ['pickup', PICKUP],
    ['dropoff', destination.name],
    ['date', form.date ? f.date(form.date, { weekday: 'short', day: 'numeric', month: 'short' }) : '—'],
    ['time', form.time || '—'],
    ['passengers', passengers],
  ]

  return (
    <section className="tf tf--checkout">
      <div className="container">
        <Link to={changeHref} className="tf-back"><ArrowLeft size={16} className="flip-rtl" /> {t('transfer.changeVehicle')}</Link>
        <Steps step={2} />
        <h1 className="tf-title">{t('transfer.detailsTitle')}</h1>

        <div className="tf-layout">
          <form className="tf-main" ref={formRef} onSubmit={submit} noValidate>
            <div className="tf-picked">
              <div className="tf-picked__img"><PlaceImage wiki={vehicle.wiki} alt="" width={330} /></div>
              <div className="tf-picked__info">
                <strong>{t(`transfer.vehicles.${vehicle.id}`)}</strong>
                <span className="tf-vehicle__cap">
                  <span><Users size={14} /> {vehicle.passengers}</span>
                  <span><Briefcase size={14} /> {vehicle.luggage}</span>
                </span>
              </div>
              <Price usd={price} />
              <Link to={changeHref} className="tf-link">{t('transfer.change')}</Link>
            </div>

            <fieldset className="tf-card">
              <legend>{t('transfer.trip')}</legend>
              <Route destination={destination} />
              <div className="tf-grid">
                <Field id="tf-date" label={t('transfer.date')} error={err('date')}>
                  <input id="tf-date" type="date" min={today} value={form.date} onChange={set('date')} aria-invalid={Boolean(err('date'))} />
                </Field>
                <Field id="tf-time" label={t('transfer.time')} error={err('time')}>
                  <input id="tf-time" type="time" step="900" value={form.time} onChange={set('time')} aria-invalid={Boolean(err('time'))} />
                </Field>
                <Stepper id="tf-pax" label={t('transfer.passengers')} icon={Users} value={passengers} min={1} max={vehicle.passengers} onChange={setNum('passengers')} />
                <Stepper id="tf-bags" label={t('transfer.luggage')} icon={Briefcase} value={luggage} min={0} max={vehicle.luggage} onChange={setNum('luggage')} />
              </div>
            </fieldset>

            <fieldset className="tf-card">
              <legend>{t('transfer.contact')}</legend>
              <div className="tf-grid">
                <Field id="tf-first" label={t('transfer.first')} error={err('first')}>
                  <input id="tf-first" autoComplete="given-name" value={form.first} onChange={set('first')} aria-invalid={Boolean(err('first'))} />
                </Field>
                <Field id="tf-last" label={t('transfer.last')} error={err('last')}>
                  <input id="tf-last" autoComplete="family-name" value={form.last} onChange={set('last')} aria-invalid={Boolean(err('last'))} />
                </Field>
                <Field id="tf-phone" label={t('transfer.phone')} error={err('phone')}>
                  <input id="tf-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+998 90 123 45 67" value={form.phone} onChange={set('phone')} aria-invalid={Boolean(err('phone'))} />
                </Field>
                <Field id="tf-email" label={t('transfer.email')} error={err('email')}>
                  <input id="tf-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={Boolean(err('email'))} />
                </Field>
              </div>

              {extrasOpen ? (
                <div className="tf-grid tf-extras">
                  <Field id="tf-whatsapp" label="WhatsApp" optional>
                    <input id="tf-whatsapp" type="tel" inputMode="tel" value={form.whatsapp} onChange={set('whatsapp')} />
                  </Field>
                  <Field id="tf-request" label={t('transfer.request')} optional>
                    <textarea id="tf-request" rows={3} maxLength={500} placeholder={t('transfer.requestPh')} value={form.request} onChange={set('request')} />
                  </Field>
                </div>
              ) : (
                <button type="button" className="tf-link tf-extras-toggle" onClick={() => setExtrasOpen(true)}>
                  <Plus size={15} /> {t('transfer.optional')}
                </button>
              )}
            </fieldset>

            {submitted && Object.keys(errors).length > 0 && <p className="tf-form-error" role="alert">{t('transfer.fixErrors')}</p>}
          </form>

          <aside className="tf-summary" aria-label={t('transfer.summary')}>
            <h2>{t('transfer.summary')}</h2>
            <dl>
              {summaryRows.map(([k, v]) => (
                <div key={k}><dt>{t(`transfer.${k}`)}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <div className="tf-summary__total">
              <span>{t('transfer.total')}<small>{t('transfer.perVehicle')}</small></span>
              <Price usd={price} />
            </div>
            <button type="button" className="btn btn--primary btn--block" onClick={submit}>{t('transfer.cta')}</button>
            <p className="tf-summary__note"><ShieldCheck size={15} /> {t('transfer.note')}</p>
            {!user && <p className="tf-summary__note"><Info size={15} /> {t('transfer.signInNote')}</p>}
          </aside>
        </div>
      </div>

      {/* Mobile: the summary collapses into a sticky bottom bar. */}
      <div className="tf-bar">
        <div className="tf-bar__total">
          <small>{t('transfer.total')}</small>
          <Price usd={price} />
        </div>
        <button type="button" className="btn btn--primary" onClick={submit}>{t('transfer.cta')}</button>
      </div>
    </section>
  )
}
