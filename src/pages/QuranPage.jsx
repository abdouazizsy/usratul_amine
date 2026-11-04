import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Search } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { fetchChapters, toArabicNumber } from '../utils/quran'

// Recherche tolérante : "baqara" trouve "Al-Baqarah", "2" trouve la sourate 2
const normalize = (text) =>
  (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9؀-ۿ]/g, '')

const QuranPage = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetchChapters(language === 'ar' ? 'ar' : language)
      .then(setChapters)
      .catch(err => {
        console.error('Error fetching chapters:', err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [language])

  const term = normalize(search)
  const filtered = chapters.filter(c =>
    !term ||
    String(c.id) === term ||
    [c.name_simple, c.name_arabic, c.translated_name?.name].some(name => normalize(name).includes(term))
  )

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-28 pb-20 bg-gradient-to-b from-emerald-50/60 to-white min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/library" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('quran.backToLibrary')}
          </Link>

          <p className="text-4xl text-emerald-800 mb-2" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">القرآن الكريم</p>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-3 ${isAr ? 'font-arabic' : 'font-elegant'}`}>
            {t('quran.title')}
          </h1>
          <p className={`text-lg text-gray-600 mb-8 ${isAr ? 'font-arabic' : ''}`}>{t('quran.subtitle')}</p>

          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('quran.search')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">{t('quran.loading')}</div>
          ) : error ? (
            <div className="text-center py-16">
              <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('quran.error')}</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-gray-500">{t('quran.noResult')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/library/coran/${chapter.id}`}
                  className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  <span className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 font-bold group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    {chapter.id}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-gray-900 truncate">{chapter.name_simple}</span>
                    <span className="block text-xs text-gray-500 truncate">
                      {!isAr && `${chapter.translated_name?.name} · `}
                      {chapter.verses_count} {t('quran.verses')} · {chapter.revelation_place === 'madinah' ? t('quran.medinan') : t('quran.meccan')}
                    </span>
                  </span>
                  <span className="text-xl text-emerald-900 flex-shrink-0" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                    {chapter.name_arabic}
                    <span className="sr-only"> {toArabicNumber(chapter.id)}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          <p className="mt-10 text-xs text-gray-400 text-center">{t('quran.credit')}</p>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default QuranPage
