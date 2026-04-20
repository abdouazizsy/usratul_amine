import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Calendar, Clock, MapPin, Users, Sparkles, ArrowRight } from 'lucide-react'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { db } from '../firebase/config'

const ProgramDynamic = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [openProgram, setOpenProgram] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState(null)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const programsQuery = query(collection(db, 'programs'), orderBy('date', 'asc'))
      const querySnapshot = await getDocs(programsQuery)
      const programsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPrograms(programsData)
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('fr-FR', options)
  }

  const isFutureProgram = (dateString) => {
    return new Date(dateString) > new Date()
  }

  const futurePrograms = programs.filter(program => isFutureProgram(program.date))
  const pastPrograms = programs.filter(program => !isFutureProgram(program.date))

  if (loading) {
    return (
      <section id="program" className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500">Chargement des programmes...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="program" className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
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
            Programme
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
          {programs.length > 0 ? (
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Découvrez nos prochains événements et activités
            </p>
          ) : (
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Les prochains événements seront annoncés ici, in shā' Allāh.
            </p>
          )}
        </motion.div>

        {futurePrograms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <h3 className="text-3xl font-bold text-emerald-800">
                Programmes à venir
              </h3>
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futurePrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-white to-emerald-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Barre supérieure avec dégradé */}
                  <div className="h-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500"></div>
                  
                  <div className="p-6">
                    {/* Badge "À venir" */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        À VENIR
                      </span>
                    </div>

                    {/* Titre */}
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                      {program.title}
                    </h4>

                    {/* Date mise en évidence */}
                    <div className="mb-4 p-3 bg-white rounded-xl border-2 border-emerald-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm font-semibold text-emerald-800">
                          {formatDate(program.date)}
                        </p>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{program.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">{program.location}</span>
                      </div>
                      {program.participants && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="text-sm font-medium">{program.participants}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    </div>

                    {/* Bouton voir plus */}
                    <button 
                      onClick={() => setSelectedProgram(program)}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors group-hover:shadow-lg"
                    >
                      <span className="text-sm font-semibold">Voir les détails</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {pastPrograms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-600 mb-6 text-center">
              Programmes passés
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden elegant-shadow">
              <div className="relative h-32 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-gray-300 text-sm uppercase tracking-[0.2em] mb-2">
                    Archives
                  </p>
                  <p className="text-white text-xl font-elegant font-bold">
                    {pastPrograms.length} programme{pastPrograms.length > 1 ? 's' : ''} terminé{pastPrograms.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {pastPrograms.slice(0, 5).map((program) => (
                    <div key={program.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <h4 className="font-medium text-gray-800">{program.title}</h4>
                        <p className="text-sm text-gray-500">{formatDate(program.date)} • {program.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{program.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {pastPrograms.length > 5 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      ... et {pastPrograms.length - 5} autre{pastPrograms.length - 5 > 1 ? 's' : ''} programme{pastPrograms.length - 5 > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {programs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Carte principale */}
            <div className="relative bg-gradient-to-br from-white via-emerald-50 to-white rounded-3xl overflow-hidden shadow-2xl">
              {/* Motif de fond */}
              <div className="absolute inset-0 islamic-pattern opacity-5"></div>
              
              {/* Cercles décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 p-8 md:p-12">
                {/* Icône centrale */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  className="flex justify-center mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                      <Calendar className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Titre */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Aucun programme prévu
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-gold-500 mx-auto rounded-full mb-6"></div>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Les prochains événements seront annoncés ici, <span className="font-semibold text-emerald-700">in shā' Allāh</span>.
                  </p>
                </motion.div>

                {/* Cartes d'information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="grid md:grid-cols-2 gap-6 mt-10"
                >
                  {/* Carte 1 */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Restez informés</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Les informations seront partagées dès qu'elles seront disponibles via nos canaux habituels.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Carte 2 */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-gold-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Rejoignez-nous</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Consultez régulièrement cette page pour ne manquer aucun événement à venir.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Message de patience */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mt-8 text-center"
                >
                  <p className="text-sm text-gray-500 italic">
                    "La patience est une lumière" - Prophète Muhammad ﷺ
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modale de détails */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProgram(null)}
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
              <div className="relative h-32 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-t-3xl overflow-hidden">
                <div className="absolute inset-0 islamic-pattern opacity-20"></div>
                <div className="relative z-10 h-full flex items-center justify-between px-8">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      PROGRAMME
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8">
                {/* Titre */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {selectedProgram.title}
                </h2>

                {/* Informations principales */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-medium uppercase">Date</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatDate(selectedProgram.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase">Heure</p>
                      <p className="text-sm font-bold text-gray-900">{selectedProgram.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 font-medium uppercase">Lieu</p>
                      <p className="text-sm font-bold text-gray-900">{selectedProgram.location}</p>
                    </div>
                  </div>

                  {selectedProgram.participants && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-orange-600 font-medium uppercase">Participants</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProgram.participants}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description complète */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedProgram.description}
                    </p>
                  </div>
                </div>

                {/* Bouton de fermeture */}
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProgramDynamic
