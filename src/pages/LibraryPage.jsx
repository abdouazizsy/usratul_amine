import React from 'react'
import Navigation from '../components/Navigation'
import NewsSection from '../components/NewsSection'
import Library from '../components/Library'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'

const LibraryPage = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="relative pt-20 overflow-hidden bg-emerald-900">
        <img src="/hero-al-amine.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-emerald-900/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8 text-white">
          <div className={`max-w-xl ${isAr ? 'text-right' : ''}`}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isAr ? 'font-arabic' : 'font-elegant'}`}>
              {t('news.heroTitle')}
            </h1>
            <p className={`text-lg text-white/90 ${isAr ? 'font-arabic' : ''}`}>{t('news.heroSubtitle')}</p>
          </div>
          <blockquote className="md:text-right max-w-xs">
            <p className={`text-xl italic ${isAr ? 'font-arabic' : 'font-elegant'}`}>{t('news.heroQuote')}</p>
            <footer className="mt-2 text-sm text-white/80">— Usratul Amine</footer>
          </blockquote>
        </div>
      </section>

      <NewsSection />
      <Library />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default LibraryPage
