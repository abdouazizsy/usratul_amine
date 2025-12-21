import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Memories = () => {
  const { language } = useTranslation()
  const [selected, setSelected] = useState(null)

  const photos = [
    { src: '/72h/photo1.jpg', alt: 'Souvenir des 72h - 1' },
    { src: '/72h/photo2.jpg', alt: 'Souvenir des 72h - 2' },
    { src: '/72h/photo3.jpg', alt: 'Souvenir des 72h - 3' },
    { src: '/72h/photo4.jpg', alt: 'Souvenir des 72h - 4' },
    { src: '/72h/photo5.jpg', alt: 'Souvenir des 72h - 5' },
    { src: '/72h/photo6.jpg', alt: 'Souvenir des 72h - 6' },
    { src: '/72h/photo7.jpg', alt: 'Souvenir des 72h - 7' },
    { src: '/72h/photo8.jpg', alt: 'Souvenir des 72h - 8' },
    { src: '/72h/photo9.jpg', alt: 'Souvenir des 72h - 9' },
    { src: '/72h/photo10.jpg', alt: 'Souvenir des 72h - 10' },
    { src: '/72h/photo11.jpg', alt: 'Souvenir des 72h - 11' },
    { src: '/72h/photo12.jpg', alt: 'Souvenir des 72h - 12' },
    { src: '/72h/photo13.jpg', alt: 'Souvenir des 72h - 13' },
    { src: '/72h/photo14.jpg', alt: 'Souvenir des 72h - 14' },
    { src: '/72h/photo15.jpg', alt: 'Souvenir des 72h - 15' },
    { src: '/72h/photo16.jpg', alt: 'Souvenir des 72h - 16' },
    { src: '/72h/photo17.jpg', alt: 'Souvenir des 72h - 17' },
    { src: '/72h/photo18.jpg', alt: 'Souvenir des 72h - 18' },
    { src: '/72h/photo19.jpg', alt: 'Souvenir des 72h - 19' },
    { src: '/72h/photo20.jpg', alt: 'Souvenir des 72h - 20' }
  ]

  const goToPrevious = () => {
    if (!selected) return
    const newIndex = selected.index === 0 ? photos.length - 1 : selected.index - 1
    setSelected({ ...photos[newIndex], index: newIndex })
  }

  const goToNext = () => {
    if (!selected) return
    const newIndex = selected.index === photos.length - 1 ? 0 : selected.index + 1
    setSelected({ ...photos[newIndex], index: newIndex })
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className={`text-4xl md:text-5xl font-elegant font-bold text-gradient mb-4 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}
          >
            Souvenirs des 72h
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-6" />
          <p
            className={`text-lg md:text-xl text-gray-700 max-w-2xl mx-auto ${
              language === 'ar' ? 'font-arabic' : ''
            }`}
          >
            Quelques instants capturés pour revivre l’ambiance spirituelle et fraternelle de ces journées bénies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {/* Colonne principale gauche : grande photo */}
          {photos[0] && (
            <motion.button
              type="button"
              onClick={() => setSelected({ ...photos[0], index: 0 })}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl overflow-hidden bg-slate-200 shadow-lg hover:shadow-2xl transition-shadow lg:row-span-2"
            >
              <div className="aspect-[3/4] lg:aspect-[3/4] w-full overflow-hidden">
                <img
                  src={photos[0].src}
                  alt={photos[0].alt}
                  className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect width="400" height="500" fill="%23047857"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="white" text-anchor="middle" dy=".3em"%3EPhoto souvenir%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <p className="text-sm md:text-base font-medium line-clamp-2">Souvenir des 72h</p>
                <span className="text-xs px-2 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm">
                  Voir
                </span>
              </div>
            </motion.button>
          )}

          {/* Mosaïque droite : quelques photos + tuile "+N" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 lg:col-span-2">
            {photos.slice(1, 5).map((photo, index) => {
              const realIndex = index + 1
              const remaining = photos.length - 5
              const isLastVisible = index === 3 && remaining > 0

              return (
                <motion.button
                  key={photo.src}
                  type="button"
                  onClick={() => setSelected({ ...photo, index: realIndex })}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-3xl overflow-hidden bg-slate-200 shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23047857"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="white" text-anchor="middle" dy=".3em"%3EPhoto souvenir%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <p className="text-sm font-medium line-clamp-2">Souvenir des 72h</p>
                    {isLastVisible && remaining > 0 ? (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm font-semibold">
                        +{remaining}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm">
                        Voir
                      </span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute -top-12 left-0 text-white text-sm">
                {selected.index + 1} / {photos.length}
              </div>

              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white hover:bg-gray-100 shadow-xl text-gray-900 transition-all hover:scale-110"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white hover:bg-gray-100 shadow-xl text-gray-900 transition-all hover:scale-110"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-7 h-7" />
              </button>

              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black">
                <img
                  src={selected.src}
                  alt={selected.alt}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Memories
