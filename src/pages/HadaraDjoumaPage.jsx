import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Search, Sparkles, Star, X } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const HadaraDjoumaPage = () => {
  const [hadaraEvents, setHadaraEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchHadaraEvents()
  }, [])

  const fetchHadaraEvents = async () => {
    try {
      const hadaraQuery = query(collection(db, 'hadara_djouma_events'), orderBy('date', 'asc'))
      const querySnapshot = await getDocs(hadaraQuery)
      const hadaraData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setHadaraEvents(hadaraData)
    } catch (error) {
      console.error('Error fetching hadara events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatShortDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      weekday: date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()
    }
  }

  const isFutureEvent = (dateString) => {
    return new Date(dateString) > new Date()
  }

  const filteredEvents = hadaraEvents.filter(event => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const futureEvents = filteredEvents.filter(event => isFutureEvent(event.date))
  const pastEvents = filteredEvents.filter(event => !isFutureEvent(event.date))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-gold-700">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement des Abna'u Hadara Tidiani...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-gold-50">
      <Navigation scrolled={true} />
      
      <section className="py-24 relative overflow-hidden">
        {/* Background animé */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* En-tête époustouflant */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-gold-600 blur-2xl opacity-40 animate-pulse"></div>
                <h1 className="relative text-5xl md:text-7xl font-elegant font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-gold-600 bg-clip-text text-transparent">
                  Hadaratoul Jumu'ah
                </h1>
              </div>
            </div>
            
            <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-gold-600 mx-auto mb-8 rounded-full"></div>
            
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-4 font-medium">
              Calendrier Annuel 2026/2027
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ABNAA-UL HADARATI-T - TIJAANIYATI NATIONAL
            </p>
            <p className="text-md text-gray-500 mt-2 italic">
              JATAAYU DO MI TIIJAAN YI
            </p>
          </motion.div>

          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-emerald-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une Hadara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/50"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-emerald-700">{filteredEvents.length}</span> Hadara{filteredEvents.length > 1 ? 's' : ''} 
                  {futureEvents.length > 0 && (
                    <span className="ml-2">
                      • <span className="font-bold text-emerald-600">{futureEvents.length}</span> à venir
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hadaras à venir - Design époustouflant */}
          {futureEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-10">
                <Sparkles className="w-6 h-6 text-gold-600 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-gold-600 bg-clip-text text-transparent">
                  Hadaras à venir
                </h2>
                <Sparkles className="w-6 h-6 text-gold-600 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {futureEvents.map((event, index) => {
                  const shortDate = formatShortDate(event.date)
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.03 }}
                      onClick={() => setSelectedEvent(event)}
                      className="group relative cursor-pointer"
                    >
                      {/* Effet de brillance au hover */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-gold-600 rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                      
                      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 h-full">
                        {/* En-tête avec dégradé */}
                        <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-gold-600 p-5 overflow-hidden">
                          {/* Motif islamique */}
                          <div className="absolute inset-0 islamic-pattern opacity-20"></div>
                          
                          {/* Date en grand */}
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="text-white">
                              <div className="text-xs font-semibold opacity-90 mb-1">
                                {shortDate.weekday}
                              </div>
                              <div className="text-4xl font-bold leading-none">
                                {shortDate.day}
                              </div>
                              <div className="text-sm font-semibold opacity-90 mt-1">
                                {shortDate.month} {shortDate.year}
                              </div>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Star className="w-7 h-7 text-gold-200 fill-current" />
                            </div>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[3.5rem]">
                            {event.title}
                          </h3>

                          {event.location && (
                            <div className="flex items-center gap-2 text-gray-600 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-gold-100 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 text-emerald-700" />
                              </div>
                              <span className="text-sm font-medium truncate">{event.location}</span>
                            </div>
                          )}

                          {/* Bouton */}
                          <button className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-emerald-700 to-gold-600 text-white rounded-xl font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            Voir les détails
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Hadaras passées */}
          {pastEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">
                Hadaras Passées
              </h2>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pastEvents.map((event) => (
                    <div 
                      key={event.id} 
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* État vide */}
          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-block p-6 bg-gradient-to-br from-emerald-100 to-gold-100 rounded-full mb-4">
                <Sparkles className="w-16 h-16 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Aucune Hadara trouvée
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Essayez avec un autre terme de recherche' : 'Les Hadaras seront bientôt disponibles'}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modale de détails */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* En-tête avec dégradé */}
              <div className="relative h-40 bg-gradient-to-br from-emerald-700 via-emerald-600 to-gold-600 overflow-hidden">
                <div className="absolute inset-0 islamic-pattern opacity-20"></div>
                <div className="relative z-10 h-full flex items-center justify-between px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Star className="w-7 h-7 text-gold-200 fill-current" />
                    </div>
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                        ABNA'U HADARA TIDIANI
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {selectedEvent.title}
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-gold-50 rounded-xl border border-emerald-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700 font-medium uppercase">Date</p>
                      <p className="text-sm font-bold text-gray-900">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gold-50 to-amber-50 rounded-xl border border-gold-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-600 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gold-700 font-medium uppercase">Lieu</p>
                        <p className="text-sm font-bold text-gray-900">{selectedEvent.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-700 via-emerald-600 to-gold-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all shadow-lg"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default HadaraDjoumaPage
