import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Headphones, Clock } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { pickLocalized } from '../utils/localizedField'
import { flattenTracks, formatTotalDuration } from '../utils/audio'

const AudiothequePage = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocs(collection(db, 'audio_collections'))
      .then(snapshot => {
        const data = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => c.published !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setCollections(data)
      })
      .catch(error => console.error('Error fetching audio collections:', error))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-28 pb-20 bg-gradient-to-b from-emerald-50/60 to-white min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/library" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('audio.backToLibrary')}
          </Link>

          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-3 ${isAr ? 'font-arabic' : 'font-elegant'}`}>
            {t('audio.title')}
          </h1>
          <p className={`text-lg text-gray-600 mb-10 ${isAr ? 'font-arabic' : ''}`}>{t('audio.subtitle')}</p>

          {loading ? (
            <div className="text-center py-16 text-gray-500">{t('audio.loading')}</div>
          ) : collections.length === 0 ? (
            <div className="text-center py-16">
              <Headphones className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('audio.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((item, index) => {
                const tracks = flattenTracks(item)
                const totalSeconds = tracks.reduce((sum, track) => sum + (track.duration || 0), 0)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      to={`/library/audio/${item.id}`}
                      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <Headphones className="w-14 h-14 text-amber-300" />
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h2 className={`text-lg font-bold text-gray-900 group-hover:text-emerald-700 mb-1 ${isAr ? 'font-arabic' : ''}`}>
                          {pickLocalized(item, 'title', language)}
                        </h2>
                        {item.author && <p className="text-sm font-medium text-emerald-700 mb-2">{item.author}</p>}
                        <p className={`text-sm text-gray-600 line-clamp-3 mb-4 ${isAr ? 'font-arabic' : ''}`}>
                          {pickLocalized(item, 'description', language)}
                        </p>
                        <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Headphones className="w-3.5 h-3.5" />
                            {tracks.length} {t('audio.episodes')}
                          </span>
                          {totalSeconds > 0 && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTotalDuration(totalSeconds)}
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default AudiothequePage
