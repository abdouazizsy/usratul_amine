import React, { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

const PWAInstallBanner = () => {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      const dismissed = localStorage.getItem('pwa-banner-dismissed')
      if (!dismissed) setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setInstallPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-banner-dismissed', 'true')
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3">
        <img src="/pwa-192x192.png" alt="Usratul Amine" className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">Installer l'application</p>
          <p className="text-xs text-gray-500 truncate">Accès rapide depuis votre écran d'accueil</p>
        </div>
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-3 py-2 rounded-xl flex-shrink-0 transition-colors"
        >
          <Download size={15} />
          Installer
        </button>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default PWAInstallBanner
