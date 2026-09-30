import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Clock, Headphones, Pause, Play } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { useAudioPlayer } from '../contexts/AudioPlayerContext'
import { getTranslation } from '../translations/translations'
import { pickLocalized } from '../utils/localizedField'
import { flattenTracks, formatDuration, formatTotalDuration, getLastTrackId, getSavedPosition } from '../utils/audio'

const AudioCollectionPage = () => {
  const { id } = useParams()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const player = useAudioPlayer()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openPartId, setOpenPartId] = useState(null)

  const tracks = useMemo(() => flattenTracks(item), [item])
  const totalSeconds = tracks.reduce((sum, track) => sum + (track.duration || 0), 0)
  const lastTrackIndex = tracks.findIndex(track => track.id === getLastTrackId(id))

  useEffect(() => {
    setLoading(true)
    getDoc(doc(db, 'audio_collections', id))
      .then(snap => {
        const data = snap.exists() && snap.data().published !== false ? { id: snap.id, ...snap.data() } : null
        setItem(data)
        if (data) {
          const lastId = getLastTrackId(id)
          const lastPart = (data.parts || []).find(part => (part.tracks || []).some(track => track.id === lastId))
          setOpenPartId((lastPart || data.parts?.[0])?.id || null)
        }
      })
      .catch(error => console.error('Error fetching audio collection:', error))
      .finally(() => setLoading(false))
  }, [id])

  const playTrack = (trackId) => {
    if (player.track?.id === trackId) {
      player.toggle()
      return
    }
    player.playQueue(tracks, tracks.findIndex(track => track.id === trackId))
  }

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-28 pb-20 min-h-[70vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/library/audio" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('audio.backToAudio')}
          </Link>

          {loading ? (
            <div className="text-center py-16 text-gray-500">{t('audio.loading')}</div>
          ) : !item ? (
            <div className="text-center py-16">
              <Headphones className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('audio.notFound')}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-6 mb-10">
                <div className="w-full sm:w-44 h-44 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center shadow-lg">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Headphones className="w-16 h-16 text-amber-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight ${isAr ? 'font-arabic' : 'font-elegant'}`}>
                    {pickLocalized(item, 'title', language)}
                  </h1>
                  {item.author && <p className="text-lg font-medium text-emerald-700 mb-3">{item.author}</p>}
                  {pickLocalized(item, 'description', language) && (
                    <p className={`text-gray-600 mb-4 whitespace-pre-line ${isAr ? 'font-arabic' : ''}`}>
                      {pickLocalized(item, 'description', language)}
                    </p>
                  )}
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-5">
                    <span className="inline-flex items-center gap-1.5">
                      <Headphones className="w-4 h-4" />
                      {tracks.length} {t('audio.episodes')}
                    </span>
                    {totalSeconds > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatTotalDuration(totalSeconds)}
                      </span>
                    )}
                  </p>
                  {tracks.length > 0 && (
                    <button
                      onClick={() => playTrack(tracks[lastTrackIndex >= 0 ? lastTrackIndex : 0].id)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full shadow-lg transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {lastTrackIndex >= 0 ? t('audio.resume') : t('audio.playAll')}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {(item.parts || []).map((part) => {
                  const isOpen = openPartId === part.id
                  const partTracks = part.tracks || []
                  const partSeconds = partTracks.reduce((sum, track) => sum + (track.duration || 0), 0)
                  return (
                    <div key={part.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenPartId(isOpen ? null : part.id)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-emerald-50/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900">{part.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {partTracks.length} {t('audio.episodes')}
                            {partSeconds > 0 && ` · ${formatTotalDuration(partSeconds)}`}
                          </p>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-100 divide-y divide-gray-100">
                          {partTracks.length === 0 && (
                            <p className="px-5 py-6 text-sm text-gray-500 text-center">{t('audio.emptyPart')}</p>
                          )}
                          {partTracks.map((track, i) => {
                            const isCurrent = player.track?.id === track.id
                            const isPlaying = isCurrent && player.playing
                            const position = isCurrent ? player.currentTime : getSavedPosition(track.id)
                            const progress = track.duration ? Math.min(100, (position / track.duration) * 100) : 0
                            return (
                              <button
                                key={track.id}
                                onClick={() => playTrack(track.id)}
                                className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${isCurrent ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
                              >
                                <span className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full ${isCurrent ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className={`block text-sm font-semibold truncate ${isCurrent ? 'text-emerald-800' : 'text-gray-900'}`}>
                                    {track.title || `${i + 1}`}
                                  </span>
                                  {progress > 0 && (
                                    <span className="block mt-1.5 h-1 rounded-full bg-gray-200 overflow-hidden">
                                      <span className="block h-full bg-emerald-600" style={{ width: `${progress}%` }} />
                                    </span>
                                  )}
                                </span>
                                {track.duration > 0 && (
                                  <span className="text-xs text-gray-500 flex-shrink-0 tabular-nums">{formatDuration(track.duration)}</span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
                {(item.parts || []).length === 0 && (
                  <p className="text-center py-10 text-gray-500">{t('audio.empty')}</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default AudioCollectionPage
