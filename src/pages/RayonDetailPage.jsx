import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { rayonBooks } from '../data/rayonBooks'

const RayonDetailPage = () => {
  const { rayonId } = useParams()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [previewBook, setPreviewBook] = useState(null)

  const shelfData = t(`library.shelves.${rayonId}`)
  const books = rayonBooks[rayonId] || []

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-32 pb-24 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la bibliothèque
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-10 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl"
          >
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{shelfData.number}</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                {shelfData.titleAr}
              </h1>
              <p className="text-gray-600">{shelfData.titleFr} — {shelfData.description}</p>
            </div>
          </motion.div>

          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={book.image}
                      alt={book.titleFr}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    {book.titleAr && (
                      <p className="text-right text-gray-800 font-semibold mb-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                        {book.titleAr}
                      </p>
                    )}
                    <h3 className="text-emerald-800 font-bold mb-1">{book.titleFr}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex-grow">{book.author}</p>
                    <button
                      onClick={() => setPreviewBook(book)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      Aperçu
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-xl text-gray-600">Les ouvrages de ce rayon seront ajoutés très prochainement, in shā' Allāh.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />

      <AnimatePresence>
        {previewBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewBook(null)}
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
                onClick={() => setPreviewBook(null)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewBook.image}
                alt={previewBook.titleFr}
                className="w-full max-h-[70vh] object-contain rounded-xl shadow-2xl bg-black/20"
              />
              <p className="text-white text-center mt-4 font-semibold">{previewBook.titleFr}</p>
              <button
                onClick={() => setPreviewBook(null)}
                className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RayonDetailPage
