// GET    /api/auth/session → { user } for the signed-in traveller (or { user: null })
// POST   /api/auth/session { token, sessionToken } → exchanges a Neon Auth session for our session cookie
// DELETE /api/auth/session → signs out
import { clearSessionCookie, createSessionCookie, readSession, verifyNeonToken } from '../_lib/session.js'
import { sql } from '../_lib/db.js'

const publicUser = ({ id, name, email, image, provider }) => ({ id, name, email, image, provider })

export async function GET(request) {
  const user = readSession(request)
  if (user && !user.image) {
    // Sessions created before photos were stored: pick up the Google picture from Neon Auth.
    try {
      const [row] = await sql`SELECT image FROM neon_auth.user WHERE id = ${user.id}`
      if (row?.image) user.image = row.image
    } catch { /* show initials */ }
  }
  return Response.json({ user: user ? publicUser(user) : null }, { headers: { 'Cache-Control': 'no-store' } })
}

// The signed-in Neon Auth user: from the short-lived JWT, or else from the session token itself
// (looked up in Neon Auth's own tables, so sign-in never depends on third-party cookies).
async function neonUser({ token, sessionToken }) {
  const claims = await verifyNeonToken(token)
  let userId = claims?.sub || null
  if (!userId && typeof sessionToken === 'string' && sessionToken.length <= 500) {
    const rows = await sql`SELECT "userId" FROM neon_auth.session WHERE token = ${sessionToken} AND "expiresAt" > now() LIMIT 1`
    userId = rows[0]?.userId || null
  }
  if (!userId) return null
  const [row] = await sql`
    SELECT u.id, u.name, u.email, u.image, u.banned,
      (SELECT "providerId" FROM neon_auth.account a WHERE a."userId" = u.id ORDER BY (a."providerId" = 'google') DESC, a."createdAt" DESC LIMIT 1) AS provider
    FROM neon_auth.user u WHERE u.id = ${userId}`
  if (row?.banned) return null
  // Name and photo come from the database: the Google profile picture is stored there.
  const name = row?.name || claims?.name || row?.email || claims?.email || 'Traveller'
  const image = row?.image || (typeof claims?.image === 'string' ? claims.image : null)
  return {
    id: String(userId),
    name: String(name).slice(0, 120),
    email: String(row?.email || claims?.email || '').slice(0, 200),
    image: image ? String(image).slice(0, 500) : null,
    provider: row?.provider || 'credential',
  }
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  let user
  try {
    user = await neonUser(body || {})
  } catch {
    return Response.json({ error: 'Sign-in service unavailable' }, { status: 503 })
  }
  if (!user) return Response.json({ error: 'Invalid or expired sign-in' }, { status: 401 })
  return Response.json({ user: publicUser(user) }, {
    headers: { 'Set-Cookie': createSessionCookie(user, request), 'Cache-Control': 'no-store' },
  })
}

export async function DELETE(request) {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie(request), 'Cache-Control': 'no-store' } })
}
