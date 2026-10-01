// POST /api/admin/login { login, password } → { token } for the admin, 401 otherwise.
import { adminConfigured, checkCredentials, createToken } from '../_lib/auth.js'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (adminConfigured() && checkCredentials(body?.login, body?.password)) {
    return Response.json({ token: createToken() })
  }
  // Slow down guessing a little.
  await new Promise((r) => setTimeout(r, 400))
  return Response.json({ error: 'Not an admin' }, { status: 401 })
}
