import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from './ToastContext'
import {
  completeOAuth, fetchSessionUser, signInWithGoogle, signInWithPassword, signOutEverywhere, signUpWithPassword,
} from '../auth/neon'

// Travellers sign in with Neon Auth (email + password or Google); the server keeps the session in an
// HttpOnly cookie and stores bookings in Postgres. See src/auth/neon.js and api/auth, api/bookings.

const AuthContext = createContext(null)
const HINT_KEY = 'tm_signed_in' // only a UI hint so the header doesn't flash "Log in"; not a credential

// Round avatar with the user's initials, as a data URL (accounts without a Google photo).
function initialsAvatar(name) {
  const letters = String(name || '?').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="#0a717b"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Marcellus,Georgia,serif" font-size="38" fill="#fff">${letters}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const shapeUser = (u) => (u ? {
  ...u,
  givenName: String(u.name || u.email || '').split(/\s+/)[0],
  picture: u.image || initialsAvatar(u.name || u.email),
} : null)

const readHint = () => {
  try { return JSON.parse(localStorage.getItem(HINT_KEY)) } catch { return null }
}
const writeHint = (u) => {
  try {
    if (u) localStorage.setItem(HINT_KEY, JSON.stringify(u))
    else localStorage.removeItem(HINT_KEY)
  } catch { /* ignore */ }
}

async function api(path, options = {}) {
  const res = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

export function AuthProvider({ children }) {
  const { t } = useTranslation()
  const toast = useToast()
  // Start from the last known user so the header renders instantly; the server confirms below.
  const [user, setUser] = useState(() => shapeUser(readHint()))
  const [checked, setChecked] = useState(false)
  const [bookings, setBookings] = useState([])

  const adopt = useCallback((u) => {
    const shaped = shapeUser(u)
    writeHint(u || null)
    setUser(shaped)
    return shaped
  }, [])

  // Confirm the session with the server on load.
  useEffect(() => {
    let alive = true
    fetchSessionUser()
      .then((u) => { if (alive) adopt(u) })
      .catch(() => {})
      .finally(() => alive && setChecked(true))
    return () => { alive = false }
  }, [adopt])

  // Bookings live on the server, per user.
  useEffect(() => {
    if (!user) return undefined
    let alive = true
    api('/api/bookings').then(({ ok, status, data }) => {
      if (!alive) return
      if (ok) setBookings(data.bookings || [])
      else if (status === 401) adopt(null)
    })
    return () => { alive = false }
  }, [user?.id, adopt]) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => adopt(await signInWithPassword(email, password)), [adopt])
  const signup = useCallback(async (name, email, password) => adopt(await signUpWithPassword(name, email, password)), [adopt])
  const loginWithGoogle = useCallback((returnPath) => signInWithGoogle(returnPath), [])
  const finishGoogle = useCallback(async () => adopt(await completeOAuth()), [adopt])

  const logout = useCallback(() => {
    adopt(null)
    setBookings([])
    signOutEverywhere()
  }, [adopt])

  // Returns false for a duplicate (synchronously, as the booking buttons expect); saves in the background.
  const addBooking = useCallback(
    (item) => {
      if (bookings.some((b) => b.id === item.id)) return false
      const optimistic = { ...item, bookedAt: Date.now() }
      setBookings((list) => [optimistic, ...list])
      api('/api/bookings', { method: 'POST', body: JSON.stringify(item) }).then(({ ok, status, data }) => {
        if (ok) {
          setBookings((list) => list.map((b) => (b.id === item.id ? data.booking : b)))
          return
        }
        if (status === 409) return
        setBookings((list) => list.filter((b) => b.id !== item.id))
        if (status === 401) adopt(null)
        toast(t('auth.errors.server'), 'error')
      })
      return true
    },
    [bookings, adopt, toast, t],
  )

  const removeBooking = useCallback((id) => {
    let removed
    setBookings((list) => {
      removed = list.find((b) => b.id === id)
      return list.filter((b) => b.id !== id)
    })
    api(`/api/bookings?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).then(({ ok }) => {
      if (!ok && removed) {
        setBookings((list) => [removed, ...list])
        toast(t('auth.errors.server'), 'error')
      }
    })
  }, [toast, t])

  const value = useMemo(
    // Bookings of a signed-out visitor are never shown, even for a moment.
    () => ({ user, checked, bookings: user ? bookings : [], login, signup, loginWithGoogle, finishGoogle, logout, addBooking, removeBooking }),
    [user, checked, bookings, login, signup, loginWithGoogle, finishGoogle, logout, addBooking, removeBooking],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
