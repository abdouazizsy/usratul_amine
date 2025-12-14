import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Library as LibraryIcon, Sparkles } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'

const Library = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const shelves = [
    {
      id: 'tafsir',
      color: 'from-sky-500 to-blue-600',
      icon: '📕',
      image: '/library-tafsir.jpg'
    },
    {
      id: 'hadith',
      color: 'from-amber-500 to-orange-600',
      icon: '📖',
      image: '/library-hadith.jpg'
    },
    {
      id: 'fiqh',
      color: 'from-emerald-500 to-teal-600',
      icon: '⚖️',
      image: '/library-fiqh.jpg'
    },
    {
      id: 'sufism',
      color: 'from-purple-500 to-indigo-600',
      icon: '✨',
      image: '/library-sufism.jpg'
    },
    {
      id: 'language',
      color: 'from-blue-500 to-cyan-600',
      icon: '📚',
      image: '/library-language.jpg'
    },
    {
      id: 'magazines',
      color: 'from-rose-500 to-pink-600',
      icon: '📰',
      image: '/library-magazines.jpg'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <section id="library" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-100 rounded-full">
            <LibraryIcon className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              {t('library.section')}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 via-emerald-700 to-amber-800 bg-clip-text text-transparent">
            {t('library.title')}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('library.subtitle')}
          </p>
        </motion.div>

        {/* Shelves Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {shelves.map((shelf) => {
            const shelfData = t(`library.shelves.${shelf.id}`)
            
            return (
              <motion.div
                key={shelf.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  {/* Shelf Number Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${shelf.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {shelfData.number}
                      </span>
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
                    <div className="absolute inset-0 opacity-10">
                      <div className={`w-full h-full bg-gradient-to-br ${shelf.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-8 min-h-[320px] flex flex-col">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${shelf.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-3xl">{shelf.icon}</span>
                      </div>
                    </div>

                    {/* Arabic Title */}
                    <h3 
                      className="text-2xl font-bold mb-3 text-gray-800 text-right"
                      style={{ fontFamily: "'Amiri', serif" }}
                      dir="rtl"
                    >
                      {shelfData.titleAr}
                    </h3>

                    {/* French Title */}
                    <h4 className="text-lg font-semibold mb-4 text-gray-700">
                      {shelfData.titleFr}
                    </h4>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                      {shelfData.description}
                    </p>

                    {/* Explore Button */}
                    <button className={`mt-auto w-full py-3 px-6 rounded-xl bg-gradient-to-r ${shelf.color} text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3`}>
                      <BookOpen className="w-5 h-5" />
                      <span>Explorer</span>
                    </button>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
                    <div className={`absolute transform rotate-45 translate-x-16 -translate-y-16 w-32 h-32 bg-gradient-to-br ${shelf.color} opacity-10`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <p className="text-lg text-center max-w-3xl">
              {t('library.comingSoon')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Library
