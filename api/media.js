// GET /api/media?name=<file> → an image uploaded in the admin panel (see api/upload.js).
import { readFile } from 'node:fs/promises'
import { get } from '@vercel/blob'

const NAME = /^[a-f0-9]{24}\.(png|jpg|webp|gif)$/
const TYPES = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }

export async function GET(request) {
  const name = new URL(request.url).searchParams.get('name') || ''
  if (!NAME.test(name)) return new Response('Not found', { status: 404 })
  const headers = {
    'Content-Type': TYPES[name.split('.').pop()],
    // File names are random and never reused, so the image can be cached for good.
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  }
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
      const result = await get(`media/${name}`, { access: 'private' })
      if (!result?.stream) return new Response('Not found', { status: 404 })
      return new Response(result.stream, { headers })
    }
    if (process.env.VERCEL) return new Response('Not found', { status: 404 })
    return new Response(await readFile(`.uploads/${name}`), { headers })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
