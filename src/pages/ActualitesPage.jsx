import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { CategoryBadge, VideoBadge } from '../components/NewsSection'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { pickLocalized } from '../utils/localizedField'
import { NEWS_CATEGORIES, fetchPublishedNews, formatNewsDate, getNewsCover } from '../utils/news'

const ActualitesPage = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchPublishedNews()
      .then(setNews)
      .catch(error => console.error('Error fetching news:', error))
      .finally(() => setLoading(false))
  }, [])

  const usedCategories = NEWS_CATEGORIES.filter(c => news.some(n => n.category === c.id))
  const filtered = category === 'all' ? news : news.filter(n => n.category === category)

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-28 pb-20 bg-gradient-to-b from-emerald-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/library" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('nav.newsLibrary')}
          </Link>

          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-8 ${isAr ? 'font-arabic text-right' : 'font-elegant'}`}>
            {t('news.allTitle')}
          </h1>

          {usedCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {[{ id: 'all' }, ...usedCategories].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    category === c.id
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-600'
                  }`}
                >
                  {c.id === 'all' ? t('news.all') : t(`news.categories.${c.id}`)}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-gray-500">{t('news.loading')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('news.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                >
                  <Link
                    to={`/actualites/${item.id}`}
                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-52 bg-emerald-50 overflow-hidden">
                      {getNewsCover(item) ? (
                        <img src={getNewsCover(item)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-emerald-300" />
                        </div>
                      )}
                      <CategoryBadge category={item.category} t={t} className="absolute top-3 left-3" />
                      <VideoBadge item={item} className="absolute inset-0 m-auto w-14 h-14" />
                    </div>
                    <div className={`p-5 flex flex-col flex-1 ${isAr ? 'text-right' : ''}`}>
                      <p className="inline-flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatNewsDate(item.date, language)}
                      </p>
                      <h2 className={`text-lg font-bold text-gray-900 group-hover:text-emerald-700 mb-2 ${isAr ? 'font-arabic' : ''}`}>
                        {pickLocalized(item, 'title', language)}
                      </h2>
                      <p className={`text-sm text-gray-600 line-clamp-3 ${isAr ? 'font-arabic' : ''}`}>
                        {pickLocalized(item, 'excerpt', language)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default ActualitesPage
