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
import NotFound from './pages/NotFound'

export default function App() {
  const { pathname } = useLocation()
  const isAuth = pathname === '/login' || pathname === '/signup'

  return (
    <>
      <ScrollManager />
      {!isAuth && <Navbar />}
      <main className={isAuth ? '' : 'page'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/popular/:list" element={<Popular />} />
          <Route path="/place/:list/:slug" element={<Place />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/transfers" element={<TransferSelect />} />
          <Route path="/transfers/book" element={<TransferCheckout />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:slug" element={<TourDetail />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuideProfile />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuth && <Footer />}
      {!isAuth && <ChatBot />}
    </>
  )
}
