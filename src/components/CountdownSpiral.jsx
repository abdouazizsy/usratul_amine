import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useLanguage } from '../contexts/LanguageContext'

// Compte à rebours vers l'événement réglé dans Admin → Paramètres (document settings/countdown)

const LABELS = {
  fr: { days: 'JOURS', hours: 'HEURES', minutes: 'MIN', seconds: 'SEC', live: 'EN COURS', d: 'j' },
  en: { days: 'DAYS', hours: 'HOURS', minutes: 'MIN', seconds: 'SEC', live: 'LIVE NOW', d: 'd' },
  ar: { days: 'يوم', hours: 'ساعة', minutes: 'دقيقة', seconds: 'ثانية', live: 'جارٍ الآن', d: 'ي' }
}

const LOCALES = { fr: 'fr-FR', en: 'en-GB', ar: 'ar-u-ca-gregory-nu-latn' }

const pad = (n) => String(n).padStart(2, '0')

const splitRemaining = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60
  }
}

const CountdownSpiral = () => {
  const { language } = useLanguage()
  const labels = LABELS[language] || LABELS.fr
  const [event, setEvent] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'countdown'))
      .then(snap => {
        const data = snap.exists() ? snap.data() : null
        if (data?.enabled && data.startDate && !Number.isNaN(new Date(data.startDate).getTime())) setEvent(data)
      })
      .catch(err => console.error('CountdownSpiral: erreur chargement du compte à rebours', err))
  }, [])

  // Le compteur avance chaque seconde
  useEffect(() => {
    if (!event) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [event])

  if (!event || dismissed) return null

  const start = new Date(event.startDate).getTime()
  const end = event.endDate ? new Date(event.endDate).getTime() : start + 72 * 3600 * 1000
  if (now >= end) return null

  const isLive = now >= start
  const { days, hours, minutes, seconds } = splitRemaining(start - now)
  const formattedDate = new Date(start).toLocaleDateString(LOCALES[language] || LOCALES.fr, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const units = [
    { value: days, label: labels.days },
    { value: pad(hours), label: labels.hours },
    { value: pad(minutes), label: labels.minutes },
    { value: pad(seconds), label: labels.seconds }
  ]

  return (
    <>
      {/* Carte complète, desktop uniquement */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        dir="ltr"
        className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center w-64 py-7 px-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl shadow-2xl border border-gold-500/20"
      >
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-center text-white font-elegant italic text-xl leading-snug px-4">{event.title}</p>

        {isLive ? (
          <span className="mt-6 px-4 py-2 rounded-full bg-gold-500 text-white text-sm font-bold tracking-[0.2em] animate-pulse">
            {labels.live}
          </span>
        ) : (
          <div className="mt-6 grid grid-cols-4 gap-1.5 w-full">
            {units.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-2 rounded-xl bg-white/5 border border-gold-500/20">
                <span className="text-2xl font-bold text-white tabular-nums leading-none">{value}</span>
                <span className="text-[9px] tracking-[0.12em] text-gold-400 font-semibold mt-1.5">{label}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-gold-300 text-sm mt-5 text-center">
          {formattedDate}{event.location ? ` · ${event.location}` : ''}
        </p>
      </motion.div>

      {/* Badge compact, mobile/tablette */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        dir="ltr"
        className="flex xl:hidden fixed left-3 top-40 z-30 flex-col items-center w-[104px] py-3 px-2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 rounded-2xl shadow-xl border border-gold-500/20"
      >
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-900 border border-gold-500/30 flex items-center justify-center text-white/80"
        >
          <X className="w-3 h-3" />
        </button>

        <span className="text-[10px] font-semibold text-gold-300 text-center leading-tight line-clamp-2">
          {event.shortTitle || event.title}
        </span>
        {isLive ? (
          <span className="mt-2 text-[10px] font-bold tracking-[0.15em] text-white animate-pulse">{labels.live}</span>
        ) : (
          <>
            <span className="mt-1.5 text-2xl font-elegant italic font-bold text-white leading-none">
              {days}<span className="text-sm not-italic text-gold-400 ml-0.5">{labels.d}</span>
            </span>
            <span className="mt-1 text-xs font-semibold text-white/90 tabular-nums tracking-wide">
              {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </span>
          </>
        )}
      </motion.div>
    </>
  )
}

export default CountdownSpiral
