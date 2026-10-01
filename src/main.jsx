import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { i18nReady } from './i18n'
import './styles/index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { ContentProvider } from './context/ContentContext'

const root = createRoot(document.getElementById('root'))
// Render once the visitor's language file is in, so the page never flashes English first.
i18nReady.catch(() => {}).then(() => root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ContentProvider>
              <App />
            </ContentProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
))
