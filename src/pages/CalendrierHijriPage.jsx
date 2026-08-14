import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Moon } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { getCloudinaryDownloadUrl } from '../utils/cloudinaryUpload'

const CalendrierHijriPage = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [calendriers, setCalendriers] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewCalendrier, setPreviewCalendrier] = useState(null)

  useEffect(() => {
    const fetchCalendriers = async () => {
      try {
        const calendriersQuery = query(collection(db, 'calendriers_hijri'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(calendriersQuery)
        setCalendriers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (error) {
        console.error('Error fetching calendriers hijri:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCalendriers()
  }, [])

  const [current, ...archive] = calendriers

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-32 pb-24 bg-gradient-to-b from-amber-50/50 via-white to-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-100 rounded-full">
              <Moon className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                {t('hijriCalendar.title')}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 via-emerald-700 to-amber-800 bg-clip-text text-transparent">
              {t('hijriCalendar.title')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('hijriCalendar.subtitle')}
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">{t('hijriCalendar.loading')}</p>
          ) : calendriers.length === 0 ? (
            <div className="text-center py-16">
              <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('hijriCalendar.noCalendars')}</p>
            </div>
          ) : (
            <>
              {/* Mois en cours */}
              <div className="max-w-md mx-auto mb-16">
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-4">
                  {t('hijriCalendar.current')}
                </p>
                <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
                  <button
                    onClick={() => setPreviewCalendrier(current)}
                    className="block w-full aspect-[3/4] bg-gray-100"
                  >
                    <img
                      src={current.imageUrl}
                      alt={current.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-3 text-center">{current.title}</h3>
                    <a
                      href={getCloudinaryDownloadUrl(current.imageUrl)}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t('hijriCalendar.download')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Archive */}
              {archive.length > 0 && (
                <div>
                  <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
                    {t('hijriCalendar.archive')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {archive.map((calendrier) => (
                      <div key={calendrier.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <button
                          onClick={() => setPreviewCalendrier(calendrier)}
                          className="block w-full aspect-[3/4] bg-gray-100"
                        >
                          <img
                            src={calendrier.imageUrl}
                            alt={calendrier.title}
                            className="w-full h-full object-cover"
                          />
                        </button>
                        <div className="p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 line-clamp-2">{calendrier.title}</h4>
                          <a
                            href={getCloudinaryDownloadUrl(calendrier.imageUrl)}
                            className="flex items-center justify-center gap-1.5 w-full py-2 bg-gray-50 hover:bg-emerald-50 text-emerald-700 rounded-lg font-medium text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {t('hijriCalendar.download')}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />

      <AnimatePresence>
        {previewCalendrier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewCalendrier(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] overflow-y-auto p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full mx-auto my-8"
            >
              <button
                onClick={() => setPreviewCalendrier(null)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewCalendrier.imageUrl}
                alt={previewCalendrier.title}
                className="w-full max-h-[70vh] object-contain rounded-xl shadow-2xl bg-black/20"
              />
              <p className="text-white text-center mt-4 font-semibold">{previewCalendrier.title}</p>
              <a
                href={getCloudinaryDownloadUrl(previewCalendrier.imageUrl)}
                className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('hijriCalendar.download')}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CalendrierHijriPage
