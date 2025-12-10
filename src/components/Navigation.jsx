import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'

const Navigation = ({ scrolled }) => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false) // Fermer le menu après navigation
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection('hero')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md overflow-hidden">
              <img 
                src="/logo.jpeg" 
                alt="Usratul Amine Logo" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback si l'image n'est pas trouvée
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-emerald-600 to-gold-600 rounded-full flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>'
                }}
              />
            </div>
            <span className={`text-xl font-elegant font-bold ${
              scrolled ? 'text-emerald-800' : 'text-white'
            }`}>
              Usratul Amine
            </span>
          </motion.div>
          
          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: 'about', key: 'nav.presentation' },
              { id: 'biography', key: 'nav.biography' },
              { id: 'program', key: 'nav.program' },
              { id: 'message', key: 'nav.message' },
              { id: 'contact', key: 'nav.contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors ${
                  scrolled 
                    ? 'text-emerald-700 hover:text-gold-600' 
                    : 'text-white hover:text-gold-300'
                }`}
              >
                {t(item.key)}
              </button>
            ))}
            
            <LanguageSelector scrolled={scrolled} />
          </div>

          {/* Bouton burger mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? 'text-emerald-800' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? 'text-emerald-800' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop pour fermer le menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                style={{ top: '80px' }}
              />
              
              {/* Menu déroulant */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="md:hidden absolute left-0 right-0 top-full z-50"
              >
                <div className="mx-4 mt-2 py-4 space-y-1 bg-white rounded-2xl shadow-2xl border border-gray-200">
                  {[
                    { id: 'about', key: 'nav.presentation' },
                    { id: 'biography', key: 'nav.biography' },
                    { id: 'program', key: 'nav.program' },
                    { id: 'message', key: 'nav.message' },
                    { id: 'contact', key: 'nav.contact' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-6 py-3 text-emerald-700 hover:bg-emerald-50 hover:text-gold-600 font-medium transition-colors ${
                        language === 'ar' ? 'font-arabic text-right' : ''
                      }`}
                    >
                      {t(item.key)}
                    </button>
                  ))}
                  
                  {/* Sélecteur de langue pour mobile */}
                  <div className="px-6 py-3 border-t border-gray-200 mt-2">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Langue / Language</p>
                    <LanguageSelector scrolled={true} />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navigation
