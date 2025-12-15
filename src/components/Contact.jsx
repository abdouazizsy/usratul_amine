import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Contact = () => {
  const { t, language } = useTranslation()
  
  const contactInfo = [
    {
      icon: Phone,
      titleKey: "contact.phone",
      valueKey: "contact.phoneNumber",
      link: "tel:+221771082626"
    },
    {
      icon: Globe,
      titleKey: "contact.website",
      value: "www.zawiya.sn",
      link: "https://www.zawiya.sn"
    },
    {
      icon: MapPin,
      titleKey: "contact.address",
      value: "Tivaouane, Sénégal",
      link: null
    },
    {
      icon: Mail,
      title: "Zawiya TV",
      valueKey: "contact.zawiya",
      link: "https://www.zawiya.sn"
    }
  ]

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
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
            {t('contact.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
          <p className={`text-xl text-gray-700 max-w-2xl mx-auto ${
            language === 'ar' ? 'font-arabic' : ''
          }`}>
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-br from-emerald-50 to-gold-50 rounded-2xl p-6 elegant-shadow hover:shadow-xl transition-all h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-gold-600 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold text-emerald-800 mb-2 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{item.titleKey ? t(item.titleKey) : item.title}</h3>
                  <p className={`text-gray-700 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{item.valueKey ? t(item.valueKey) : item.value}</p>
                </a>
              ) : (
                <div className="bg-gradient-to-br from-emerald-50 to-gold-50 rounded-2xl p-6 elegant-shadow h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-gold-600 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold text-emerald-800 mb-2 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{item.titleKey ? t(item.titleKey) : item.title}</h3>
                  <p className={`text-gray-700 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{item.valueKey ? t(item.valueKey) : item.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl p-8 md:p-12 elegant-shadow text-center">
            <h3 className={`text-2xl md:text-3xl font-elegant font-bold text-white mb-4 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              {t('contact.cta.title')}
            </h3>
            <p className={`text-emerald-100 text-lg leading-relaxed mb-6 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              {t('contact.cta.desc')}
            </p>
            <motion.a
              href="tel:+221771082626"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-white rounded-full font-semibold text-lg shadow-xl hover:bg-gold-600 transition-colors ${
                language === 'ar' ? 'font-arabic' : ''
              }`}
            >
              <Phone className="w-5 h-5" />
              {t('contact.cta.button')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
