import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowDown } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Hero = () => {
  const { t, language } = useTranslation()
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multi-layered Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950"></div>
        
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>
        
        {/* Radial gradient spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800/40 via-transparent to-transparent"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>
      
      {/* Floating particles and stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              background: i % 3 === 0 ? '#fbbf24' : '#34d399',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Larger glowing orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: '60px',
              height: '60px',
              background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Bannière d'événement animée */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [-20, 0, 0, -20],
              scale: [0.95, 1, 1, 0.95]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 rounded-full shadow-2xl shadow-gold-500/50 border-2 border-white/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <span className={`text-white font-bold text-lg tracking-wide ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                {t('hero.eventBanner')}
              </span>
              <Sparkles className="w-5 h-5 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </motion.div>

          {/* Logo with glow effect */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute inset-0 w-48 h-48 rounded-full bg-gold-400/20 blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Logo container */}
              <div className="relative w-44 h-44 rounded-full bg-white backdrop-blur-sm border-4 border-gold-400 flex items-center justify-center elegant-shadow p-6 shadow-2xl shadow-gold-500/50">
                <img 
                  src="/logo.png" 
                  alt="Usratul Amine Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.outerHTML = '<div class="text-6xl">🕌</div>'
                  }}
                />
              </div>
              
              {/* Decorative corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-gold-500 rounded-tl-full"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-gold-500 rounded-br-full"></div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-gold-300 text-2xl font-arabic mb-2 drop-shadow-lg"
          >
            أُسْرَةُ الأَمِين
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            className={`text-6xl md:text-8xl font-elegant font-bold text-white leading-tight drop-shadow-2xl mb-6 ${
              language === 'ar' ? 'font-arabic' : ''
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-white">
              {t('hero.title')}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <div className="bg-emerald-900/30 backdrop-blur-sm rounded-2xl px-8 py-6 border border-emerald-700/30">
              <p className={`text-xl md:text-2xl text-emerald-100 leading-relaxed mb-3 ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                {t('hero.subtitle')}
              </p>
              <p className={`text-3xl md:text-4xl text-gold-300 font-elegant font-bold drop-shadow-lg ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                {t('hero.name')}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-300">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-gold-500"></div>
                <p className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('hero.role')}
                </p>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-gold-500"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col items-center gap-6 pt-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(251, 191, 36, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                className={`px-10 py-5 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-gold-500/50 transition-all flex items-center gap-3 border-2 border-gold-400 bg-size-200 bg-pos-0 hover:bg-pos-100 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}
                style={{
                  backgroundSize: '200% auto',
                  transition: 'background-position 0.5s ease'
                }}
              >
                <Sparkles className="w-6 h-6" />
                {t('hero.cta1')}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('biography').scrollIntoView({ behavior: 'smooth' })}
                className={`px-8 py-5 bg-emerald-800/40 backdrop-blur-sm text-white rounded-full font-semibold text-lg border-2 border-emerald-500/50 hover:bg-emerald-700/50 transition-all flex items-center gap-2 ${
                  language === 'ar' ? 'font-arabic' : ''
                }`}
              >
                {t('hero.cta2')}
              </motion.button>
            </div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8"
            >
              <div className="flex flex-col items-center gap-2">
                <ArrowDown className="w-7 h-7 text-gold-300 drop-shadow-lg" />
                <span className={`text-emerald-200 text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('hero.scroll')}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 text-slate-50" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero
