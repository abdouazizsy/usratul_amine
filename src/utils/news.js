import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

// Catégories disponibles pour les actualités (les libellés publics sont dans translations: news.categories.<id>)
export const NEWS_CATEGORIES = [
  { id: 'evenement', label: 'Événement' },
  { id: 'association', label: "Vie de l'association" },
  { id: 'formation', label: 'Formation' },
  { id: 'actualite', label: 'Actualité' },
  { id: 'boutique', label: 'Boutique' }
]

const LOCALES = { fr: 'fr-FR', en: 'en-GB', ar: 'ar-u-ca-gregory-nu-latn' }

// Formate une date "AAAA-MM-JJ" dans la langue active (calendrier grégorien)
export const formatNewsDate = (dateStr, language, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(LOCALES[language] || LOCALES.fr, options)
}

const YOUTUBE_ID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|shorts\/|embed\/))([\w-]{11})/

// Transforme un lien YouTube ou Facebook en lecteur intégrable ({ provider, embedUrl, thumbnail, url }), ou null
export const getVideoEmbed = (rawUrl) => {
  const url = (rawUrl || '').trim()
  if (!url) return null

  const youtubeId = url.match(YOUTUBE_ID)?.[1]
  if (youtubeId) {
    // Conserve le minutage de départ éventuel (?t=2011s, ?t=2011, &start=2011)
    const start = url.match(/[?&](?:t|start)=(\d+)s?(?:&|#|$)/)?.[1]
    return {
      provider: 'YouTube',
      url,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}${start ? `?start=${start}` : ''}`,
      thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    }
  }

  if (/facebook\.com|fb\.watch/.test(url)) {
    let href = url
    // Les liens "story.php?story_fbid=X&id=Y" ne sont pas acceptés par le lecteur : on les convertit en permalien
    try {
      const parsed = new URL(url)
      const storyId = parsed.searchParams.get('story_fbid')
      const pageId = parsed.searchParams.get('id')
      if (parsed.pathname.includes('story.php') && storyId && pageId) {
        href = `https://www.facebook.com/${pageId}/posts/${storyId}/`
      }
    } catch {
      // lien mal formé : on le garde tel quel
    }
    const isVideo = /\/videos\/|\/watch|\/reel\/|fb\.watch/.test(href)
    return {
      provider: 'Facebook',
      url,
      embedUrl: `https://www.facebook.com/plugins/${isVideo ? 'video' : 'post'}.php?href=${encodeURIComponent(href)}&show_text=${isVideo ? 'false' : 'true'}&width=560`,
      thumbnail: null
    }
  }

  return null
}

// Image de couverture : première photo, sinon miniature de la première vidéo YouTube
export const getNewsCover = (item) =>
  item?.images?.[0] || (item?.videos || []).map(getVideoEmbed).find(v => v?.thumbnail)?.thumbnail || null

// Actualités publiées, de la plus récente à la plus ancienne
export const fetchPublishedNews = async () => {
  const snapshot = await getDocs(query(collection(db, 'actualites'), orderBy('date', 'desc')))
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(n => n.published !== false)
}
