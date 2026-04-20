import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Calendar, Sparkles, BookOpen } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'

const Navigation = ({ scrolled }) => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [calendarsOpen, setCalendarsOpen] = useState(false)
  const [mobileCalendarsOpen, setMobileCalendarsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const scrollToSection = (id) => {
    // Si on n'est pas sur la page d'accueil, naviguer d'abord vers la page d'accueil
    if (location.pathname !== '/') {
      navigate('/')
      // Attendre que la navigation soit terminée avant de scroller
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setMobileMenuOpen(false)
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
          <Link 
            to="/"
            className="flex items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.05 }}>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md overflow-hidden">
              <img 
                src="/logo-og-v2.png" 
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
          </Link>
          
          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: 'about', key: 'nav.presentation', scroll: true },
              { id: 'biography', key: 'nav.biography', scroll: true },
              { id: 'library', key: 'nav.library', scroll: true },
              { id: 'message', key: 'nav.message', scroll: true },
              { id: 'contact', key: 'nav.contact', scroll: true }
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
            
            {/* Dropdown Calendriers */}
            <div 
              className="relative"
              onMouseEnter={() => setCalendarsOpen(true)}
              onMouseLeave={() => setCalendarsOpen(false)}
            >
              <button
                className={`flex items-center gap-1 font-medium transition-colors ${
                  scrolled 
                    ? 'text-emerald-700 hover:text-gold-600' 
                    : 'text-white hover:text-gold-300'
                }`}
              >
                Calendriers
                <ChevronDown className={`w-4 h-4 transition-transform ${calendarsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {calendarsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 pt-3 w-72"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      <Link
                        to="/programme"
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-gold-50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700">Programmes Usratul de Amine</p>
                          <p className="text-xs text-gray-500">Nos activités et événements</p>
                        </div>
                      </Link>

                      <Link
                        to="/calendrier-tariqa"
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-gold-50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700">Calendrier Hadara</p>
                          <p className="text-xs text-gray-500">Calendrier officiel de la Tariqa</p>
                        </div>
                      </Link>

                      <Link
                        to="/hadara-djouma"
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-gold-50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-gold-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700">Hadara Djouma</p>
                          <p className="text-xs text-gray-500">70 Hadaratoul Jumu'ah 2026/2027</p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
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
                  {/* Liens avec scroll */}
                  {[
                    { id: 'about', key: 'nav.presentation' },
                    { id: 'biography', key: 'nav.biography' },
                    { id: 'library', key: 'nav.library' },
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
                  
                  {/* Section Calendriers - Mobile Accordion */}
                  <button
                    onClick={() => setMobileCalendarsOpen(!mobileCalendarsOpen)}
                    className={`flex items-center justify-between w-full px-6 py-3 text-emerald-700 hover:bg-emerald-50 hover:text-gold-600 font-medium transition-colors ${
                      language === 'ar' ? 'font-arabic text-right' : ''
                    }`}
                  >
                    <span>Calendriers</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileCalendarsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {mobileCalendarsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        <Link
                          to="/programme"
                          onClick={() => { setMobileMenuOpen(false); setMobileCalendarsOpen(false) }}
                          className="flex items-center gap-3 px-8 py-3 text-gray-700 hover:bg-white transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm">Programmes de Usratul Amine</span>
                        </Link>
                        <Link
                          to="/calendrier-tariqa"
                          onClick={() => { setMobileMenuOpen(false); setMobileCalendarsOpen(false) }}
                          className="flex items-center gap-3 px-8 py-3 text-gray-700 hover:bg-white transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-gold-600" />
                          <span className="text-sm">Calendrier Hadara</span>
                        </Link>
                        <Link
                          to="/hadara-djouma"
                          onClick={() => { setMobileMenuOpen(false); setMobileCalendarsOpen(false) }}
                          className="flex items-center gap-3 px-8 py-3 text-gray-700 hover:bg-white transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                          <span className="text-sm">Hadara Djouma</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
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
