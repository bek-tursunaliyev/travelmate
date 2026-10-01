import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Serves /api/* in `vite dev` with the same handlers Vercel runs in production:
// /api/admin/login → api/admin/login.js, calling its exported GET/POST/PUT function.
function apiDevServer() {
  return {
    name: 'travelmate-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const route = (req.url || '').split('?')[0].replace(/^\/+|\/+$/g, '')
        if (!/^[\w/-]+$/.test(route) || route.startsWith('_')) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${route}.js`)
          const handler = mod[req.method]
          if (!handler) {
            res.statusCode = 405
            return res.end(JSON.stringify({ error: 'Method not allowed' }))
          }
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
          })
          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => { if (key !== 'set-cookie') res.setHeader(key, value) })
          const cookies = response.headers.getSetCookie?.() || []
          if (cookies.length) res.setHeader('Set-Cookie', cookies)
          if (!response.headers.get('content-type')) res.setHeader('Content-Type', 'application/json')
          res.end(await response.text())
        } catch (err) {
          if (/Failed to load url|does not exist/i.test(err.message)) return next()
          server.config.logger.error(`[api/${route}] ${err.message}`)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal error' }))
        }
      })
    },
  }
}

const SERVER_ENV = [
  'GEMINI_API_KEY', 'GEMINI_MODEL', 'AI_GATEWAY_API_KEY', 'AI_MODEL', 'ADMIN_LOGIN', 'ADMIN_PASSWORD', 'ADMIN_SECRET',
  'ITICKET_API_URL', 'ITICKET_API_KEY', 'DATABASE_URL', 'NEON_AUTH_BASE_URL', 'SESSION_SECRET',
]

// Google Sign-In only works from origins registered in Google Cloud Console,
// so the dev server always uses the same port (http://localhost:5173).
export default defineConfig(({ mode }) => {
  // Server-only secrets from .env (no VITE_ prefix, so they never reach the browser bundle).
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of SERVER_ENV) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }
  return {
    plugins: [react(), apiDevServer()],
    // MapLibre's worker uses ES imports, so it must be built as a module worker.
    worker: { format: 'es' },
    server: { port: 5173, strictPort: true },
    preview: { port: 5173, strictPort: true },
  }
})
