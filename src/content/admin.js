// Admin session in the browser: the token from /api/admin/login, kept for this tab only.
const TOKEN_KEY = 'tm_admin_token'

export function getAdminToken() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (!token) return null
    const { exp } = JSON.parse(atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')))
    return exp > Date.now() ? token : null
  } catch {
    return null
  }
}

export const isAdmin = () => Boolean(getAdminToken())

export function adminLogout() {
  try { sessionStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
}

// Returns true when the credentials belong to the admin.
export async function adminLogin(login, password) {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    })
    if (!res.ok) return false
    const { token } = await res.json()
    sessionStorage.setItem(TOKEN_KEY, token)
    return true
  } catch {
    return false
  }
}

export async function saveContent(doc) {
  const token = getAdminToken()
  if (!token) throw new Error('session')
  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(doc),
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    adminLogout()
    throw new Error('session')
  }
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// Uploads an image file and returns its URL (served by /api/media).
export async function uploadImage(file) {
  const token = getAdminToken()
  if (!token) throw new Error('session')
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream', Authorization: `Bearer ${token}` },
    body: file,
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    adminLogout()
    throw new Error('session')
  }
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data.url
}
