import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { clearPosition, getSavedPosition, savePosition } from '../utils/audio'

const AudioPlayerContext = createContext()

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider')
  }
  return context
}

const RATES = [1, 1.25, 1.5, 2, 0.75]
const SAVE_INTERVAL_SECONDS = 5

export const AudioPlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const lastSavedRef = useRef(0)
  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)

  const track = index >= 0 ? queue[index] : null

  // Lance la lecture d'une liste d'épisodes à partir de l'un d'eux
  const playQueue = useCallback((tracks, startIndex = 0) => {
    setQueue(tracks)
    setIndex(startIndex)
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [])

  const seek = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(Math.max(0, seconds), audio.duration || seconds)
  }, [])

  const skip = useCallback((delta) => {
    if (audioRef.current) seek(audioRef.current.currentTime + delta)
  }, [seek])

  const next = useCallback(() => setIndex(i => (i < queue.length - 1 ? i + 1 : i)), [queue.length])
  const previous = useCallback(() => setIndex(i => (i > 0 ? i - 1 : i)), [])

  const cycleRate = useCallback(() => {
    setRate(r => RATES[(RATES.indexOf(r) + 1) % RATES.length])
  }, [])

  const close = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      if (track) savePosition(track, audio.currentTime)
      audio.pause()
    }
    setIndex(-1)
    setQueue([])
  }, [track])

  // Charge l'épisode courant et reprend là où le visiteur s'était arrêté
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    audio.src = track.url
    audio.playbackRate = rate
    const saved = getSavedPosition(track.id)
    const resume = () => {
      if (saved > 0 && saved < (audio.duration || Infinity) - 10) audio.currentTime = saved
    }
    audio.addEventListener('loadedmetadata', resume, { once: true })
    lastSavedRef.current = saved
    setCurrentTime(saved)
    setDuration(track.duration || 0)
    audio.play().catch(() => {})
    return () => audio.removeEventListener('loadedmetadata', resume)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate
  }, [rate])

  // Commandes sur l'écran verrouillé / les écouteurs
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: track.title,
      artist: track.partTitle,
      album: track.collectionTitle,
      artwork: track.image ? [{ src: track.image }] : []
    })
    const handlers = {
      play: toggle,
      pause: toggle,
      previoustrack: previous,
      nexttrack: next,
      seekbackward: () => skip(-15),
      seekforward: () => skip(30)
    }
    Object.entries(handlers).forEach(([action, handler]) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler)
      } catch {
        // action non supportée par ce navigateur
      }
    })
  }, [track, toggle, previous, next, skip])

  // Laisse de la place au lecteur en bas de page (voir index.css)
  useEffect(() => {
    if (track) document.body.dataset.audioPlayer = 'on'
    else delete document.body.dataset.audioPlayer
  }, [track])

  const handleTimeUpdate = (e) => {
    const time = e.target.currentTime
    setCurrentTime(time)
    if (track && Math.abs(time - lastSavedRef.current) >= SAVE_INTERVAL_SECONDS) {
      lastSavedRef.current = time
      savePosition(track, time)
    }
  }

  const handleEnded = () => {
    if (track) clearPosition(track.id)
    if (index < queue.length - 1) setIndex(index + 1)
    else setPlaying(false)
  }

  const value = {
    track,
    queue,
    index,
    playing,
    currentTime,
    duration,
    rate,
    hasNext: index < queue.length - 1,
    hasPrevious: index > 0,
    playQueue,
    toggle,
    seek,
    skip,
    next,
    previous,
    cycleRate,
    close
  }

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={(e) => {
          setPlaying(false)
          if (track) savePosition(track, e.target.currentTime)
        }}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={(e) => Number.isFinite(e.target.duration) && setDuration(e.target.duration)}
        onEnded={handleEnded}
      />
    </AudioPlayerContext.Provider>
  )
}
