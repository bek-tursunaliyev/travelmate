// Storage for the site content document.
// On Vercel: a private Vercel Blob (BLOB_READ_WRITE_TOKEN, added when the store was connected).
// Locally without a token: a git-ignored JSON file, so `npm run dev` never touches production data.
import { get, put } from '@vercel/blob'
import { readFile, writeFile } from 'node:fs/promises'

const PATHNAME = 'content/site.json'
const LOCAL_FILE = '.content.local.json'

const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)

export async function readContent() {
  if (blobConfigured()) {
    const result = await get(PATHNAME, { access: 'private', useCache: false })
    if (!result?.stream) return null
    return JSON.parse(await new Response(result.stream).text())
  }
  if (process.env.VERCEL) return null
  try {
    return JSON.parse(await readFile(LOCAL_FILE, 'utf8'))
  } catch {
    return null
  }
}

export async function writeContent(doc) {
  const body = JSON.stringify(doc)
  if (blobConfigured()) {
    await put(PATHNAME, body, { access: 'private', contentType: 'application/json', allowOverwrite: true, addRandomSuffix: false })
    return
  }
  if (process.env.VERCEL) throw new Error('Blob storage is not configured')
  await writeFile(LOCAL_FILE, body)
}
