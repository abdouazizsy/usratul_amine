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
      { time: '09h00 - 10h00', activity: 'Accueil et installation des invités à la grande salle du complexe Seydil Hadji Malick SY', participants: '' },
      { time: '10h00 - 11h00', activity: 'Récital Coran', participants: '' },
      { time: '11h00', activity: 'Mot de bienvenue', participants: '' },
      { time: '11h00 - 11h20', activity: 'Réalisation sur la vie et l\'œuvre de Serigne Abdoul Aziz Sy Al Amine (RTA)', participants: '' },
      { time: '11h20 - 12h20', activity: 'Présentation des délégations présentes', participants: '' },
      { time: '12h20', activity: 'Présentation des activités de Usratul amine', participants: '' },
      { time: '14h00', activity: 'Allocution du Khalife général des Tidianes', participants: '' }
    ],
    dimanche: [
      { time: '09h00 - 17h00', activity: 'Activités de recherches, débats et d\'exposition à la bibliothèque "Al Amine"', participants: '' },
      { time: '17h00', activity: 'Final génie en herbe des dahiras', participants: '' },
      { time: '18h00 - 22h00', activity: 'Rencontre de tous les membres de USRATUL AMINE avec le Responsable Moral à la salle Serigne Babacar Sy (salle rouge)', participants: '' }
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
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-3xl overflow-hidden elegant-shadow">
            <div className="relative h-56 bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
              <div className="absolute inset-0 islamic-pattern opacity-20"></div>
              <div className="relative z-10 text-center px-6">
                <p className="text-gold-300 text-sm uppercase tracking-[0.2em] mb-3">
                  Usratul Amine
                </p>
                <p className="text-white text-2xl md:text-3xl font-elegant font-bold">
                  Aucun programme prévu pour la fin de l'année
                </p>
                <p className="text-emerald-100 mt-3 max-w-xl mx-auto">
                  Les grands événements des 19, 20 et 21 décembre sont désormais terminés. De nouveaux programmes seront
                  annoncés ici, in shā' Allāh.
                </p>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-800 mb-2">Prochains programmes</h3>
                  <p className="text-gray-700">
                    Aucune activité n'est programmée pour le moment. Merci de rester connectés : les informations sur les
                    prochains événements seront partagées ici et via les canaux habituels.
                  </p>
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
