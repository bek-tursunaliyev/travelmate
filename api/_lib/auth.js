// Admin sign-in: credentials live only in server env vars (ADMIN_LOGIN, ADMIN_PASSWORD).
// A successful login returns a short-lived HMAC-signed token for the content API.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_HOURS = 12

const digest = (value) => createHash('sha256').update(String(value)).digest()
const sameText = (a, b) => timingSafeEqual(digest(a), digest(b))
const secret = () => process.env.ADMIN_SECRET || `${process.env.ADMIN_LOGIN}:${process.env.ADMIN_PASSWORD}`
const sign = (payload) => createHmac('sha256', secret()).update(payload).digest('base64url')

export const adminConfigured = () => Boolean(process.env.ADMIN_LOGIN && process.env.ADMIN_PASSWORD)

export function checkCredentials(login, password) {
  if (!adminConfigured() || typeof login !== 'string' || typeof password !== 'string') return false
  // Evaluate both comparisons so timing does not reveal which part was wrong.
  const loginOk = sameText(login.trim().toLowerCase(), process.env.ADMIN_LOGIN.trim().toLowerCase())
  const passwordOk = sameText(password, process.env.ADMIN_PASSWORD)
  return loginOk && passwordOk
}

export function createToken() {
  const payload = Buffer.from(JSON.stringify({ sub: 'admin', exp: Date.now() + TOKEN_HOURS * 36e5 })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyRequest(request) {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const [payload, signature] = token.split('.')
  if (!payload || !signature || !adminConfigured()) return false
  const expected = sign(payload)
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false
  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return sub === 'admin' && exp > Date.now()
  } catch {
    return false
  }
}
