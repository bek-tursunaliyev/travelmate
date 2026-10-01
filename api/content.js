// GET /api/content → { content } (null until the admin saves for the first time).
// PUT /api/content with an admin token → stores the whole document.
import { readContent, writeContent } from './_lib/store.js'
import { verifyRequest } from './_lib/auth.js'

const MAX_BYTES = 2_000_000
const REQUIRED_ARRAYS = ['heroSlides', 'stats', 'tours', 'operators', 'guides', 'venues', 'esimPlans', 'esimOperators']

export async function GET() {
  try {
    const content = await readContent()
    return Response.json({ content }, {
      // Short CDN cache; visitors pick up admin changes within ~30 s.
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=300' },
    })
  } catch {
    return Response.json({ content: null, error: 'Storage unavailable' }, { status: 200 })
  }
}

export async function PUT(request) {
  if (!verifyRequest(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const raw = await request.text()
  if (raw.length > MAX_BYTES) return Response.json({ error: 'Content too large' }, { status: 413 })
  let doc
  try {
    doc = JSON.parse(raw)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const bad = !doc || typeof doc !== 'object' || Array.isArray(doc)
    || REQUIRED_ARRAYS.some((k) => !Array.isArray(doc[k]))
    || typeof doc.places !== 'object' || typeof doc.tickets !== 'object' || typeof doc.offers !== 'object'
  if (bad) return Response.json({ error: 'Content shape is invalid' }, { status: 422 })

  doc.updatedAt = new Date().toISOString()
  try {
    await writeContent(doc)
  } catch (err) {
    return Response.json({ error: err.message || 'Could not save' }, { status: 500 })
  }
  return Response.json({ ok: true, updatedAt: doc.updatedAt })
}
