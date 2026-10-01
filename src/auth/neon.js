// Traveller sign-in through Neon Auth (Managed Better Auth), then a first-party session on our API.
import { createAuthClient } from '@neondatabase/neon-js/auth'

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || ''
export const authConfigured = Boolean(AUTH_URL)

let client
const authClient = () => {
  // The auth service lives on another origin, so its session cookie must be sent cross-origin.
  client ??= createAuthClient(AUTH_URL, { fetchOptions: { credentials: 'include' } })
  return client
}

// Neon returns this query parameter when Google redirects back to the site.
export const OAUTH_VERIFIER_PARAM = 'neon_auth_session_verifier'

// Error codes the UI translates (auth.errors.<code>).
export class AuthFailure extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

function failure(error) {
  if (error instanceof AuthFailure) return error
  const code = String(error?.code || error?.message || '').toUpperCase()
  if (/INVALID_EMAIL_OR_PASSWORD|INVALID_CREDENTIALS|INVALID_PASSWORD|USER_NOT_FOUND|CREDENTIAL_ACCOUNT_NOT_FOUND/.test(code) || error?.status === 401) return new AuthFailure('invalid')
  if (code.includes('ALREADY_EXISTS') || code.includes('USER_ALREADY')) return new AuthFailure('exists')
  if (code.includes('PASSWORD_TOO_SHORT') || code.includes('PASSWORD_TOO_LONG')) return new AuthFailure('weakPassword')
  if (code.includes('INVALID_EMAIL')) return new AuthFailure('badEmail')
  if (error?.status === 429) return new AuthFailure('tooMany')
  return new AuthFailure('generic')
}

// Short-lived Neon JWT for the current Neon session.
async function neonJwt() {
  let jwt = null
  const res = await authClient().getSession({
    fetchOptions: { onSuccess: (ctx) => { jwt = ctx.response.headers.get('set-auth-jwt') } },
  })
  if (!res?.data?.session) return null
  if (!jwt) {
    const t = await authClient().token()
    jwt = t?.data?.token || null
  }
  return jwt
}

// Exchange the Neon JWT for our own HttpOnly session cookie and return the user.
async function exchange() {
  const token = await neonJwt()
  if (!token) throw new AuthFailure('generic')
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!res.ok) throw new AuthFailure(res.status === 401 ? 'invalid' : 'server')
  return (await res.json()).user
}

// The SDK either returns { error } or throws, depending on the failure; normalise both.
async function attempt(run) {
  let result
  try {
    result = await run()
  } catch (err) {
    throw failure(err)
  }
  if (result?.error) throw failure(result.error)
  return result
}

export async function signInWithPassword(email, password) {
  await attempt(() => authClient().signIn.email({ email, password }))
  return exchange()
}

export async function signUpWithPassword(name, email, password) {
  await attempt(() => authClient().signUp.email({ name, email, password }))
  return exchange()
}

// Redirects to Google; the browser comes back to `returnPath` with the verifier parameter.
export async function signInWithGoogle(returnPath = '/login') {
  const origin = window.location.origin
  const result = await attempt(() => authClient().signIn.social({
    provider: 'google',
    callbackURL: `${origin}${returnPath}`,
    errorCallbackURL: `${origin}/login?oauth=error`,
  }))
  // Some SDK builds return the provider URL instead of navigating; follow it ourselves.
  const url = result?.data?.url
  if (url) window.location.assign(url)
  else throw new AuthFailure('google')
}

// Finishes a Google sign-in after the redirect back to the site.
export const completeOAuth = () => exchange().catch((err) => { throw failure(err) })

export async function fetchSessionUser() {
  const res = await fetch('/api/auth/session', { headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  return (await res.json()).user
}

export async function signOutEverywhere() {
  await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {})
  if (authConfigured) await authClient().signOut().catch(() => {})
}
