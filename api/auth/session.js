// GET    /api/auth/session → { user } for the signed-in traveller (or { user: null })
// POST   /api/auth/session { token } → exchanges a Neon Auth JWT for our session cookie
// DELETE /api/auth/session → signs out
import { clearSessionCookie, createSessionCookie, readSession, verifyNeonToken } from '../_lib/session.js'
import { sql } from '../_lib/db.js'

const publicUser = ({ id, name, email, image, provider }) => ({ id, name, email, image, provider })

export async function GET(request) {
  const user = readSession(request)
  return Response.json({ user: user ? publicUser(user) : null }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const claims = await verifyNeonToken(body?.token)
  if (!claims) return Response.json({ error: 'Invalid or expired sign-in' }, { status: 401 })

  // How the account signs in (google / credential), straight from Neon Auth's tables.
  let provider = 'credential'
  try {
    const rows = await sql`SELECT "providerId" FROM neon_auth.account WHERE "userId" = ${claims.sub} ORDER BY "createdAt" DESC LIMIT 1`
    provider = rows[0]?.providerId || provider
  } catch { /* display only */ }

  const user = {
    id: claims.sub,
    name: String(claims.name || claims.email || 'Traveller').slice(0, 120),
    email: String(claims.email || '').slice(0, 200),
    image: typeof claims.image === 'string' ? claims.image.slice(0, 500) : null,
    provider,
  }
  return Response.json({ user: publicUser(user) }, {
    headers: { 'Set-Cookie': createSessionCookie(user, request), 'Cache-Control': 'no-store' },
  })
}

export async function DELETE(request) {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie(request), 'Cache-Control': 'no-store' } })
}
