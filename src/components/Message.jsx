import React from 'react'
import { motion } from 'framer-motion'
import { Quote, Heart } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Message = () => {
  const { t, language } = useTranslation()
  return (
    <section id="message" className="py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-elegant font-bold text-white mb-6 ${
            language === 'ar' ? 'font-arabic' : ''
          }`}>
            {t('message.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mb-8"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 elegant-shadow border border-white/20">
            <Quote className="w-12 h-12 text-gold-400 mb-6" />
            
            <div className={`space-y-6 text-emerald-50 text-lg leading-relaxed ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              <p className="font-semibold text-gold-300 text-xl">
                {t('message.para1')}
              </p>
              
              <p>{t('message.para2')}</p>

              <p>{t('message.para3')}</p>

              <p>{t('message.para4')}</p>

              <p>{t('message.para5')}</p>

              <p className="text-gold-300 font-semibold text-xl pt-4">
                {t('message.para6')}
              </p>

              <p>{t('message.para7')}</p>

              <p className="italic pt-6 border-t border-white/20">
                {t('message.para8')}
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/20 flex items-center gap-4">
              <Heart className="w-6 h-6 text-gold-400 flex-shrink-0" />
              <div>
                <p className={`text-gold-300 font-semibold text-lg ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}>Serigne Sidy Ahmed Sy Al Amine</p>
                <p className={`text-emerald-200 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}>{t('message.signature')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Message
