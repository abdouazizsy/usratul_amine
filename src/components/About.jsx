import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Heart, Users, Star } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const About = () => {
  const { t, language } = useTranslation()
  
  const values = [
    {
      icon: BookOpen,
      titleKey: "about.values.education.title",
      descKey: "about.values.education.desc"
    },
    {
      icon: Heart,
      titleKey: "about.values.heritage.title",
      descKey: "about.values.heritage.desc"
    },
    {
      icon: Users,
      titleKey: "about.values.community.title",
      descKey: "about.values.community.desc"
    },
    {
      icon: Star,
      titleKey: "about.values.excellence.title",
      descKey: "about.values.excellence.desc"
    }
  ]

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-30"></div>
      
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
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-emerald-50 to-gold-50 rounded-3xl p-8 md:p-12 elegant-shadow">
            <p className={`text-lg leading-relaxed text-gray-700 mb-6 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              {t('about.intro1')}
            </p>
            <p className={`text-lg leading-relaxed text-gray-700 mb-6 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              {t('about.intro2')}
            </p>
            <p className={`text-lg leading-relaxed text-gray-700 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              {t('about.intro3')}
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-6 elegant-shadow hover:shadow-2xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-gold-600 flex items-center justify-center mb-4">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-xl font-bold text-emerald-800 mb-3 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>{t(value.titleKey)}</h3>
              <p className={`text-gray-600 leading-relaxed ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>{t(value.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
