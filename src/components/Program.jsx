import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, ChevronDown, Users } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Program = () => {
  const { t, language } = useTranslation()
  const [openDay, setOpenDay] = useState('vendredi')
  
  const schedule = {
    vendredi: [
      { time: '09h00 - 13h30', activity: 'Récital du coran au mausolée de Serigne Abdou Aziz Sy Al Amine', participants: 'Les apprenants des différents Daraas' },
      { time: '14h15', activity: 'Prière du vendredi à la mosquée de Serigne Babacar Sy', participants: 'Tous' },
      { time: '14h30', activity: 'Déjeuner', participants: '' },
      { time: '15h00', activity: 'Mise en place au stade Elhadji Moustapha Niang pour la cérémonie du Hadaratul Jumaa', participants: 'COF, ABNA\'U, MUQTAFINA, FEDKAS' },
      { time: '', activity: 'Hadaratul Jumaa', participants: 'Public' }
    ],
    samedi: [
      { time: '09h00', activity: 'Accueil et installation des invités à la grande salle du complexe Seydil Hadji', participants: 'COF' },
      { time: '09h00', activity: 'Mise en place au Stade Elhadji Moustapha Niang', participants: 'Hadaratul Jumaa' },
      { time: '09h30', activity: 'Allocution du Khalife général des Tidianes', participants: '' },
      { time: '10h00', activity: 'Présentation des activités de Usratul Amine', participants: '' },
      { time: '10h30', activity: 'Récital Coran', participants: '' },
      { time: '11h30', activity: 'Adh Sy Al Amine (DFAA)', participants: '' },
      { time: '12h00', activity: 'Récitation sur la vie et l\'œuvre de Serigne Abdou Aziz Sy Al Amine', participants: '' },
      { time: '12h20', activity: 'Présentation des délégations présentes', participants: '' },
      { time: '13h20', activity: 'Présentation des activités de Usratul Amine', participants: 'COF, ABNA\'U, MUQTAFINA, FEDKAS' }
    ],
    dimanche: [
      { time: '09h00', activity: 'Recommandations suivies des prières', participants: '' },
      { time: '11h00', activity: 'Prières et déjeuner', participants: '' },
      { time: '14h00', activity: 'Recommandations et Clôture', participants: 'Le Responsable moral Usratul Amine' },
      { time: '14h30', activity: 'Mise en Place au Stade Elhadji Moustapha Niang', participants: '' },
      { time: '17h00', activity: 'Récital Coran', participants: '' },
      { time: '18h00', activity: 'Activités de recherches et l\'exposition à la bibliothèque "Al Amine"', participants: '' },
      { time: '18h00', activity: 'Final Gamou', participants: '' },
      { time: '21h00', activity: 'Rencontre de tous les membres des USRATUL', participants: 'CSSC' },
      { time: '22h20', activity: 'Location du Khalife fédéral des Tidianes', participants: '' }
    ]
  }
  
  return (
    <section id="program" className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20"></div>
      
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
            {t('program.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto mb-8"></div>
          <p className={`text-xl text-gray-700 max-w-2xl mx-auto ${
            language === 'ar' ? 'font-arabic' : ''
          }`}>
            {t('program.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl overflow-hidden elegant-shadow">
            {/* Header with event image placeholder */}
            <div className="relative h-64 bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
              <div className="absolute inset-0 islamic-pattern opacity-20"></div>
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-8xl mb-4"
                >
                  🕌
                </motion.div>
                <p className="text-white text-2xl font-elegant font-bold">Usratul Amine</p>
                <p className="text-gold-300 text-lg mt-2">À Tivaouane</p>
              </div>
            </div>

            {/* Event details */}
            <div className="p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold text-emerald-800 mb-2 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t('program.dates')}</h3>
                    <p className="text-3xl font-elegant font-bold text-emerald-700 mb-2">19 - 20 - 21</p>
                    <p className="text-2xl font-elegant text-gold-600">DÉCEMBRE 2025</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold-700" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold text-emerald-800 mb-2 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t('program.location')}</h3>
                    <p className={`text-xl text-gray-700 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>Tivaouane, Sénégal</p>
                    <p className={`text-gray-600 mt-1 ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>{t('program.locationDesc')}</p>
                  </div>
                </div>

                {/* Programme détaillé par jour avec accordéons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className={`text-2xl font-bold text-emerald-800 mb-6 text-center ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>
                    {t('program.detailedSchedule')}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Vendredi */}
                    <div className="border border-emerald-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenDay(openDay === 'vendredi' ? '' : 'vendredi')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-gold-50 hover:from-emerald-100 hover:to-gold-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-emerald-700" />
                          <span className={`font-bold text-emerald-800 ${
                            language === 'ar' ? 'font-arabic' : ''
                          }`}>{t('program.friday')}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-emerald-700 transition-transform ${openDay === 'vendredi' ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openDay === 'vendredi' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white space-y-3">
                              {schedule.vendredi.map((item, index) => (
                                <div key={index} className="flex gap-4 p-3 bg-emerald-50/50 rounded-lg hover:bg-emerald-100/50 transition-colors">
                                  <div className="flex-shrink-0 w-24">
                                    <span className="text-sm font-semibold text-emerald-700">{item.time}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.activity}</p>
                                    {item.participants && (
                                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        <Users className="w-3 h-3" />
                                        {item.participants}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Samedi */}
                    <div className="border border-emerald-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenDay(openDay === 'samedi' ? '' : 'samedi')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-gold-50 hover:from-emerald-100 hover:to-gold-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-emerald-700" />
                          <span className={`font-bold text-emerald-800 ${
                            language === 'ar' ? 'font-arabic' : ''
                          }`}>{t('program.saturday')}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-emerald-700 transition-transform ${openDay === 'samedi' ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openDay === 'samedi' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white space-y-3">
                              {schedule.samedi.map((item, index) => (
                                <div key={index} className="flex gap-4 p-3 bg-emerald-50/50 rounded-lg hover:bg-emerald-100/50 transition-colors">
                                  <div className="flex-shrink-0 w-24">
                                    <span className="text-sm font-semibold text-emerald-700">{item.time}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.activity}</p>
                                    {item.participants && (
                                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        <Users className="w-3 h-3" />
                                        {item.participants}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dimanche */}
                    <div className="border border-emerald-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenDay(openDay === 'dimanche' ? '' : 'dimanche')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-gold-50 hover:from-emerald-100 hover:to-gold-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-emerald-700" />
                          <span className={`font-bold text-emerald-800 ${
                            language === 'ar' ? 'font-arabic' : ''
                          }`}>{t('program.sunday')}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-emerald-700 transition-transform ${openDay === 'dimanche' ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openDay === 'dimanche' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white space-y-3">
                              {schedule.dimanche.map((item, index) => (
                                <div key={index} className="flex gap-4 p-3 bg-emerald-50/50 rounded-lg hover:bg-emerald-100/50 transition-colors">
                                  <div className="flex-shrink-0 w-24">
                                    <span className="text-sm font-semibold text-emerald-700">{item.time}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.activity}</p>
                                    {item.participants && (
                                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        <Users className="w-3 h-3" />
                                        {item.participants}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-emerald-50 to-gold-50 rounded-2xl p-6">
                  <h4 className={`font-bold text-emerald-800 mb-3 flex items-center gap-2 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>
                    <span className="text-2xl">📺</span>
                    {t('program.broadcast')}
                  </h4>
                  <p className={`text-gray-700 mb-2 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{t('program.broadcastDesc')} <span className="font-semibold text-emerald-700">Zawiya TV</span></p>
                  <p className="text-emerald-600 font-semibold">www.zawiya.sn</p>
                  <p className={`text-gray-600 mt-2 ${
                    language === 'ar' ? 'font-arabic' : ''
                  }`}>{t('program.contact')}: <span className="font-semibold">77 874 62 82</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Program
