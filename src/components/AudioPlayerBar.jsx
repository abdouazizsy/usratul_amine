import React from 'react'
import { Link } from 'react-router-dom'
import { Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward, X, Headphones } from 'lucide-react'
import { useAudioPlayer } from '../contexts/AudioPlayerContext'
import { formatDuration } from '../utils/audio'

// Lecteur fixe en bas de l'écran : reste visible pendant la navigation sur le site
const AudioPlayerBar = () => {
  const {
    track, playing, currentTime, duration, rate, hasNext, hasPrevious,
    toggle, seek, skip, next, previous, cycleRate, close
  } = useAudioPlayer()

  if (!track) return null

  const iconButton = 'p-2 rounded-full text-white/90 hover:bg-white/10 disabled:opacity-30 transition-colors'

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[65] bg-emerald-900 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={Math.min(currentTime, duration || 0)}
        onChange={(e) => seek(Number(e.target.value))}
        className="audio-seek block w-full"
        aria-label="Position dans l'épisode"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-4">
        <Link to={track.link || `/library/audio/${track.collectionId}`} className="flex items-center gap-3 min-w-0 flex-1">
          <div className="hidden sm:flex w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-emerald-800 items-center justify-center">
            {track.image ? (
              <img src={track.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <Headphones className="w-5 h-5 text-amber-300" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{track.title}</p>
            <p className="text-xs text-white/70 truncate">
              {track.partTitle} · {formatDuration(currentTime)} / {formatDuration(duration)}
            </p>
          </div>
        </Link>

        <div className="flex items-center flex-shrink-0">
          <button onClick={previous} disabled={!hasPrevious} className={`${iconButton} hidden sm:block`} aria-label="Épisode précédent">
            <SkipBack className="w-5 h-5" />
          </button>
          <button onClick={() => skip(-15)} className={iconButton} aria-label="Reculer de 15 secondes">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggle}
            className="mx-1 w-11 h-11 flex items-center justify-center rounded-full bg-white text-emerald-900 hover:bg-amber-100 transition-colors"
            aria-label={playing ? 'Pause' : 'Lecture'}
          >
            {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button onClick={() => skip(30)} className={iconButton} aria-label="Avancer de 30 secondes">
            <RotateCw className="w-5 h-5" />
          </button>
          <button onClick={next} disabled={!hasNext} className={iconButton} aria-label="Épisode suivant">
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            onClick={cycleRate}
            className="hidden sm:block ml-1 px-2 py-1 min-w-[48px] rounded-full text-xs font-bold text-white/90 border border-white/30 hover:bg-white/10 transition-colors"
            aria-label="Vitesse de lecture"
          >
            {rate}×
          </button>
          <button onClick={close} className={`${iconButton} ml-1`} aria-label="Fermer le lecteur">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayerBar
