import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GoogleLogin } from '@react-oauth/google'
import { FaCheckCircle, FaLock, FaInfoCircle, FaArrowLeft } from 'react-icons/fa'
import Logo from '../components/Logo'
import { GOOGLE_CLIENT_ID, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { adminLogin } from '../content/admin'

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

// Login + password form. The admin's credentials open the admin panel (checked on the server);
// any other login signs in as a regular traveller account kept in this browser.
function PasswordLogin({ onDone }) {
  const { t } = useTranslation()
  const { loginDemo } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const loginOk = login.trim().length >= 3
  const passwordOk = password.length >= 4

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!loginOk || !passwordOk || busy) return
    setBusy(true)
    const admin = await adminLogin(login.trim(), password)
    setBusy(false)
    if (admin) {
      toast(t('auth.adminWelcome'))
      navigate('/admin', { replace: true })
      return
    }
    const value = login.trim()
    const email = EMAIL_RE.test(value) ? value : `${value.replace(/\s+/g, '.').toLowerCase()}@travelmate.uz`
    const raw = value.split('@')[0].replace(/[._-]+/g, ' ')
    const name = raw.replace(/\b\w/g, (c) => c.toUpperCase())
    onDone(loginDemo({ name, email }))
  }

  return (
    <form className="auth__demo" onSubmit={submit} noValidate>
      <label>
        <span>{t('auth.login')}</span>
        <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" aria-invalid={touched && !loginOk} />
      </label>
      <label>
        <span>{t('auth.password')}</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" aria-invalid={touched && !passwordOk} />
      </label>
      {touched && (!loginOk || !passwordOk) && <p className="auth__demo-error">{t('auth.loginInvalid')}</p>}
      <button type="submit" className="btn btn--primary btn--block" disabled={busy}>{busy ? t('common.loading') : t('auth.demoSubmit')}</button>
      <p className="auth__demo-note"><FaInfoCircle /> {t('auth.loginNote')}</p>
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

  // A signed-in traveller can still open the form to sign in as admin.
  if (user && from !== '/admin') return <Navigate to={from} replace />

  const finish = (u) => {
    toast(t('auth.welcome', { name: u.givenName }))
    // Travellers who came from the admin link land on the home page instead.
    navigate(from === '/admin' ? '/' : from, { replace: true })
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
              <PasswordLogin onDone={finish} />
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
