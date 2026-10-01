// Bookings of the signed-in traveller, stored in Postgres.
// GET → { bookings } · POST { id, name, kind, price, meta } · DELETE ?id=…
import { readSession } from './_lib/session.js'
import { ensureSchema, sql } from './_lib/db.js'

const unauthorized = () => Response.json({ error: 'Sign in required' }, { status: 401 })
const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const toClient = (r) => ({
  id: r.id, name: r.name, kind: r.kind, price: r.price == null ? null : Number(r.price), meta: r.meta, bookedAt: new Date(r.booked_at).getTime(),
})

export async function GET(request) {
  const user = readSession(request)
  if (!user) return unauthorized()
  await ensureSchema()
  const rows = await sql`SELECT * FROM bookings WHERE user_id = ${user.id} ORDER BY booked_at DESC LIMIT 500`
  return Response.json({ bookings: rows.map(toClient) }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request) {
  const user = readSession(request)
  if (!user) return unauthorized()
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const id = text(body?.id, 160)
  const name = text(body?.name, 200)
  if (!id || !name) return Response.json({ error: 'id and name are required' }, { status: 422 })
  const price = Number(body?.price)
  await ensureSchema()
  const rows = await sql`
    INSERT INTO bookings (user_id, id, name, kind, price, meta)
    VALUES (${user.id}, ${id}, ${name}, ${text(body?.kind, 40) || null}, ${Number.isFinite(price) ? price : null}, ${text(body?.meta, 300) || null})
    ON CONFLICT (user_id, id) DO NOTHING
    RETURNING *`
  if (!rows.length) return Response.json({ error: 'Already booked', duplicate: true }, { status: 409 })
  return Response.json({ booking: toClient(rows[0]) }, { status: 201 })
}

export async function DELETE(request) {
  const user = readSession(request)
  if (!user) return unauthorized()
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return Response.json({ error: 'id is required' }, { status: 422 })
  await ensureSchema()
  await sql`DELETE FROM bookings WHERE user_id = ${user.id} AND id = ${id}`
  return Response.json({ ok: true })
}
