import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, CalendarDays, Clock, MapPin, Newspaper, Play } from 'lucide-react'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { pickLocalized } from '../utils/localizedField'
import { fetchPublishedNews, formatNewsDate, getNewsCover } from '../utils/news'

export const VideoBadge = ({ item, className = '' }) => {
  if (!item?.videos?.length) return null
  return (
    <span className={`flex items-center justify-center rounded-full bg-black/60 text-white ${className}`}>
      <Play className="w-1/2 h-1/2 fill-current" />
    </span>
  )
}

export const CategoryBadge = ({ category, t, className = '' }) => {
  if (!category) return null
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-semibold ${className}`}>
      {t(`news.categories.${category}`)}
    </span>
  )
}

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const NextEventCard = ({ event, language, t }) => {
  const isAr = language === 'ar'
  return (
    <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6">
      <h3 className={`flex items-center gap-2 text-lg font-bold text-emerald-800 mb-5 ${isAr ? 'font-arabic' : ''}`}>
        <CalendarDays className="w-5 h-5" />
        {t('news.nextEvent')}
      </h3>

      {event ? (
        <>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-16 text-center text-emerald-900">
              <p className="text-3xl font-bold leading-none">{formatNewsDate(event.date, language, { day: 'numeric' })}</p>
              <p className="text-sm mt-1 capitalize">{formatNewsDate(event.date, language, { month: 'long' })}</p>
              <p className="text-sm">{formatNewsDate(event.date, language, { year: 'numeric' })}</p>
            </div>
            <div className="min-w-0 space-y-2">
              <p className={`font-semibold text-gray-900 leading-snug ${isAr ? 'font-arabic text-right' : ''}`}>
                {pickLocalized(event, 'title', language)}
              </p>
              {event.location && (
                <p className="flex items-start gap-1.5 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-600" />
                  {pickLocalized(event, 'location', language)}
                </p>
              )}
              {event.time && (
                <p className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                  {event.time}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/programme"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-full transition-colors"
            >
              {t('news.seeDetail')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      ) : (
        <p className={`text-sm text-gray-500 ${isAr ? 'font-arabic text-right' : ''}`}>{t('news.noEvent')}</p>
      )}
    </div>
  )
}

const NewsSection = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const [news, setNews] = useState([])
  const [nextEvent, setNextEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [newsResult, eventResult] = await Promise.allSettled([
        fetchPublishedNews(),
        getDocs(query(collection(db, 'programs'), where('date', '>=', todayISO()), orderBy('date', 'asc'), limit(1)))
      ])
      if (newsResult.status === 'fulfilled') setNews(newsResult.value)
      else console.error('Error fetching news:', newsResult.reason)
      if (eventResult.status === 'fulfilled' && !eventResult.value.empty) {
        const d = eventResult.value.docs[0]
        setNextEvent({ id: d.id, ...d.data() })
      } else if (eventResult.status === 'rejected') {
        console.error('Error fetching next event:', eventResult.reason)
      }
      setLoading(false)
    }
    load()
  }, [])

  const featured = news.find(n => n.featured) || news[0]
  const others = news.filter(n => n !== featured).slice(0, 4)

  return (
    <section id="actualites" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
              <div>
                <p className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700 mb-2 ${isAr ? 'font-arabic' : ''}`}>
                  <Newspaper className="w-4 h-4" />
                  {t('news.section')}
                </p>
                <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${isAr ? 'font-arabic' : 'font-elegant'}`}>
                  {t('news.title')}
                </h2>
                <p className={`text-gray-600 mt-2 ${isAr ? 'font-arabic' : ''}`}>{t('news.subtitle')}</p>
              </div>
              {news.length > 0 && (
                <Link to="/actualites" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900 whitespace-nowrap">
                  {t('news.seeAll')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-500">{t('news.loading')}</div>
            ) : !featured ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t('news.empty')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/actualites/${featured.id}`}
                    className="group relative block h-full min-h-[380px] rounded-2xl overflow-hidden bg-emerald-900 shadow-lg"
                  >
                    {getNewsCover(featured) && (
                      <img
                        src={getNewsCover(featured)}
                        alt={pickLocalized(featured, 'title', language)}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <CategoryBadge category={featured.category} t={t} className="absolute top-4 left-4" />
                    <VideoBadge item={featured} className="absolute top-4 right-4 w-12 h-12" />
                    <div className={`absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white ${isAr ? 'text-right' : ''}`}>
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/85 mb-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatNewsDate(featured.date, language)}
                        </span>
                        {featured.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {featured.location}
                          </span>
                        )}
                      </p>
                      <h3 className={`text-xl sm:text-2xl font-bold leading-snug mb-2 ${isAr ? 'font-arabic' : 'font-elegant'}`}>
                        {pickLocalized(featured, 'title', language)}
                      </h3>
                      {pickLocalized(featured, 'excerpt', language) && (
                        <p className={`text-sm text-white/85 line-clamp-3 mb-4 ${isAr ? 'font-arabic' : ''}`}>
                          {pickLocalized(featured, 'excerpt', language)}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 group-hover:bg-emerald-600 rounded-lg text-sm font-semibold transition-colors">
                        {t('news.readMore')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>

                <div className="divide-y divide-gray-100">
                  {others.map((item) => (
                    <Link
                      key={item.id}
                      to={`/actualites/${item.id}`}
                      className="group flex items-center gap-4 py-3 first:pt-0"
                    >
                      <div className="relative w-24 h-20 sm:w-28 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-emerald-50">
                        <VideoBadge item={item} className="absolute inset-0 m-auto w-8 h-8 z-10" />
                        {getNewsCover(item) ? (
                          <img src={getNewsCover(item)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="w-6 h-6 text-emerald-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <CategoryBadge category={item.category} t={t} className="!text-[10px] !px-2" />
                          <span className="text-xs text-gray-500">{formatNewsDate(item.date, language, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <p className={`text-sm font-semibold text-gray-900 group-hover:text-emerald-700 line-clamp-2 ${isAr ? 'font-arabic text-right' : ''}`}>
                          {pickLocalized(item, 'title', language)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-700 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:pt-2">
            <NextEventCard event={nextEvent} language={language} t={t} />
          </aside>
        </div>
      </div>
    </section>
  )
}

export default NewsSection
