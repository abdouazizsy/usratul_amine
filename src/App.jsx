import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProgrammePage from './pages/ProgrammePage'
import CalendrierTariqaPage from './pages/CalendrierTariqaPage'
import HadaraDjoumaPage from './pages/HadaraDjoumaPage'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/programme" element={<ProgrammePage />} />
          <Route path="/calendrier-tariqa" element={<CalendrierTariqaPage />} />
          <Route path="/hadara-djouma" element={<HadaraDjoumaPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminProvider>
  )
}

export default App
