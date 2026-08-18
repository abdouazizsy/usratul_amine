import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Calendar, Sparkles, BookOpen, ShoppingBag, ShoppingCart, Award, Moon, Home, Search } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { getTranslation } from '../translations/translations'

const getGregorianYearLabel = () => {
  const y = new Date().getFullYear()
  return `${y}/${y + 1}`
}

const Navigation = ({ scrolled }) => {
  const { language } = useLanguage()
  const { totalItems } = useCart()
  const t = (key) => getTranslation(language, key)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [calendarsOpen, setCalendarsOpen] = useState(false)
  const [mobileCalendarsOpen, setMobileCalendarsOpen] = useState(false)
  const [activitiesOpen, setActivitiesOpen] = useState(false)
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

  const bottomNavItems = [
    { id: 'home', labelKey: 'nav.home', to: '/', icon: Home, match: (path) => path === '/' },
    { id: 'library', labelKey: 'nav.library', to: '/library', icon: BookOpen, match: (path) => path.startsWith('/library') },
    { id: 'produits', labelKey: 'nav.shop', to: '/produits', icon: ShoppingBag, match: (path) => path === '/produits' },
    { id: 'activites', labelKey: 'nav.realisationsTitle', to: '/realisations', icon: Award, match: (path) => path === '/realisations' },
    { id: 'panier', labelKey: 'cart.title', to: '/panier', icon: ShoppingCart, match: (path) => path === '/panier' }
  ]

  return (
    <>
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
            className="flex items-center gap-3 self-start mt-3"
          >
            <motion.div whileHover={{ scale: 1.05 }}>
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md overflow-hidden">
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
            </motion.div>
          </Link>
          
          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: 'about', key: 'nav.presentation', scroll: true },
              { id: 'library', key: 'nav.library', link: '/library' },
              { id: 'contact', key: 'nav.contact', scroll: true }
            ].map((item) => {
              const linkClassName = `font-medium transition-colors ${
                scrolled
                  ? 'text-emerald-700 hover:text-gold-600'
                  : 'text-white hover:text-gold-300'
              }`

              return item.link ? (
                <Link key={item.id} to={item.link} className={linkClassName}>
                  {t(item.key)}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={linkClassName}
                >
                  {t(item.key)}
                </button>
              )
            })}

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
                } ${language === 'ar' ? 'font-arabic' : ''}`}
              >
                {t('nav.calendars')}
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
                          <p className={`font-semibold text-gray-900 group-hover:text-emerald-700 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.programsTitle')}</p>
                          <p className={`text-xs text-gray-500 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.programsDesc')}</p>
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
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700">{t('nav.coskasTitle')}</p>
                          <p className={`text-xs text-gray-500 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.coskasDesc')}</p>
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
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700">{t('nav.hadaraTitle')}</p>
                          <p className={`text-xs text-gray-500 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.hadaraDesc')} {getGregorianYearLabel()}</p>
                        </div>
                      </Link>

                      <Link
                        to="/calendrier-hijri"
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-gold-50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Moon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold text-gray-900 group-hover:text-emerald-700 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.hijriCalendarTitle')}</p>
                          <p className={`text-xs text-gray-500 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.hijriCalendarDesc')}</p>
                        </div>
                      </Link>

                      <Link
                        to="/verifier-date"
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-gold-50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Search className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold text-gray-900 group-hover:text-emerald-700 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.dateCheckerTitle')}</p>
                          <p className={`text-xs text-gray-500 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.dateCheckerDesc')}</p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown Nos activités */}
            <div
              className="relative"
              onMouseEnter={() => setActivitiesOpen(true)}
              onMouseLeave={() => setActivitiesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 font-medium transition-colors ${
                  scrolled
                    ? 'text-emerald-700 hover:text-gold-600'
                    : 'text-white hover:text-gold-300'
                } ${language === 'ar' ? 'font-arabic' : ''}`}
              >
                {t('nav.activities')}
                <ChevronDown className={`w-4 h-4 transition-transform ${activitiesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activitiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 pt-3 w-72"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      <Link
                        to="/realisations"
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-gold-50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold text-gray-900 group-hover:text-emerald-700 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.realisationsTitle')}</p>
                          <p className={`text-xs text-gray-500 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('nav.realisationsDesc')}</p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/produits"
              className={`flex items-center gap-1 font-medium transition-colors ${
                scrolled
                  ? 'text-emerald-700 hover:text-gold-600'
                  : 'text-white hover:text-gold-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {t('nav.products')}
            </Link>

            <Link
              to="/panier"
              className={`relative p-2 rounded-full transition-colors ${
                scrolled
                  ? 'text-emerald-700 hover:bg-emerald-50'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={t('cart.title')}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gold-500 text-white text-xs font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <LanguageSelector scrolled={scrolled} />
          </div>

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
                className="md:hidden fixed inset-0 bg-black/50 z-[55]"
                style={{ top: '80px' }}
              />

              {/* Menu déroulant */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="md:hidden absolute left-0 right-0 top-full z-[60] max-h-[calc(100vh-100px)] overflow-y-auto"
              >
                <div className="mx-4 mt-2 py-4 space-y-1 bg-white rounded-2xl shadow-2xl border border-gray-200">
                  {/* Liens avec scroll */}
                  {[
                    { id: 'about', key: 'nav.presentation' },
                    { id: 'contact', key: 'nav.contact' }
                  ].map((item) => {
                    const linkClassName = `block w-full text-left px-6 py-3 text-emerald-700 hover:bg-emerald-50 hover:text-gold-600 font-medium transition-colors ${
                      language === 'ar' ? 'font-arabic text-right' : ''
                    }`

                    return item.link ? (
                      <Link
                        key={item.id}
                        to={item.link}
                        onClick={() => setMobileMenuOpen(false)}
                        className={linkClassName}
                      >
                        {t(item.key)}
                      </Link>
                    ) : (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={linkClassName}
                      >
                        {t(item.key)}
                      </button>
                    )
                  })}
                  
                  {/* Section Calendriers - Mobile Accordion */}
                  <button
                    onClick={() => setMobileCalendarsOpen(!mobileCalendarsOpen)}
                    className={`flex items-center justify-between w-full px-6 py-3 text-emerald-700 hover:bg-emerald-50 hover:text-gold-600 font-medium transition-colors ${
                      language === 'ar' ? 'font-arabic text-right' : ''
                    }`}
                  >
                    <span>{t('nav.calendars')}</span>
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
                          <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>{t('nav.programsTitle')}</span>
                        </Link>
                        <Link
                          to="/calendrier-tariqa"
                          onClick={() => { setMobileMenuOpen(false); setMobileCalendarsOpen(false) }}
                          className="flex items-center gap-3 px-8 py-3 text-gray-700 hover:bg-white transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-gold-600" />
                          <span className="text-sm">{t('nav.coskasTitle')}</span>
                        </Link>
                        <Link
                          to="/hadara-djouma"
                          onClick={() => { setMobileMenuOpen(false); setMobileCalendarsOpen(false) }}
                          className="flex items-center gap-3 px-8 py-3 text-gray-700 hover:bg-white transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                          <span className="text-sm">{t('nav.hadaraTitle')}</span>
                        </Link>
                        <Link
                          to="/calendrier-hijri"
                          onClick={() => { setMobileMenuOpen(false); setMobileCalendarsOpen(false) }}
                          className="flex items-center gap-3 px-8 py-3 text-gray-700 hover:bg-white transition-colors"
                        >
                          <Moon className="w-4 h-4 text-amber-600" />
                          <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>{t('nav.hijriCalendarTitle')}</span>
                        </Link>
                        <Link
                          to="/verifier-date"
                          onClick={() => { setMobileMenuOpen(false); setMobileCalendarsOpen(false) }}
                          className="flex items-center gap-3 px-8 py-3 text-gray-700 hover:bg-white transition-colors"
                        >
                          <Search className="w-4 h-4 text-purple-600" />
                          <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>{t('nav.dateCheckerTitle')}</span>
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

    {/* Barre de navigation mobile fixe en bas (façon app native) */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-6 h-16">
        {bottomNavItems.map((item) => {
          const active = item.match(location.pathname)
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-emerald-600' : 'text-gray-500'
              }`}
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                {item.id === 'panier' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-gold-500 text-white text-[10px] font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-medium leading-none ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t(item.labelKey)}
              </span>
            </Link>
          )
        })}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            mobileMenuOpen ? 'text-emerald-600' : 'text-gray-500'
          }`}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className={`text-[10px] font-medium leading-none ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t('nav.more')}
          </span>
        </button>
      </div>
    </nav>
    </>
  )
}

export default Navigation
