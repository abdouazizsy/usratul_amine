import React from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, Mail, Globe, Heart, Book, Users, Calendar } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Footer = () => {
  const { t, language } = useTranslation()
  
  const quickLinks = [
    { nameKey: 'nav.presentation', href: '#about' },
    { nameKey: 'nav.biography', href: '#biography' },
    { nameKey: 'nav.program', href: '#program' },
    { nameKey: 'nav.message', href: '#message' },
    { nameKey: 'nav.contact', href: '#contact' }
  ]

  const values = [
    { icon: Heart, textKey: 'footer.values.spirituality' },
    { icon: Book, textKey: 'footer.values.education' },
    { icon: Users, textKey: 'footer.values.community' }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 islamic-pattern opacity-10"></div>
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-2 shadow-lg overflow-hidden">
                  <img 
                    src="/logo-og-v3.png" 
                    alt="Logo" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-elegant font-bold text-gold-400">Usratul Amine</h3>
                  <p className="text-emerald-200 text-sm font-arabic">أُسْرَةُ الأَمِين</p>
                </div>
              </div>
              <p className={`text-emerald-100 leading-relaxed mb-6 max-w-md ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                {t('footer.about')}
              </p>
              
              {/* Values */}
              <div className="flex flex-wrap gap-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center gap-2 bg-emerald-800/30 backdrop-blur-sm rounded-full px-4 py-2">
                    <value.icon className="w-4 h-4 text-gold-400" />
                    <span className={`text-sm text-emerald-100 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t(value.textKey)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className={`text-lg font-bold mb-6 text-gold-400 flex items-center gap-2 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                <Book className="w-5 h-5" />
                {t('footer.navigation')}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className={`text-emerald-200 hover:text-gold-300 transition-colors flex items-center gap-2 group ${
                        language === 'ar' ? 'font-arabic' : ''
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                      {t(link.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className={`text-lg font-bold mb-6 text-gold-400 flex items-center gap-2 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                <Phone className="w-5 h-5" />
                {t('footer.contact')}
              </h4>
              <div className="space-y-4">
                <a 
                  href="tel:+221771082626"
                  className="flex items-start gap-3 text-emerald-200 hover:text-gold-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/30 flex items-center justify-center group-hover:bg-gold-600/20 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-xs text-emerald-400 mb-1 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t('footer.phone')}</p>
                    <p className={`font-semibold ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t('contact.phoneNumber')}</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-emerald-200">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-xs text-emerald-400 mb-1 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t('footer.location')}</p>
                    <p className="font-semibold">Tivaouane, Sénégal</p>
                  </div>
                </div>

                <a
                  href="https://www.zawiya.sn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-emerald-200 hover:text-gold-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/30 flex items-center justify-center group-hover:bg-gold-600/20 transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-xs text-emerald-400 mb-1 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t('footer.website')}</p>
                    <p className="font-semibold">www.zawiya.sn</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Event Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-gold-600 to-gold-500 rounded-2xl p-6 mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-white">
                  <p className={`font-bold text-lg ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{t('footer.event.title')}</p>
                  <p className={`text-sm opacity-90 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{t('footer.event.dates')}</p>
                </div>
              </div>
              <a
                href="#program"
                className={`px-6 py-3 bg-white text-gold-700 rounded-full font-semibold hover:bg-emerald-50 transition-colors shadow-lg ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}
              >
                {t('footer.event.button')}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800/50 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-emerald-300 font-arabic text-lg mb-2">بسم الله الرحمن الرحيم</p>
              <p className={`text-emerald-400 text-sm ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                © 2025 Usratul Amine. {t('footer.copyright')}
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-emerald-400 text-sm">
              <span className={`flex items-center gap-2 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                <Heart className="w-4 h-4 text-gold-400" />
                {t('footer.made')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom elements */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
    </footer>
  )
}

export default Footer
