import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, ExternalLink, MapPin, Newspaper } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { CategoryBadge } from '../components/NewsSection'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { pickLocalized } from '../utils/localizedField'
import { formatNewsDate, getVideoEmbed } from '../utils/news'

const ActualiteDetailPage = () => {
  const { id } = useParams()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    setActiveImage(0)
    getDoc(doc(db, 'actualites', id))
      .then(snap => setItem(snap.exists() && snap.data().published !== false ? { id: snap.id, ...snap.data() } : null))
      .catch(error => console.error('Error fetching news item:', error))
      .finally(() => setLoading(false))
  }, [id])

  const images = item?.images || []
  const videos = (item?.videos || []).map(getVideoEmbed).filter(Boolean)
  const content = pickLocalized(item, 'content', language)

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <article className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/actualites" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('news.back')}
          </Link>

          {loading ? (
            <div className="text-center py-16 text-gray-500">{t('news.loading')}</div>
          ) : !item ? (
            <div className="text-center py-16">
              <Newspaper className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('news.notFound')}</p>
            </div>
          ) : (
            <div className={isAr ? 'text-right' : ''}>
              <div className={`flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-500 ${isAr ? 'justify-end' : ''}`}>
                <CategoryBadge category={item.category} t={t} />
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatNewsDate(item.date, language)}
                </span>
                {item.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </span>
                )}
              </div>

              <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight ${isAr ? 'font-arabic' : 'font-elegant'}`}>
                {pickLocalized(item, 'title', language)}
              </h1>

              {images.length > 0 && (
                <div className="mb-8">
                  <div className="rounded-2xl overflow-hidden bg-gray-100">
                    <img src={images[activeImage]} alt="" className="w-full max-h-[480px] object-cover" />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                      {images.map((url, i) => (
                        <button
                          key={url}
                          onClick={() => setActiveImage(i)}
                          className={`w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-emerald-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {videos.length > 0 && (
                <div className="space-y-6 mb-8">
                  {videos.map((video) => (
                    <div key={video.url}>
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                        <iframe
                          src={video.embedUrl}
                          title={`${pickLocalized(item, 'title', language)} — ${video.provider}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {video.provider}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {pickLocalized(item, 'excerpt', language) && (
                <p className={`text-lg font-medium text-gray-800 mb-6 ${isAr ? 'font-arabic' : ''}`}>
                  {pickLocalized(item, 'excerpt', language)}
                </p>
              )}
              {content && (
                <div className={`text-gray-700 leading-relaxed whitespace-pre-line ${isAr ? 'font-arabic' : ''}`}>
                  {content}
                </div>
              )}
            </div>
          )}
        </div>
      </article>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default ActualiteDetailPage
