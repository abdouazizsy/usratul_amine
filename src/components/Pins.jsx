import React from 'react'
import { motion } from 'framer-motion'
import { Award, ShoppingCart, Phone } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Pins = () => {
  const { t, language } = useTranslation()

  return (
    <section className="py-12 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 md:p-8 elegant-shadow"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Image Section */}
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-emerald-100 to-gold-100 p-2 shadow-xl">
                  <img 
                    src="/pins.jpg" 
                    alt="Pins Usratul Amine"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-full h-full rounded-xl bg-gradient-to-br from-emerald-600 to-gold-600 items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="flex-1 text-center md:text-left">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-2xl md:text-3xl font-bold text-gradient mb-2 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}
              >
                {t('pins.title')}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`text-lg md:text-xl font-semibold text-emerald-700 italic mb-3 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}
              >
                « {t('pins.slogan')} »
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`text-base text-gray-700 mb-4 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}
              >
                {t('pins.description')}
              </motion.p>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-gold-600 text-white px-5 py-2.5 rounded-full font-bold text-base shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className={language === 'ar' ? 'font-arabic' : ''}>
                    {t('pins.price')}
                  </span>
                </motion.div>

                <motion.a
                  href="tel:+221771082626"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-white border-2 border-emerald-600 text-emerald-700 px-5 py-2.5 rounded-full font-bold text-base shadow-md hover:shadow-lg transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span className={language === 'ar' ? 'font-arabic' : ''}>
                    {t('pins.order')} {t('pins.phoneNumber')}
                  </span>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pins
