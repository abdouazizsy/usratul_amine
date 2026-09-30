import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Library as LibraryIcon, Sparkles, ArrowRight, Phone, BookOpen, ScrollText, Scale, Languages, Globe, Newspaper, ChevronLeft, ChevronRight, Headphones } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { rayonBooks } from '../data/rayonBooks'

const shelves = [
  { id: 'tafsir', icon: BookOpen },
  { id: 'hadith', icon: ScrollText },
  { id: 'fiqh', icon: Scale },
  { id: 'sufism', icon: Sparkles },
  { id: 'language', icon: Languages },
  { id: 'foreignLanguages', icon: Globe },
  { id: 'magazines', icon: Newspaper }
]

const ShelfCard = ({ shelf, t, language }) => {
  const shelfData = t(`library.shelves.${shelf.id}`)
  const books = rayonBooks[shelf.id] || []
  const cover = books[0]?.image
  const Icon = shelf.icon
  const isAr = language === 'ar'

  const Wrapper = books.length ? Link : 'div'
  const wrapperProps = books.length ? { to: `/library/${shelf.id}` } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="group snap-start flex-shrink-0 w-[230px] sm:w-[240px] flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center overflow-hidden">
        {cover ? (
          <img src={cover} alt={shelfData.titleFr} className="h-full w-auto object-contain py-3 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 flex items-center justify-center">
            <Icon className="w-7 h-7 text-amber-300" />
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-semibold">
          {t('library.section')} {shelfData.number}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-right text-lg text-gray-800 leading-snug mb-1" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
          {shelfData.titleAr}
        </p>
        <p className={`text-sm font-semibold text-emerald-800 line-clamp-2 ${isAr ? 'font-arabic text-right' : ''}`}>
          {isAr ? shelfData.description : shelfData.titleFr}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500">
            {books.length ? `${books.length} ${t('news.books')}` : t('news.soon')}
          </span>
          {books.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-700 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white rounded-lg text-xs font-semibold transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
              {t('news.browse')}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

const Library = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const scrollerRef = useRef(null)

  const scroll = (direction) => {
    const rtl = getComputedStyle(scrollerRef.current).direction === 'rtl'
    scrollerRef.current.scrollBy({ left: direction * (rtl ? -260 : 260), behavior: 'smooth' })
  }

  return (
    <section id="library" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 pt-12" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700 mb-2 ${isAr ? 'font-arabic' : ''}`}>
              <LibraryIcon className="w-4 h-4" />
              {t('news.librarySection')}
            </p>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${isAr ? 'font-arabic' : 'font-elegant'}`}>
              {t('news.libraryTitle')}
            </h2>
            <p className={`text-gray-600 mt-2 max-w-2xl ${isAr ? 'font-arabic' : ''}`}>{t('news.librarySubtitle')}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carrousel des rayons + encart "bientôt en ligne" */}
        <div className="flex flex-col lg:flex-row gap-5">
          <div
            ref={scrollerRef}
            className="flex-1 min-w-0 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-hide"
          >
            {shelves.map((shelf) => (
              <ShelfCard key={shelf.id} shelf={shelf} t={t} language={language} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative lg:w-[300px] flex-shrink-0 rounded-2xl overflow-hidden bg-emerald-900 text-white min-h-[300px]"
          >
            <img src="/library-photo-1.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/80 to-emerald-900/20" />
            <div className={`relative h-full flex flex-col justify-end p-6 ${isAr ? 'text-right' : ''}`}>
              <h3 className={`text-2xl font-bold mb-2 ${isAr ? 'font-arabic' : 'font-elegant'}`}>{t('news.promoTitle')}</h3>
              <p className={`text-sm text-white/85 mb-4 ${isAr ? 'font-arabic' : ''}`}>{t('news.promoText')}</p>
              <p className="flex items-start gap-2 text-xs text-white/80">
                <Phone className="w-4 h-4 flex-shrink-0 text-amber-300" />
                <span>
                  <span className="font-semibold">{t('library.contactLabel')}</span>
                  <br />
                  +221 33 955 85 25 / +221 77 021 29 00
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Audiothèque + Auteurs & Diwans */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { to: '/library/audio', icon: Headphones, label: t('audio.section'), text: t('audio.teaserText'), cta: t('audio.cta') },
            { to: '/library/auteurs', icon: BookOpen, label: t('library.authors.sectionTitle'), text: t('library.authors.sectionSubtitle'), cta: t('library.authors.cta') }
          ].map(({ to, icon: Icon, label, text, cta }) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 border border-emerald-100 p-8 sm:p-10 text-center shadow-sm"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-100 rounded-full">
                <Icon className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">{label}</span>
              </div>
              <p className={`text-gray-600 max-w-md mx-auto mb-6 ${isAr ? 'font-arabic' : ''}`}>{text}</p>
              <Link
                to={to}
                className="mt-auto inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-lg transition-colors"
              >
                {cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Library
