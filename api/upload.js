// POST /api/upload (admin token) with the image as the request body → { url }
// Images go to the private Blob store under media/ and are served by /api/media/<name>.
// Locally without a Blob token they are written to .uploads/ (git-ignored).
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { put } from '@vercel/blob'
import { verifyRequest } from './_lib/auth.js'

const MAX_BYTES = 4_000_000 // Vercel Functions accept bodies up to 4.5 MB
// No SVG: it can carry scripts and would be served from our own origin.
const TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }

export async function POST(request) {
  if (!verifyRequest(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const type = (request.headers.get('content-type') || '').split(';')[0].trim()
  const ext = TYPES[type]
  if (!ext) return Response.json({ error: 'Use a PNG, JPG, WebP or GIF image' }, { status: 415 })
  const body = Buffer.from(await request.arrayBuffer())
  if (!body.length) return Response.json({ error: 'Empty file' }, { status: 400 })
  if (body.length > MAX_BYTES) return Response.json({ error: 'The image must be under 4 MB' }, { status: 413 })

  const name = `${randomBytes(12).toString('hex')}.${ext}`
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
      await put(`media/${name}`, body, { access: 'private', contentType: type, addRandomSuffix: false })
    } else if (!process.env.VERCEL) {
      await mkdir('.uploads', { recursive: true })
      await writeFile(`.uploads/${name}`, body)
    } else {
      throw new Error('Blob storage is not configured')
    }
  } catch (err) {
    return Response.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
  return Response.json({ url: `/api/media?name=${name}` })
}
