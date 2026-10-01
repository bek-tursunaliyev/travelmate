import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Serves /api/chat in `vite dev` with the same handler Vercel runs in production.
function apiDevServer() {
  return {
    name: 'travelmate-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const { POST } = await server.ssrLoadModule('/api/chat.js')
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers: { 'Content-Type': req.headers['content-type'] || 'application/json' },
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          })
          const response = req.method === 'POST' ? await POST(request) : Response.json({ error: 'Method not allowed' }, { status: 405 })
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(await response.text())
        } catch (err) {
          server.config.logger.error(`[api/chat] ${err.message}`)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal error' }))
        }
      })
    },
  }
}

// Google Sign-In only works from origins registered in Google Cloud Console,
// so the dev server always uses the same port (http://localhost:5173).
export default defineConfig(({ mode }) => {
  // Server-only secrets from .env (no VITE_ prefix, so they never reach the browser bundle).
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['GEMINI_API_KEY', 'GEMINI_MODEL', 'AI_GATEWAY_API_KEY', 'AI_MODEL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }
  return {
    plugins: [react(), apiDevServer()],
    server: { port: 5173, strictPort: true },
    preview: { port: 5173, strictPort: true },
  }
})
