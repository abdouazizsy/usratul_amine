import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProgrammePage from './pages/ProgrammePage'
import CalendrierTariqaPage from './pages/CalendrierTariqaPage'
import HadaraDjoumaPage from './pages/HadaraDjoumaPage'
import ProduitsPage from './pages/ProduitsPage'
import RealisationsPage from './pages/RealisationsPage'
import LibraryPage from './pages/LibraryPage'
import RayonDetailPage from './pages/RayonDetailPage'
import AuteursDiwansPage from './pages/AuteursDiwansPage'
import CalendrierHijriPage from './pages/CalendrierHijriPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import PWAInstallBanner from './components/PWAInstallBanner'
import ScrollToTop from './components/ScrollToTop'
import LaunchGate from './components/LaunchGate'
import { AdminProvider, useAdmin } from './contexts/AdminContext'

// Composant pour protéger les routes admin
function ProtectedAdminRoute({ children }) {
  const { user, loading, isAdmin } = useAdmin()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Accès non autorisé</div>
      </div>
    )
  }

  return children
}

function App() {
  return (
    <AdminProvider>
      <Router>
        <ScrollToTop />
        <LaunchGate>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/programme" element={<ProgrammePage />} />
            <Route path="/calendrier-tariqa" element={<CalendrierTariqaPage />} />
            <Route path="/calendrier-hijri" element={<CalendrierHijriPage />} />
            <Route path="/hadara-djouma" element={<HadaraDjoumaPage />} />
            <Route path="/produits" element={<ProduitsPage />} />
            <Route path="/realisations" element={<RealisationsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/auteurs" element={<AuteursDiwansPage />} />
            <Route path="/library/:rayonId" element={<RayonDetailPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/commande" element={<CheckoutPage />} />
            <Route
              path="/admin"
              element={
                <div lang="fr" dir="ltr">
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <PWAInstallBanner />
        </LaunchGate>
      </Router>
    </AdminProvider>
  )
}

export default App
