import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Pause, Play } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { useAudioPlayer } from '../contexts/AudioPlayerContext'
import { getTranslation } from '../translations/translations'
import {
  RECITERS, TRANSLATION_BY_LANGUAGE, cleanTranslation, fetchAllVerses, fetchChapter,
  getSavedReciter, saveReciter, toArabicNumber, verseAudioUrl
} from '../utils/quran'

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'

const QuranChapterPage = () => {
  const { chapterId } = useParams()
  const id = Number(chapterId)
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const player = useAudioPlayer()
  const [chapter, setChapter] = useState(null)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reciter, setReciter] = useState(getSavedReciter)
  const verseRefs = useRef({})

  const translation = TRANSLATION_BY_LANGUAGE[language]
  const reciterName = RECITERS.find(r => r.id === reciter)?.name

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setVerses([])
    Promise.all([
      fetchChapter(id, language),
      fetchAllVerses(id, { language, recitation: reciter, onPage: (v) => !cancelled && setVerses(v) })
    ])
      .then(([chapterData]) => !cancelled && setChapter(chapterData))
      .catch(err => {
        console.error('Error fetching surah:', err)
        if (!cancelled) setError(true)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id, language, reciter])

  // Un épisode du lecteur par verset : la lecture enchaîne les versets
  const tracks = useMemo(() => verses
    .map(verse => ({
      id: `quran:${reciter}:${verse.verse_key}`,
      verseKey: verse.verse_key,
      title: `${chapter?.name_simple || ''} · ${verse.verse_key}`,
      url: verseAudioUrl(verse.audio?.url),
      partTitle: reciterName,
      collectionId: 'quran',
      collectionTitle: t('quran.title'),
      link: `/library/coran/${id}`,
      duration: 0
    }))
    .filter(track => track.url),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [verses, chapter, reciter, id])

  const currentVerseKey = player.track?.collectionId === 'quran' && player.track.link === `/library/coran/${id}`
    ? player.track.verseKey
    : null

  // Fait défiler la page jusqu'au verset en cours de lecture
  useEffect(() => {
    if (currentVerseKey) verseRefs.current[currentVerseKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentVerseKey])

  const playFrom = (verseKey) => {
    if (player.track?.verseKey === verseKey && player.track?.link === `/library/coran/${id}`) {
      player.toggle()
      return
    }
    const index = tracks.findIndex(track => track.verseKey === verseKey)
    if (index >= 0) player.playQueue(tracks, index)
  }

  const changeReciter = (value) => {
    const next = Number(value)
    setReciter(next)
    saveReciter(next)
  }

  const isPlayingHere = Boolean(currentVerseKey) && player.playing
  const showBismillah = chapter?.bismillah_pre && id !== 1

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-28 pb-20 min-h-[70vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/library/coran" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('quran.back')}
          </Link>

          {error ? (
            <div className="text-center py-16">
              <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('quran.error')}</p>
            </div>
          ) : (
            <>
              <header className="text-center bg-gradient-to-br from-emerald-800 to-emerald-900 text-white rounded-3xl px-6 py-8 mb-8 shadow-lg">
                <p className="text-5xl mb-2" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                  {chapter?.name_arabic || ' '}
                </p>
                <h1 className="text-2xl font-bold">
                  {chapter ? `${id}. ${chapter.name_simple}` : t('quran.loading')}
                </h1>
                {chapter && (
                  <p className="text-sm text-white/80 mt-1">
                    {!isAr && `${chapter.translated_name?.name} · `}
                    {chapter.verses_count} {t('quran.verses')} · {chapter.revelation_place === 'madinah' ? t('quran.medinan') : t('quran.meccan')}
                  </p>
                )}

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => (isPlayingHere ? player.toggle() : playFrom(currentVerseKey || tracks[0]?.verseKey))}
                    disabled={tracks.length === 0}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-900 font-semibold rounded-full hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    {isPlayingHere ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    {t('quran.listen')}
                  </button>
                  <label className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-sm w-full sm:w-auto">
                    <span className="text-white/80">{t('quran.reciter')}</span>
                    <select
                      value={reciter}
                      onChange={(e) => changeReciter(e.target.value)}
                      className="w-full sm:w-auto max-w-full px-3 py-2 rounded-full bg-emerald-700 border border-white/30 text-white text-sm focus:ring-2 focus:ring-amber-300"
                    >
                      {RECITERS.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </header>

              {translation && (
                <p className="text-xs text-gray-500 mb-6 text-center">
                  {t('quran.translationBy')} {translation.name}
                </p>
              )}

              {showBismillah && (
                <p className="text-center text-3xl text-emerald-900 mb-8" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                  {BISMILLAH}
                </p>
              )}

              <div className="space-y-3">
                {verses.map((verse) => {
                  const isCurrent = verse.verse_key === currentVerseKey
                  const text = translation ? cleanTranslation(verse.translations?.[0]?.text) : ''
                  return (
                    <article
                      key={verse.verse_key}
                      ref={(el) => { verseRefs.current[verse.verse_key] = el }}
                      className={`rounded-2xl border px-4 sm:px-6 py-5 transition-colors ${
                        isCurrent ? 'border-emerald-400 bg-emerald-50' : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3" dir="ltr">
                        <button
                          onClick={() => playFrom(verse.verse_key)}
                          className={`mt-1 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
                            isCurrent ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          aria-label={`${t('quran.listen')} ${verse.verse_key}`}
                        >
                          {isCurrent && player.playing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                        <p
                          className="flex-1 text-right text-2xl sm:text-3xl leading-[2.2] text-gray-900"
                          style={{ fontFamily: "'Amiri', serif" }}
                          dir="rtl"
                          lang="ar"
                        >
                          {verse.text_uthmani}
                          <span className="inline-flex items-center justify-center mx-2 w-9 h-9 rounded-full border border-emerald-600 text-emerald-700 text-base align-middle">
                            {toArabicNumber(verse.verse_number)}
                          </span>
                        </p>
                      </div>
                      {text && (
                        <p className="mt-3 sm:pl-12 text-gray-700 leading-relaxed" dir="ltr">
                          <span className="text-xs font-semibold text-emerald-700 mr-2">{verse.verse_key}</span>
                          {text}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>

              {loading && <div className="text-center py-10 text-gray-500">{t('quran.loading')}</div>}

              {!loading && (
                <nav className="mt-10 flex items-center justify-between gap-3" dir="ltr">
                  {id > 1 ? (
                    <Link to={`/library/coran/${id - 1}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-600 text-emerald-700 text-sm font-semibold hover:bg-emerald-50">
                      <ArrowLeft className="w-4 h-4" />
                      {t('quran.previous')}
                    </Link>
                  ) : <span />}
                  {id < 114 && (
                    <Link to={`/library/coran/${id + 1}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800">
                      {t('quran.next')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </nav>
              )}

              <p className="mt-10 text-xs text-gray-400 text-center">{t('quran.credit')}</p>
            </>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default QuranChapterPage
