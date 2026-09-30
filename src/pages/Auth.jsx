import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GoogleLogin } from '@react-oauth/google'
import { FaCheckCircle, FaLock, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'
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

export default function AuthPage({ mode = 'login' }) {
  const { t, i18n } = useTranslation()
  const { user, loginWithGoogle } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const width = useButtonWidth()
  const from = location.state?.from || '/'
  const isLogin = mode === 'login'

  if (user) return <Navigate to={from} replace />

  const onSuccess = ({ credential }) => {
    try {
      const u = loginWithGoogle(credential)
      toast(t('auth.welcome', { name: u.givenName }))
      navigate(from, { replace: true })
    } catch {
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

          {GOOGLE_CLIENT_ID ? (
            <div className="auth__google">
              <GoogleLogin
                key={`${i18n.resolvedLanguage}-${mode}`}
                onSuccess={onSuccess}
                onError={() => toast(t('auth.failed'), 'error')}
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
          ) : (
            <div className="auth__warning" role="alert">
              <FaExclamationTriangle />
              <div>
                <strong>Google Client ID is not configured</strong>
                <p>
                  Create <code>.env</code> in the project root with <code>VITE_GOOGLE_CLIENT_ID=…</code> and restart
                  <code>npm run dev</code>. See README.md for step-by-step setup.
                </p>
              </div>
            </div>
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
