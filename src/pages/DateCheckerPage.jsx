import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Search, AlertTriangle, CheckCircle2, MapPin, Clock, Star, Sparkles } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useTranslation } from '../hooks/useTranslation'
import { pickLocalized } from '../utils/localizedField'

const LOCALE_MAP = { fr: 'fr-FR', ar: 'ar-MA', en: 'en-US' }

const DateCheckerPage = () => {
  const { t, language } = useTranslation()
  const [programs, setPrograms] = useState([])
  const [tariqaEvents, setTariqaEvents] = useState([])
  const [hadaraEvents, setHadaraEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [programsSnap, tariqaSnap, hadaraSnap] = await Promise.all([
          getDocs(query(collection(db, 'programs'), orderBy('date', 'asc'))),
          getDocs(query(collection(db, 'tariqa_events'), orderBy('date', 'asc'))),
          getDocs(query(collection(db, 'hadara_djouma_events'), orderBy('date', 'asc')))
        ])
        setPrograms(programsSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setTariqaEvents(tariqaSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setHadaraEvents(hadaraSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (error) {
        console.error('Error fetching calendars:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const locale = LOCALE_MAP[language] || 'fr-FR'

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [y, m, d] = dateString.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString(locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const sources = selectedDate ? [
    {
      key: 'usra',
      label: t('dateChecker.usra'),
      icon: Sparkles,
      barClass: 'bg-emerald-600',
      badgeClass: 'bg-emerald-100 text-emerald-700',
      events: programs.filter(p => p.date === selectedDate)
    },
    {
      key: 'coskas',
      label: t('dateChecker.coskas'),
      icon: Calendar,
      barClass: 'bg-gradient-to-r from-gold-500 to-amber-600',
      badgeClass: 'bg-amber-100 text-amber-700',
      events: tariqaEvents.filter(e => e.date === selectedDate)
    },
    {
      key: 'hadara',
      label: t('dateChecker.hadara'),
      icon: Star,
      barClass: 'bg-purple-600',
      badgeClass: 'bg-purple-100 text-purple-700',
      events: hadaraEvents.filter(e => e.date === selectedDate)
    }
  ] : []

  const activeSourceCount = sources.filter(s => s.events.length > 0).length
  const hasConflict = activeSourceCount >= 2
  const hasChecked = selectedDate !== '' && !loading

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t('dateChecker.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-elegant font-bold text-gradient mb-6">
              {t('dateChecker.title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t('dateChecker.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dateChecker.pickLabel')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!hasChecked && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t('dateChecker.emptyPrompt')}</p>
              </motion.div>
            )}

            {hasChecked && (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <p className="text-emerald-700 font-semibold">{formatDate(selectedDate)}</p>
                </div>

                {activeSourceCount === 0 && (
                  <div className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3 justify-center">
                    <CheckCircle2 className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-700">{t('dateChecker.noneAtAllTitle')}</p>
                      <p className="text-sm text-gray-500">{t('dateChecker.noneAtAllDesc')}</p>
                    </div>
                  </div>
                )}

                {activeSourceCount === 1 && (() => {
                  const activeSource = sources.find(s => s.events.length > 0)
                  const titles = activeSource.events.map(e => pickLocalized(e, 'title', language)).join(', ')
                  return (
                    <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-800">{t('dateChecker.allClearTitle')}</p>
                        <p className="text-sm text-emerald-700">
                          {t('dateChecker.allClearDesc').replace('{source}', activeSource.label)}{' '}
                          <span className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>{titles}</span>
                        </p>
                      </div>
                    </div>
                  )
                })()}

                {hasConflict && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 p-5 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 justify-center"
                  >
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-red-800">{t('dateChecker.conflictTitle')}</p>
                      <p className="text-sm text-red-700">{t('dateChecker.conflictDesc')}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sources.map((source) => {
                    const Icon = source.icon
                    return (
                      <div key={source.key} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div className={`h-2 ${source.barClass}`} />
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <Icon className="w-5 h-5 text-gray-700" />
                            <h3 className="font-bold text-gray-900">{source.label}</h3>
                          </div>

                          {source.events.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">{t('dateChecker.noEventForSource')}</p>
                          ) : (
                            <div className="space-y-3">
                              {source.events.map((event) => (
                                <div key={event.id} className={`p-3 rounded-xl ${source.badgeClass}`}>
                                  <p className={`font-semibold text-sm mb-1 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                                    {pickLocalized(event, 'title', language)}
                                  </p>
                                  {event.time && (
                                    <div className="flex items-center gap-1.5 text-xs opacity-80 mb-0.5">
                                      <Clock className="w-3 h-3" />
                                      <span>{event.time}</span>
                                    </div>
                                  )}
                                  {event.location && (
                                    <div className="flex items-center gap-1.5 text-xs opacity-80">
                                      <MapPin className="w-3 h-3" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default DateCheckerPage
