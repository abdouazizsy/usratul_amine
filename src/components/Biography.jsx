import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BookOpen, Heart, Crown, Users, Star, Play, X } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Biography = () => {
  const { t, language } = useTranslation()
  const [isDocumentaryOpen, setIsDocumentaryOpen] = useState(false)

  const documentaryVideoId = '6pOuakMf3Dw'
  const documentaryTitle = 'DOCUMENTAIRE AL AMINE : LE KHALIF TÉMOIN'
  const documentaryUrl = `https://www.youtube.com/watch?v=${documentaryVideoId}`
  const documentaryEmbedUrl = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1'
    })
    return `https://www.youtube-nocookie.com/embed/${documentaryVideoId}?${params.toString()}`
  }, [])
  const documentaryThumbnail = `https://i.ytimg.com/vi/${documentaryVideoId}/maxresdefault.jpg`

  useEffect(() => {
    if (!isDocumentaryOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsDocumentaryOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isDocumentaryOpen])
  
  const achievements = [
    {
      icon: Crown,
      titleKey: "biography.achievements.khalife.title",
      descKey: "biography.achievements.khalife.desc"
    },
    {
      icon: Award,
      titleKey: "biography.achievements.coskas.title",
      descKey: "biography.achievements.coskas.desc"
    },
    {
      icon: BookOpen,
      titleKey: "biography.achievements.scholar.title",
      descKey: "biography.achievements.scholar.desc"
    },
    {
      icon: Heart,
      titleKey: "biography.achievements.mediator.title",
      descKey: "biography.achievements.mediator.desc"
    }
  ]

  const timeline = [
    { year: "1928", eventKey: "biography.timeline.birth" },
    { year: "1968", eventKey: "biography.timeline.coskas" },
    { year: "2017", eventKey: "biography.timeline.khalife" }
  ]

  return (
    <section id="biography" className="py-24 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-elegant font-bold text-gradient mb-6 ${
            language === 'ar' ? 'font-arabic' : ''
          }`}>
            {t('biography.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
          <p className={`text-xl text-gray-700 max-w-2xl mx-auto ${
            language === 'ar' ? 'font-arabic' : ''
          }`}>
            {t('biography.subtitle')}
          </p>
        </motion.div>

        {/* Photo and Introduction */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden elegant-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-gold-600/20"></div>
              <img 
                src="/serigne.jpeg" 
                alt="Serigne Abdou Aziz Sy Al Amine" 
                className="w-full h-[600px] object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect width="400" height="600" fill="%23047857"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="white" text-anchor="middle" dy=".3em"%3ESerigne Abdou Aziz Sy Al Amine%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
            
            {/* Decorative frame corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-gold-500 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-gold-500 rounded-br-3xl"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 elegant-shadow">
              <h3 className={`text-2xl font-elegant font-bold text-emerald-800 mb-4 flex items-center gap-3 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                <Star className="w-6 h-6 text-gold-600" />
                {t('biography.section1Title')}
              </h3>
              <div className={`space-y-4 text-gray-700 leading-relaxed ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                <p>{t('biography.intro1')}</p>
                <p>{t('biography.intro2')}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-br from-emerald-50 to-gold-50 rounded-2xl p-6 elegant-shadow">
              <h4 className="text-lg font-bold text-emerald-800 mb-4">Dates clés</h4>
              <div className="space-y-3">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-gold-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{item.year}</span>
                    </div>
                    <p className={`text-gray-700 font-medium ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t(item.eventKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="max-w-5xl mx-auto mb-10">
            <motion.button
              type="button"
              onClick={() => setIsDocumentaryOpen(true)}
              whileHover={{ y: -4 }}
              className="w-full text-left bg-white rounded-3xl overflow-hidden elegant-shadow hover:shadow-2xl transition-shadow"
            >
              <div className="relative w-full aspect-video bg-black">
                <img
                  src={documentaryThumbnail}
                  alt={documentaryTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://i.ytimg.com/vi/${documentaryVideoId}/hqdefault.jpg`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-6 rounded-full bg-white/10 blur-xl" />
                    <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl">
                      <Play className="w-9 h-9 text-white" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-5 left-5">
                  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Documentaire
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className={`text-2xl md:text-3xl font-elegant font-bold text-white ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>
                    {documentaryTitle}
                  </h3>
                  <p className={`text-white/85 mt-2 max-w-3xl ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>
                    Un film à regarder absolument — cliquez pour lancer le mode cinéma.
                  </p>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-gradient-to-r from-emerald-600 to-gold-600 text-white font-semibold shadow-lg">
                      <Play className="w-5 h-5" />
                      Lancer le documentaire
                    </div>
                    <a
                      href={documentaryUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/15 transition-colors"
                    >
                      Ouvrir sur YouTube
                    </a>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

          {isDocumentaryOpen && (
            <div
              className="fixed inset-0 z-[9999]"
              role="dialog"
              aria-modal="true"
              aria-label={documentaryTitle}
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                aria-label="Fermer"
                onClick={() => setIsDocumentaryOpen(false)}
              />

              <div className="relative z-10 h-full w-full flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-5xl">
                  <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-black via-black to-black/80">
                      <div className="min-w-0">
                        <div className="text-white font-semibold truncate">{documentaryTitle}</div>
                        <div className="text-white/70 text-sm truncate">Mode cinéma</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDocumentaryOpen(false)}
                        className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors"
                        aria-label="Fermer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="relative w-full aspect-video bg-black">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={documentaryEmbedUrl}
                        title={documentaryTitle}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h3 className={`text-3xl font-elegant font-bold text-center text-emerald-800 mb-10 ${
            language === 'ar' ? 'font-arabic' : ''
          }`}>
            {t('biography.heritage')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 elegant-shadow hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-gold-600 flex items-center justify-center mb-4">
                  <achievement.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className={`text-lg font-bold text-emerald-800 mb-2 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}>{t(achievement.titleKey)}</h4>
                <p className={`text-gray-600 text-sm leading-relaxed ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}>{t(achievement.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Biography Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Khalifat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-3xl p-8 elegant-shadow"
          >
            <h3 className={`text-2xl font-elegant font-bold text-emerald-800 mb-6 flex items-center gap-3 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              <Crown className="w-6 h-6 text-gold-600" />
              {t('biography.section2Title')}
            </h3>
            <div className={`space-y-4 text-gray-700 leading-relaxed ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              <p>{t('biography.khalifat1')}</p>
              <p>{t('biography.khalifat2')}</p>
              <p>{t('biography.khalifat3')}</p>
            </div>
          </motion.div>

          {/* Personality */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-3xl p-8 elegant-shadow"
          >
            <h3 className={`text-2xl font-elegant font-bold text-emerald-800 mb-6 flex items-center gap-3 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              <Heart className="w-6 h-6 text-gold-600" />
              {t('biography.section3Title')}
            </h3>
            <div className={`space-y-4 text-gray-700 leading-relaxed ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              <p>{t('biography.personality1')}</p>
              <p>{t('biography.personality2')}</p>
              <p>{t('biography.personality3')}</p>
              <p>{t('biography.personality4')}</p>
              <p className="italic pt-4 border-t border-gray-200">{t('biography.personality5')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Biography
