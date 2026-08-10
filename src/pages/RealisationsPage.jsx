import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Search, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const RealisationLightbox = ({ realisation, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(null)
  const images = realisation.images || []

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goToPrev, goToNext])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > 50) goToPrev()
    else if (delta < -50) goToNext()
    touchStartX.current = null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 flex flex-col"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div>
          <h3 className="font-bold text-lg">{realisation.title}</h3>
          {images.length > 1 && (
            <p className="text-sm text-white/70">{currentIndex + 1} / {images.length}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center relative px-4 sm:px-16 pb-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 1 && (
          <button
            onClick={goToPrev}
            className="flex absolute left-1 sm:left-4 z-10 items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            src={images[currentIndex]}
            alt={`${realisation.title} - photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="flex absolute right-1 sm:right-4 z-10 items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
              aria-label={`Aller à l'image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {realisation.description && (
        <div
          className="flex-shrink-0 max-h-[30vh] overflow-y-auto px-4 sm:px-6 pb-6"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/90 whitespace-pre-line">
            {realisation.description}
          </p>
        </div>
      )}
    </motion.div>
  )
}

const RealisationsPage = () => {
  const [realisations, setRealisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRealisation, setSelectedRealisation] = useState(null)

  useEffect(() => {
    fetchRealisations()
  }, [])

  const fetchRealisations = async () => {
    try {
      const realisationsQuery = query(collection(db, 'realisations'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(realisationsQuery)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setRealisations(data)
    } catch (error) {
      console.error('Error fetching realisations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRealisations = realisations.filter(r =>
    r.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-elegant font-bold text-gradient mb-6">
              Nos Réalisations
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Découvrez les projets et actions menés par Usratul Amine
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une réalisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
          </motion.div>

          {filteredRealisations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune réalisation trouvée</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRealisations.map((realisation, index) => (
                <motion.button
                  key={realisation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => setSelectedRealisation(realisation)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 text-left"
                >
                  <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                    {realisation.images?.[0] ? (
                      <img
                        src={realisation.images[0]}
                        alt={realisation.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {realisation.images?.length > 1 && (
                      <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-black/60 text-white rounded-full">
                        <ImageIcon className="w-3.5 h-3.5" />
                        {realisation.images.length}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{realisation.title}</h3>
                    {realisation.description && (
                      <p className="text-sm text-gray-600 line-clamp-4">{realisation.description}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />

      <AnimatePresence>
        {selectedRealisation && (
          <RealisationLightbox
            realisation={selectedRealisation}
            onClose={() => setSelectedRealisation(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default RealisationsPage
