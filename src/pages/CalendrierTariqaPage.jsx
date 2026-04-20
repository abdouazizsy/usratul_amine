import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Filter, Search, Sparkles, AlertTriangle, X } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const CalendrierTariqaPage = () => {
  const [tariqaEvents, setTariqaEvents] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Récupérer les événements Tariqa
      const tariqaQuery = query(collection(db, 'tariqa_events'), orderBy('date', 'asc'))
      const tariqaSnapshot = await getDocs(tariqaQuery)
      const tariqaData = tariqaSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTariqaEvents(tariqaData)

      // Récupérer les programmes Usratul Amine pour détecter les conflits
      const programsQuery = query(collection(db, 'programs'), orderBy('date', 'asc'))
      const programsSnapshot = await getDocs(programsQuery)
      const programsData = programsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPrograms(programsData)
    } catch (error) {
      console.error('Error fetching data:', error)
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

  const isFutureEvent = (dateString) => {
    return new Date(dateString) > new Date()
  }

  const hasConflict = (eventDate) => {
    return programs.some(program => program.date === eventDate)
  }

  const categories = ['all', 'COSKAS', 'TAMKHARITE', 'AUTRES']

  const filteredEvents = tariqaEvents.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const futureEvents = filteredEvents.filter(event => isFutureEvent(event.date))
  const pastEvents = filteredEvents.filter(event => !isFutureEvent(event.date))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement du calendrier...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />
      
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-elegant font-bold text-gradient mb-6">
              Calendrier de la Hadara
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Découvrez les événements officiels de la Hadara Tijaniyya
            </p>
          </motion.div>

          {/* Filtres et recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un événement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Filtres par catégorie */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? 'Tous' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compteur */}
              <div className="mt-4 text-sm text-gray-600 text-center">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>

          {/* Événements à venir */}
          {futureEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                <h2 className="text-3xl font-bold text-emerald-800">
                  Événements à venir
                </h2>
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {futureEvents.map((event, index) => {
                  const conflict = hasConflict(event.date)
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative bg-gradient-to-br from-white to-emerald-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Barre supérieure */}
                      <div className={`h-2 ${
                        conflict 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                          : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500'
                      }`} />
                      
                      <div className="p-6">
                        {/* Badges */}
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            À VENIR
                          </span>
                          {event.category && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              {event.category}
                            </span>
                          )}
                        </div>

                        {/* Alerte conflit */}
                        {conflict && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700 font-medium">
                              Conflit avec un programme Usratul Amine
                            </p>
                          </div>
                        )}

                        {/* Titre */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                          {event.title}
                        </h3>

                        {/* Date */}
                        <div className="mb-4 p-3 bg-white rounded-xl border-2 border-emerald-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm font-semibold text-emerald-800">
                              {formatDate(event.date)}
                            </p>
                          </div>
                        </div>

                        {/* Lieu */}
                        {event.location && (
                          <div className="flex items-center gap-2 text-gray-700 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium">{event.location}</span>
                          </div>
                        )}

                        {/* Description */}
                        {event.description && (
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        )}

                        {/* Bouton détails */}
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                          <span className="text-sm font-semibold">Voir les détails</span>
                        </button>
                      </div>

                      {/* Effet de brillance */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Événements passés */}
          {pastEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-600 mb-6 text-center">
                Événements passés
              </h2>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="space-y-3">
                  {pastEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-500">
                          {formatDate(event.date)} • {event.location}
                        </p>
                      </div>
                      {event.category && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          {event.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {pastEvents.length > 10 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      ... et {pastEvents.length - 10} autre{pastEvents.length - 10 > 1 ? 's' : ''} événement{pastEvents.length - 10 > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Message si aucun événement */}
          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun événement trouvé</p>
              <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos filtres</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modale de détails */}
      {selectedEvent && (
        <div
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
            {/* En-tête */}
            <div className="relative h-32 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-t-3xl overflow-hidden">
              <div className="absolute inset-0 islamic-pattern opacity-20"></div>
              <div className="relative z-10 h-full flex items-center justify-between px-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  HADARA
                </span>
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
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-medium uppercase">Date</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 font-medium uppercase">Lieu</p>
                      <p className="text-sm font-bold text-gray-900">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
      <Chatbot />
    </div>
  )
}

export default CalendrierTariqaPage
