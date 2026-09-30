import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { googleLogout } from '@react-oauth/google'

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const USER_KEY = 'tm_user'
const SESSION_DAYS = 7

const AuthContext = createContext(null)

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function loadUser() {
  const user = readJSON(USER_KEY, null)
  if (!user || !user.expiresAt || user.expiresAt < Date.now()) {
    localStorage.removeItem(USER_KEY)
    return null
  }
  return user
}

const bookingsKey = (user) => `tm_bookings_${user.id}`

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)
  const [bookings, setBookings] = useState(() => (user ? readJSON(bookingsKey(user), []) : []))

  useEffect(() => {
    if (user) localStorage.setItem(bookingsKey(user), JSON.stringify(bookings))
  }, [user, bookings])

  // Keep several open tabs in sync (login/logout in one tab updates the others).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== USER_KEY) return
      const next = loadUser()
      setUser(next)
      setBookings(next ? readJSON(bookingsKey(next), []) : [])
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /**
   * Accepts the ID token (JWT) that Google Identity Services returns and
   * validates the claims we can check client-side before trusting it.
   */
  const loginWithGoogle = useCallback((credential) => {
    const p = jwtDecode(credential)
    const validIssuer = p.iss === 'accounts.google.com' || p.iss === 'https://accounts.google.com'
    if (!validIssuer || p.aud !== GOOGLE_CLIENT_ID || p.exp * 1000 < Date.now()) {
      throw new Error('Invalid Google token')
    }
    const next = {
      id: p.sub,
      name: p.name || p.given_name || p.email,
      givenName: p.given_name || p.name,
      email: p.email,
      emailVerified: p.email_verified,
      picture: p.picture,
      locale: p.locale,
      joinedAt: readJSON(USER_KEY, null)?.id === p.sub ? readJSON(USER_KEY, null).joinedAt : Date.now(),
      expiresAt: Date.now() + SESSION_DAYS * 864e5,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(next))
    setUser(next)
    setBookings(readJSON(bookingsKey(next), []))
    return next
  }, [])

  const logout = useCallback(() => {
    googleLogout()
    window.google?.accounts?.id?.disableAutoSelect?.()
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setBookings([])
  }, [])

  const addBooking = useCallback(
    (item) => {
      if (bookings.some((b) => b.id === item.id)) return false
      setBookings((list) => [{ ...item, bookedAt: Date.now() }, ...list.filter((b) => b.id !== item.id)])
      return true
    },
    [bookings],
  )

  const removeBooking = useCallback((id) => {
    setBookings((list) => list.filter((b) => b.id !== id))
  }, [])

  const value = useMemo(
    () => ({ user, bookings, loginWithGoogle, logout, addBooking, removeBooking }),
    [user, bookings, loginWithGoogle, logout, addBooking, removeBooking],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
