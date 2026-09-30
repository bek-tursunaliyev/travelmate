import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Google Sign-In only works from origins registered in Google Cloud Console,
// so the dev server always uses the same port (http://localhost:5173).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true },
})
