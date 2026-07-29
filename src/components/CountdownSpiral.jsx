import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

const CountdownSpiral = () => {
  const [nextProgram, setNextProgram] = useState(null)
  const [daysLeft, setDaysLeft] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const fetchNextProgram = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'programs'), orderBy('date', 'asc')))
        const programs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        const now = new Date()
        const upcoming = programs.filter(p => new Date(p.date) >= now)

        if (upcoming.length > 0) {
          const next = upcoming[0]
          const diffMs = new Date(next.date).setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)
          setNextProgram(next)
          setDaysLeft(Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24))))
        }
      } catch (err) {
        console.error('CountdownSpiral: erreur chargement programme', err)
      }
    }
    fetchNextProgram()
  }, [])

  if (!nextProgram || dismissed) return null

  const formattedDate = new Date(nextProgram.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <>
      {/* Carte complète, desktop uniquement */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center w-60 py-8 px-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl shadow-2xl border border-gold-500/20"
      >
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#d4af37" strokeOpacity="0.35" strokeWidth="1" />
            <circle cx="100" cy="100" r="66" fill="none" stroke="#d4af37" strokeOpacity="0.5" strokeWidth="1" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="#d4af37" strokeOpacity="0.65" strokeWidth="1" />
            <circle cx="100" cy="8" r="5" fill="#f3e3b8" />
            <circle cx="100" cy="34" r="2.5" fill="#d4af37" />
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl font-elegant italic font-bold text-white leading-none">{daysLeft}</span>
            <span className="text-[11px] tracking-[0.25em] text-gold-400 font-semibold mt-2">JOURS AVANT</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white font-elegant italic text-lg leading-snug">{nextProgram.title}</p>
          <p className="text-gold-300 text-sm mt-2">
            {formattedDate}{nextProgram.location ? ` · ${nextProgram.location}` : ''}
          </p>
        </div>
      </motion.div>

      {/* Badge compact, mobile/tablette */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex xl:hidden fixed left-3 top-40 z-30 flex-col items-center w-20 py-3 px-2 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl shadow-xl border border-gold-500/20"
      >
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-950 border border-gold-500/30 flex items-center justify-center text-white/80"
        >
          <X className="w-3 h-3" />
        </button>

        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#d4af37" strokeOpacity="0.35" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#d4af37" strokeOpacity="0.55" strokeWidth="2" />
            <circle cx="100" cy="8" r="8" fill="#f3e3b8" />
          </svg>
          <span className="relative z-10 text-lg font-elegant italic font-bold text-white leading-none">{daysLeft}</span>
        </div>
        <span className="text-[7px] tracking-[0.15em] text-gold-400 font-semibold mt-1 text-center">JOURS AVANT</span>
      </motion.div>
    </>
  )
}

export default CountdownSpiral
