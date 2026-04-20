import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, AlertCircle, Info } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

const TariqaCalendar = () => {
  const [tariqaEvents, setTariqaEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTariqaEvents()
  }, [])

  const fetchTariqaEvents = async () => {
    try {
      const eventsQuery = query(collection(db, 'tariqa_events'), orderBy('date', 'asc'))
      const querySnapshot = await getDocs(eventsQuery)
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTariqaEvents(eventsData)
    } catch (error) {
      console.error('Error fetching tariqa events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('fr-FR', options)
  }

  const isFutureEvent = (dateString) => {
    return new Date(dateString) > new Date()
  }

  const filteredEvents = tariqaEvents.filter(event => {
    if (filter === 'upcoming') return isFutureEvent(event.date)
    if (filter === 'past') return !isFutureEvent(event.date)
    return true
  })

  const upcomingCount = tariqaEvents.filter(e => isFutureEvent(e.date)).length
  const pastCount = tariqaEvents.filter(e => !isFutureEvent(e.date)).length

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-elegant font-bold text-gradient mb-6">
            Calendrier de la Hadara
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Événements officiels de la Hadara - COSKAS 2025-2026
          </p>
        </motion.div>

        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tous ({tariqaEvents.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            À venir ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'past'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Passés ({pastCount})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Chargement du calendrier...</div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-3xl overflow-hidden elegant-shadow p-8">
              <div className="text-center">
                <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucun événement trouvé
                </h3>
                <p className="text-gray-600">
                  Le calendrier de la Tariqa sera bientôt disponible
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`bg-white rounded-xl overflow-hidden elegant-shadow hover:shadow-xl transition-shadow ${
                  isFutureEvent(event.date) ? 'border-l-4 border-emerald-600' : 'opacity-75'
                }`}
              >
                <div className={`p-6 ${isFutureEvent(event.date) ? 'bg-gradient-to-br from-emerald-50 to-white' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {event.title}
                      </h3>
                      {event.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <Calendar className={`w-5 h-5 ${isFutureEvent(event.date) ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {isFutureEvent(event.date) && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700">
                      <AlertCircle className="w-4 h-4" />
                      <span>Événement à venir - Planifier en conséquence</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TariqaCalendar
