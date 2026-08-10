import React, { useState, useEffect, useRef, useCallback } from 'react'

const pad = (n) => String(Math.max(0, n)).padStart(2, '0')

const formatEventLabel = (date) => {
  const dateLabel = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const capitalized = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)
  const timeLabel = `${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`
  return `${capitalized} · ${timeLabel}`
}

const useBump = (value) => {
  const [bump, setBump] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current === value) return
    prev.current = value
    setBump(false)
    const raf = requestAnimationFrame(() => setBump(true))
    const timeout = setTimeout(() => setBump(false), 340)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
    }
  }, [value])

  return bump
}

const Plaque = ({ value, label }) => {
  const text = pad(value)
  const bump = useBump(text)
  return (
    <div className="usa-plaque">
      <span className={`usa-num${bump ? ' usa-bump' : ''}`}>{text}</span>
      <span className="usa-lbl">{label}</span>
    </div>
  )
}

const ComingSoonPage = ({ targetDate, onReveal }) => {
  const [now, setNow] = useState(() => new Date())
  const [leaving, setLeaving] = useState(false)
  const [sweepFire, setSweepFire] = useState(false)
  const revealedRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const diffMs = targetDate.getTime() - now.getTime()

  const triggerReveal = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = reduced ? 0 : 280
    if (!reduced) setSweepFire(true)
    setTimeout(() => setLeaving(true), delay)
    setTimeout(() => onReveal && onReveal(), delay + 1150)
  }, [onReveal])

  useEffect(() => {
    if (diffMs <= 0) triggerReveal()
  }, [diffMs, triggerReveal])

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <div className="usa-root">
      <style>{`
        .usa-root {
          --ink:#07160f;
          --emerald-deep:#051a12;
          --emerald:#0d3b2c;
          --emerald-high:#144e3a;
          --gold:#c9a227;
          --gold-soft:#e8d9a8;
          --gold-dim:rgba(201,162,39,.35);
          --parchment:#f6f1e4;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .usa-stage {
          position: relative;
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center;
          padding: 3rem 1.5rem;
          background:
            radial-gradient(60% 50% at 50% 18%, var(--emerald-high) 0%, transparent 70%),
            linear-gradient(180deg, var(--emerald-deep) 0%, var(--ink) 65%, #030b07 100%);
          transition: filter 1.1s ease, opacity 1.1s ease;
          overflow: hidden;
        }
        .usa-stage.usa-leaving { filter: blur(14px) brightness(1.4); opacity: 0; }
        .usa-lattice { position: absolute; inset: 0; opacity: .09; pointer-events: none; }
        .usa-rings {
          position: absolute; top: 50%; left: 50%;
          width: min(760px, 92vw); height: min(760px, 92vw);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .usa-rings svg { width: 100%; height: 100%; animation: usa-spin 140s linear infinite; }
        .usa-rings .usa-r2 { position: absolute; inset: 0; animation-direction: reverse; animation-duration: 100s; }
        .usa-crest { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem; }
        .usa-crest-medal {
          width: 156px; height: 156px; border-radius: 50%;
          padding: 26px 22px;
          background: radial-gradient(circle at 50% 32%, #fffdf7 0%, var(--parchment) 72%);
          border: 1px solid var(--gold-dim);
          box-shadow: 0 0 0 5px rgba(5,26,18,.55), 0 18px 34px -16px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.6);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .usa-crest-medal img { width: 100%; height: 100%; object-fit: contain; }
        .usa-headline {
          position: relative; z-index: 2;
          font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600;
          font-size: clamp(2.1rem, 5.2vw, 4rem);
          line-height: 1.12; color: var(--parchment);
          text-wrap: balance;
          max-width: 16ch;
          margin-bottom: 2.2rem;
        }
        .usa-event-details {
          position: relative; z-index: 2;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .55rem;
          font-size: .86rem; letter-spacing: .04em; color: var(--gold-soft); opacity: .85;
          margin-bottom: 3rem;
        }
        .usa-event-details .usa-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--gold-dim); }
        .usa-countdown { position: relative; z-index: 2; display: flex; align-items: stretch; justify-content: center; gap: .5rem; margin-bottom: 2.6rem; }
        .usa-plaque {
          position: relative;
          width: clamp(64px, 15vw, 108px);
          padding: 1.1rem .4rem .9rem;
          background: linear-gradient(160deg, var(--emerald-high), var(--emerald) 60%, var(--emerald-deep));
          border: 1px solid var(--gold-dim);
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.06), inset 0 -14px 22px -18px rgba(0,0,0,.7), 0 14px 30px -14px rgba(0,0,0,.55);
        }
        .usa-num {
          display: block;
          font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600;
          font-size: clamp(1.9rem, 5vw, 3.1rem);
          line-height: 1; color: var(--gold-soft);
          font-variant-numeric: tabular-nums;
        }
        .usa-num.usa-bump { animation: usa-bump .32s ease; }
        .usa-lbl { display: block; margin-top: .5rem; font-size: .6rem; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); opacity: .85; }
        .usa-colon { align-self: center; color: var(--gold-dim); font-size: 1.1rem; margin: 0 -.1rem; }
        .usa-bismillah { position: relative; z-index: 2; font-family: 'Amiri', serif; font-size: 1.35rem; color: var(--gold-soft); opacity: .8; margin-bottom: .9rem; direction: rtl; }
        .usa-contact-line { position: relative; z-index: 2; font-size: .78rem; letter-spacing: .03em; color: var(--gold-soft); opacity: .55; }
        .usa-sweep {
          position: fixed; inset: 0; z-index: 6; pointer-events: none;
          background: linear-gradient(100deg, transparent 40%, rgba(232,217,168,.9) 50%, transparent 60%);
          transform: translateX(-120%); opacity: 0;
        }
        .usa-sweep.usa-fire { animation: usa-sweep 1.1s ease forwards; }
        @keyframes usa-spin { to { transform: rotate(360deg); } }
        @keyframes usa-bump { 0% { opacity: .35; transform: translateY(-4px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes usa-sweep { 0% { transform: translateX(-120%); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateX(120%); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .usa-rings svg { animation: none; }
          .usa-num.usa-bump { animation: none; }
          .usa-sweep.usa-fire { animation: none; }
          .usa-stage { transition: opacity .3s ease; }
        }
        @media (max-width: 420px) {
          .usa-countdown { gap: .35rem; }
          .usa-plaque { width: 72px; padding: .8rem .15rem .7rem; }
          .usa-lbl { font-size: .52rem; letter-spacing: .1em; }
          .usa-colon { display: none; }
        }
      `}</style>

      <div className={`usa-stage${leaving ? ' usa-leaving' : ''}`}>
        <div className="usa-lattice" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="usa-star8" width="72" height="72" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="#e8d9a8" strokeWidth="1">
                  <path d="M36 4 L44 28 L68 36 L44 44 L36 68 L28 44 L4 36 L28 28 Z" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#usa-star8)" />
          </svg>
        </div>

        <div className="usa-rings" aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="188" fill="none" stroke="#c9a227" strokeOpacity=".22" strokeWidth="1" />
            <circle cx="200" cy="200" r="188" fill="none" stroke="#c9a227" strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 10" />
            <circle cx="200" cy="12" r="4" fill="#e8d9a8" />
          </svg>
          <svg viewBox="0 0 400 400" className="usa-r2">
            <circle cx="200" cy="200" r="150" fill="none" stroke="#c9a227" strokeOpacity=".18" strokeWidth="1" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="#c9a227" strokeOpacity=".3" strokeWidth="1" strokeDasharray="1 8" />
          </svg>
        </div>

        <div className="usa-crest">
          <div className="usa-crest-medal">
            <img src="/logo-transparent.png" alt="Usratul Amine" />
          </div>
        </div>

        <h1 className="usa-headline">Lancement de notre plateforme digitale</h1>

        <div className="usa-event-details">
          <span>Bibliothèque Al Amine · Tivaouane, Sénégal</span>
          <span className="usa-dot"></span>
          <span>{formatEventLabel(targetDate)}</span>
        </div>

        <div className="usa-countdown">
          <Plaque value={days} label="Jours" />
          <span className="usa-colon">◆</span>
          <Plaque value={hours} label="Heures" />
          <span className="usa-colon">◆</span>
          <Plaque value={minutes} label="Minutes" />
          <span className="usa-colon">◆</span>
          <Plaque value={seconds} label="Secondes" />
        </div>

        <p className="usa-bismillah">بسم الله الرحمن الرحيم</p>
        <p className="usa-contact-line">+221 77 108 26 26 · usratulamine.sn</p>
      </div>

      <div className={`usa-sweep${sweepFire ? ' usa-fire' : ''}`}></div>
    </div>
  )
}

export default ComingSoonPage
