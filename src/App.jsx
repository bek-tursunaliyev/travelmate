import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import AuthPage from './pages/Auth'
import { Popular, Place, PlacesPage } from './pages/Places'
import { SearchResults, ServicePage, TicketsPage, Profile } from './pages/Other'
import { GuidesPage, GuideProfile } from './pages/Guides'
import { ToursPage, TourDetail } from './pages/Tours'
import { TransferSelect, TransferCheckout } from './pages/Transfers'
import EsimPage from './pages/Esim'
import TicketPage from './pages/TicketPage'
import NotFound from './pages/NotFound'
import { useContent } from './context/ContentContext'

// The admin panel is only loaded by the admin.
const AdminPage = lazy(() => import('./pages/Admin'))

export default function App() {
  const { pathname } = useLocation()
  // Subscribing here re-renders the whole tree when the admin publishes new content.
  useContent()
  const isAuth = pathname === '/login' || pathname === '/signup'
  const isAdmin = pathname.startsWith('/admin')
  const chrome = !isAuth && !isAdmin

  return (
    <>
      <ScrollManager />
      {chrome && <Navbar />}
      <main className={chrome ? 'page' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/popular/:list" element={<Popular />} />
          <Route path="/place/:list/:slug" element={<Place />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:cat/:id" element={<TicketPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/esim" element={<EsimPage />} />
          <Route path="/transfers" element={<TransferSelect />} />
          <Route path="/transfers/book" element={<TransferCheckout />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:slug" element={<TourDetail />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuideProfile />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<Suspense fallback={<div className="admin-loading" />}><AdminPage /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {chrome && <Footer />}
      {chrome && <ChatBot />}
    </>
  )
}
