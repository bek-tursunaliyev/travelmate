// Traveller sessions.
// Sign-in happens on Neon Auth (Managed Better Auth). The browser sends us the short-lived Neon JWT,
// we verify it against Neon's JWKS and issue our own first-party HttpOnly cookie, so the site never
// depends on third-party cookies from the auth domain after sign-in.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { createRemoteJWKSet, jwtVerify } from 'jose'

const COOKIE = 'tm_session'
const MAX_AGE_DAYS = 30

let jwks
function neonJwks() {
  const base = process.env.NEON_AUTH_BASE_URL
  if (!base) throw new Error('NEON_AUTH_BASE_URL is not configured')
  jwks ??= createRemoteJWKSet(new URL(`${base}/.well-known/jwks.json`))
  return { jwks, issuer: new URL(base).origin }
}

// Returns the verified JWT claims, or null.
export async function verifyNeonToken(token) {
  if (typeof token !== 'string' || token.length > 4000) return null
  try {
    const { jwks: keys, issuer } = neonJwks()
    const { payload } = await jwtVerify(token, keys, { issuer, audience: issuer })
    return payload.sub && !payload.banned ? payload : null
  } catch {
    return null
  }
}

const secret = () => {
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is not configured')
  return process.env.SESSION_SECRET
}
const sign = (payload) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function createSessionCookie(user, request) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + MAX_AGE_DAYS * 864e5 })).toString('base64url')
  return cookie(`${payload}.${sign(payload)}`, MAX_AGE_DAYS * 86400, request)
}

export const clearSessionCookie = (request) => cookie('', 0, request)

function cookie(value, maxAge, request) {
  // `Secure` everywhere except plain-http localhost during development.
  const secure = new URL(request.url).protocol === 'https:' || process.env.VERCEL ? '; Secure' : ''
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

// The signed-in traveller for this request, or null.
export function readSession(request) {
  const raw = (request.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))
  const value = raw?.slice(COOKIE.length + 1)
  const [payload, signature] = (value || '').split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.exp > Date.now() ? data : null
  } catch {
    return null
  }
}
