// Traveller sign-in through Neon Auth (Managed Better Auth), then a first-party session on our API.
const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || ''
export const authConfigured = Boolean(AUTH_URL)

// The Neon SDK is only downloaded when someone actually signs in (keeps it out of the main bundle).
let client
const authClient = async () => {
  if (!client) {
    const { createAuthClient } = await import('@neondatabase/neon-js/auth')
    // The auth service lives on another origin, so its session cookie must be sent cross-origin.
    client = createAuthClient(AUTH_URL, { fetchOptions: { credentials: 'include' } })
  }
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
  // The SDK puts the server code in different places depending on the call; check them all.
  const code = [error?.code, error?.message, error?.error?.code, error?.error?.message, error?.statusText].filter(Boolean).join(' ').toUpperCase()
  if (/INVALID_EMAIL_OR_PASSWORD|INVALID_CREDENTIALS|INVALID_PASSWORD|USER_NOT_FOUND|CREDENTIAL_ACCOUNT_NOT_FOUND/.test(code) || error?.status === 401) return new AuthFailure('invalid')
  if (/ALREADY[ _]EXISTS|USER[ _]ALREADY/.test(code)) return new AuthFailure('exists')
  if (code.includes('PASSWORD_TOO_SHORT') || code.includes('PASSWORD_TOO_LONG')) return new AuthFailure('weakPassword')
  if (code.includes('INVALID_EMAIL')) return new AuthFailure('badEmail')
  if (error?.status === 429) return new AuthFailure('tooMany')
  // The site's domain is missing from Neon Auth → Domains, so Neon refuses to redirect back here.
  if (code.includes('INVALID_CALLBACKURL') || code.includes('INVALID_ORIGIN')) {
    console.error(`Google sign-in: add ${window.location.origin} to Neon Auth trusted domains.`)
    return new AuthFailure('google')
  }
  return new AuthFailure('generic')
}

// Proof of the current Neon session for our server: the short-lived JWT when the browser can read it,
// plus the session token (the server checks it against Neon Auth's tables when the JWT is missing).
async function neonProof() {
  let jwt = null
  const auth = await authClient()
  const res = await auth.getSession({
    fetchOptions: { onSuccess: (ctx) => { jwt = ctx.response.headers.get('set-auth-jwt') } },
  })
  const session = res?.data?.session
  if (!session) return null
  if (!jwt) {
    const t = await auth.token().catch(() => null)
    jwt = t?.data?.token || null
  }
  return { token: jwt, sessionToken: session.token || null }
}

// Exchange the Neon session for our own HttpOnly session cookie and return the user.
async function exchange() {
  const proof = await neonProof()
  if (!proof || (!proof.token && !proof.sessionToken)) throw new AuthFailure('google')
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proof),
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

// A fresh sign-in or sign-up never reuses a Neon session left over in this page.
async function freshClient() {
  if (client) await client.signOut().catch(() => {})
  return authClient()
}

export async function signInWithPassword(email, password) {
  const auth = await freshClient()
  await attempt(() => auth.signIn.email({ email, password }))
  return exchange()
}

export async function signUpWithPassword(name, email, password) {
  const auth = await freshClient()
  await attempt(() => auth.signUp.email({ name, email, password }))
  return exchange()
}

// Redirects to Google; the browser comes back to `returnPath` with the verifier parameter.
export async function signInWithGoogle(returnPath = '/login') {
  const origin = window.location.origin
  const auth = await authClient()
  const result = await attempt(() => auth.signIn.social({
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
  if (client) await client.signOut().catch(() => {})
}
