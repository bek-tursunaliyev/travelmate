import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaCheckCircle, FaLock, FaArrowLeft, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { adminLogin } from '../content/admin'
import { authConfigured, OAUTH_VERIFIER_PARAM } from '../auth/neon'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RETURN_KEY = 'tm_auth_return' // where to go after the Google round trip
const MIN_PASSWORD = 8

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

export default function AuthPage({ mode = 'login' }) {
  const { t } = useTranslation()
  const { user, checked, login, signup, loginWithGoogle, finishGoogle } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const isLogin = mode === 'login'
  const from = location.state?.from || '/'
  const params = new URLSearchParams(location.search)
  const returning = params.has(OAUTH_VERIFIER_PARAM)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [toGoogle, setToGoogle] = useState(false)
  const [completing, setCompleting] = useState(returning)
  const [error, setError] = useState(params.get('oauth') === 'error' ? 'google' : '')
  const finished = useRef(false)

  const go = (path) => navigate(path === '/admin' ? '/' : path, { replace: true })

  // Back from Google: turn the Neon session into our own and continue where the user was.
  useEffect(() => {
    if (!returning || finished.current) return
    finished.current = true
    let target = '/'
    try { target = sessionStorage.getItem(RETURN_KEY) || '/'; sessionStorage.removeItem(RETURN_KEY) } catch { /* ignore */ }
    finishGoogle()
      .then((u) => {
        toast(t('auth.welcome', { name: u.givenName }))
        navigate(target === '/admin' ? '/' : target, { replace: true })
      })
      .catch(() => {
        setCompleting(false)
        setError('google')
        navigate(location.pathname, { replace: true })
      })
  }, [returning]) // eslint-disable-line react-hooks/exhaustive-deps

  // Signed-in travellers don't need this page (except to sign in as admin). Wait for the server to
  // confirm the session so a stale local hint never bounces a signed-out visitor away.
  if (user && checked && !completing && from !== '/admin') return <Navigate to={from} replace />

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))
  const login_ = form.email.trim()
  const isAdminLogin = isLogin && login_ && !login_.includes('@')
  const emailOk = isAdminLogin || EMAIL_RE.test(login_)
  const passwordOk = isLogin ? form.password.length > 0 : form.password.length >= MIN_PASSWORD
  const nameOk = isLogin || form.name.trim().length >= 2
  const valid = emailOk && passwordOk && nameOk

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    setError('')
    if (!valid || busy) return
    setBusy(true)
    try {
      if (isAdminLogin) {
        if (!(await adminLogin(login_, form.password))) throw Object.assign(new Error('invalid'), { code: 'invalid' })
        toast(t('auth.adminWelcome'))
        navigate('/admin', { replace: true })
        return
      }
      if (!authConfigured) throw Object.assign(new Error('notConfigured'), { code: 'notConfigured' })
      const u = isLogin ? await login(login_, form.password) : await signup(form.name.trim(), login_, form.password)
      toast(t('auth.welcome', { name: u.givenName }))
      go(from)
    } catch (err) {
      // Only known codes have messages; anything else is shown as a generic failure.
      setError(['invalid', 'exists', 'weakPassword', 'badEmail', 'tooMany', 'server', 'notConfigured', 'google'].includes(err.code) ? err.code : 'generic')
      setForm((s) => ({ ...s, password: '' }))
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    setError('')
    if (!authConfigured) return setError('notConfigured')
    setBusy(true)
    setToGoogle(true)
    try { sessionStorage.setItem(RETURN_KEY, from) } catch { /* ignore */ }
    try {
      await loginWithGoogle(isLogin ? '/login' : '/signup')
    } catch {
      setBusy(false)
      setToGoogle(false)
      setError('google')
    }
  }

  if (completing) {
    return (
      <div className="auth auth--busy">
        <div className="auth__completing" role="status">
          <span className="auth__spinner" />
          <p>{t('auth.completing')}</p>
        </div>
      </div>
    )
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

          <button type="button" className="auth__google-btn" onClick={google} disabled={busy}>
            {toGoogle ? <span className="auth__spinner auth__spinner--sm" /> : <GoogleMark />}
            {toGoogle ? t('auth.toGoogle') : isLogin ? t('auth.googleSignIn') : t('auth.googleSignUp')}
          </button>

          <div className="auth__or"><span>{t('auth.or')}</span></div>

          <form className="auth__form" onSubmit={submit} noValidate>
            {!isLogin && (
              <label>
                <span>{t('auth.name')}</span>
                <input value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={touched && !nameOk} />
              </label>
            )}
            <label>
              <span>{isLogin ? t('auth.emailOrLogin') : t('auth.email')}</span>
              <input
                type={isLogin ? 'text' : 'email'}
                inputMode="email"
                value={form.email}
                onChange={set('email')}
                autoComplete={isLogin ? 'username' : 'email'}
                aria-invalid={touched && !emailOk}
              />
            </label>
            <label>
              <span>{t('auth.password')}</span>
              <span className="auth__password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  aria-invalid={touched && !passwordOk}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
              {!isLogin && <small className="auth__hint">{t('auth.passwordHint', { count: MIN_PASSWORD })}</small>}
            </label>

            {touched && !valid && !error && <p className="auth__error" role="alert"><FaExclamationCircle /> {t('auth.fixFields')}</p>}
            {error && <p className="auth__error" role="alert"><FaExclamationCircle /> {t(`auth.errors.${error}`)}</p>}

            <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
              {busy ? t('common.loading') : isLogin ? t('nav.login') : t('nav.signup')}
            </button>
          </form>

          <p className="auth__secure"><FaLock /> {t('auth.secureServer')}</p>

          <p className="auth__switch">
            {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
            <Link to={isLogin ? '/signup' : '/login'} state={location.state}>
              {isLogin ? t('nav.signup') : t('nav.login')}
            </Link>
          </p>
          <p className="auth__terms">
            {t('auth.agree')}{' '}
            <Link to="/legal/terms">{t('footer.terms')}</Link> · <Link to="/legal/privacy">{t('footer.privacy')}</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
