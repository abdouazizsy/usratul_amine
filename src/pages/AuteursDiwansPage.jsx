import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, FileText, Download, BookOpen } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import AuteurBadge from '../components/AuteurBadge'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'

const AuteurModal = ({ auteur, onClose, t }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-gray-600 z-10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center pt-8 pb-6 px-6 bg-gradient-to-b from-emerald-50 to-white flex-shrink-0">
        {auteur.photo && (
          <img
            src={auteur.photo}
            alt={auteur.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 mb-3"
          />
        )}
        <h3 className="text-xl font-bold text-emerald-800 text-center">{auteur.name}</h3>
      </div>

      <div className="px-6 py-6 overflow-y-auto">
        {(auteur.diwans || []).length === 0 ? (
          <p className="text-center text-gray-500 py-8">{t('library.authors.noDocuments')}</p>
        ) : (
          <div className="space-y-2">
            {auteur.diwans.map((docItem, i) => (
              <a
                key={`${docItem.url}-${i}`}
                href={docItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-100 rounded-xl transition-colors group"
              >
                <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{docItem.title}</p>
                  {docItem.sizeMB && <p className="text-xs text-gray-500">{docItem.sizeMB} Mo</p>}
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 flex-shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
)

const AuteursDiwansPage = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [auteurs, setAuteurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAuteur, setSelectedAuteur] = useState(null)

  useEffect(() => {
    const fetchAuteurs = async () => {
      try {
        const auteursQuery = query(collection(db, 'auteurs'), orderBy('createdAt', 'asc'))
        const snapshot = await getDocs(auteursQuery)
        setAuteurs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (error) {
        console.error('Error fetching auteurs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAuteurs()
  }, [])

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
            {t('library.authors.backToLibrary')}
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 via-emerald-700 to-amber-800 bg-clip-text text-transparent">
              {t('library.authors.pageTitle')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('library.authors.pageSubtitle')}
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">{t('library.authors.loading')}</p>
          ) : auteurs.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('library.authors.noAuthors')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 justify-items-center">
              {auteurs.map((auteur) => (
                <AuteurBadge
                  key={auteur.id}
                  name={auteur.name}
                  photo={auteur.photo}
                  onClick={() => setSelectedAuteur(auteur)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />

      <AnimatePresence>
        {selectedAuteur && (
          <AuteurModal auteur={selectedAuteur} onClose={() => setSelectedAuteur(null)} t={t} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuteursDiwansPage
