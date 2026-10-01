import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GoogleLogin } from '@react-oauth/google'
import { FaCheckCircle, FaLock, FaInfoCircle, FaArrowLeft } from 'react-icons/fa'
import Logo from '../components/Logo'
import { GOOGLE_CLIENT_ID, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function useButtonWidth() {
  const calc = () => Math.min(360, Math.max(220, window.innerWidth - 80))
  const [w, setW] = useState(calc)
  useEffect(() => {
    const onResize = () => setW(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Fallback sign-in used only when Google Sign-In is unavailable.
function DemoLogin({ onDone }) {
  const { t } = useTranslation()
  const { loginDemo } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const nameOk = name.trim().length >= 2
  const emailOk = EMAIL_RE.test(email.trim())

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (nameOk && emailOk) onDone(loginDemo({ name, email }))
  }

  return (
    <form className="auth__demo" onSubmit={submit} noValidate>
      <label>
        <span>{t('auth.demoName')}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={touched && !nameOk} />
      </label>
      <label>
        <span>{t('auth.demoEmail')}</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={touched && !emailOk} />
      </label>
      {touched && (!nameOk || !emailOk) && <p className="auth__demo-error">{t('auth.demoInvalid')}</p>}
      <button type="submit" className="btn btn--primary btn--block">{t('auth.demoSubmit')}</button>
      <p className="auth__demo-note"><FaInfoCircle /> {t('auth.demoNote')}</p>
    </form>
  )
}

export default function AuthPage({ mode = 'login' }) {
  const { t, i18n } = useTranslation()
  const { user, loginWithGoogle } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const width = useButtonWidth()
  const from = location.state?.from || '/'
  const isLogin = mode === 'login'
  const [googleFailed, setGoogleFailed] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const showDemo = !GOOGLE_CLIENT_ID || googleFailed || demoOpen

  if (user) return <Navigate to={from} replace />

  const finish = (u) => {
    toast(t('auth.welcome', { name: u.givenName }))
    navigate(from, { replace: true })
  }

  const onSuccess = ({ credential }) => {
    try {
      finish(loginWithGoogle(credential))
    } catch {
      setGoogleFailed(true)
      toast(t('auth.failed'), 'error')
    }
  }

  return (
    <div className="auth">
      <aside className="auth__visual">
        <div className="auth__visual-inner">
          <Logo light />
          <h2>{t('app.title')}</h2>
          <ul>
            {t('auth.perks', { returnObjects: true }).map((perk) => (
              <li key={perk}><FaCheckCircle /> {perk}</li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="auth__panel">
        <Link to="/" className="auth__home"><FaArrowLeft className="flip-rtl" /> {t('common.home')}</Link>
        <div className="auth__card">
          <div className="auth__logo"><Logo /></div>
          <h1>{isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}</h1>
          <p className="muted">{isLogin ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}</p>

          {GOOGLE_CLIENT_ID && (
            <div className="auth__google">
              <GoogleLogin
                key={`${i18n.resolvedLanguage}-${mode}`}
                onSuccess={onSuccess}
                onError={() => { setGoogleFailed(true); toast(t('auth.failed'), 'error') }}
                text={isLogin ? 'signin_with' : 'signup_with'}
                shape="pill"
                size="large"
                theme="outline"
                logo_alignment="center"
                width={width}
                locale={i18n.resolvedLanguage}
                context={isLogin ? 'signin' : 'signup'}
              />
            </div>
          )}

          {showDemo ? (
            <>
              {GOOGLE_CLIENT_ID ? <div className="auth__or"><span>{t('auth.or')}</span></div> : <p className="auth__demo-intro">{t('auth.demoUnavailable')}</p>}
              <DemoLogin onDone={finish} />
            </>
          ) : (
            <button className="auth__demo-toggle" onClick={() => setDemoOpen(true)}>{t('auth.demoToggle')}</button>
          )}

          <p className="auth__secure"><FaLock /> {t('auth.secure')}</p>

          <p className="auth__switch">
            {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
            <Link to={isLogin ? '/signup' : '/login'} state={location.state}>
              {isLogin ? t('nav.signup') : t('nav.login')}
            </Link>
          </p>
          <p className="auth__terms">{t('auth.agree')}</p>
        </div>
      </main>
    </div>
  )
}
