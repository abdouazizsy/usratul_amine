// Accès au Coran via la fonction Netlify "quran" (API Quran Foundation)

// Traduction affichée sous le texte arabe selon la langue du site (aucune en arabe)
export const TRANSLATION_BY_LANGUAGE = {
  fr: { id: 31, name: 'Muhammad Hamidullah' },
  en: { id: 20, name: 'Saheeh International' }
}

export const RECITERS = [
  { id: 7, name: 'Mishari Rashid al-Afasy' },
  { id: 2, name: 'Abdul Basit Abdul Samad (Murattal)' },
  { id: 6, name: 'Mahmoud Khalil Al-Husary' },
  { id: 9, name: 'Mohamed Siddiq al-Minshawi (Murattal)' },
  { id: 3, name: 'Abdur-Rahman as-Sudais' }
]

const RECITER_STORAGE_KEY = 'quran:reciter'

export const getSavedReciter = () => {
  try {
    const id = Number(localStorage.getItem(RECITER_STORAGE_KEY))
    return RECITERS.some(r => r.id === id) ? id : RECITERS[0].id
  } catch {
    return RECITERS[0].id
  }
}

export const saveReciter = (id) => {
  try {
    localStorage.setItem(RECITER_STORAGE_KEY, String(id))
  } catch {
    // stockage indisponible : on ignore
  }
}

const memoryCache = new Map()

export const quranFetch = async (path, params = {}) => {
  const query = new URLSearchParams({ path, ...params })
  const url = `/.netlify/functions/quran?${query}`
  if (memoryCache.has(url)) return memoryCache.get(url)

  const response = await fetch(url)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || data.message || `Erreur ${response.status}`)
  memoryCache.set(url, data)
  return data
}

export const fetchChapters = async (language) => {
  const data = await quranFetch('/chapters', { language })
  return data.chapters || []
}

export const fetchChapter = async (chapterId, language) => {
  const data = await quranFetch(`/chapters/${chapterId}`, { language })
  return data.chapter
}

// Récupère tous les versets d'une sourate (l'API les renvoie par pages de 50)
export const fetchAllVerses = async (chapterId, { language, recitation, onPage } = {}) => {
  const translation = TRANSLATION_BY_LANGUAGE[language]
  const params = { fields: 'text_uthmani', per_page: '50', audio: String(recitation) }
  if (translation) {
    params.translations = String(translation.id)
    params.language = language
  }

  let page = 1
  let verses = []
  while (page) {
    const data = await quranFetch(`/verses/by_chapter/${chapterId}`, { ...params, page: String(page) })
    verses = [...verses, ...(data.verses || [])]
    onPage?.(verses)
    page = data.pagination?.next_page || null
  }
  return verses
}

// Les traductions contiennent des appels de note (<sup>…</sup>) et parfois d'autres balises
export const cleanTranslation = (html) =>
  (html || '')
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// L'URL audio d'un verset est parfois relative ("Alafasy/mp3/001001.mp3")
// ou sans protocole ("//mirrors.quranicaudio.com/…")
export const verseAudioUrl = (url) => {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url
  if (url.startsWith('//')) return `https:${url}`
  return `https://verses.quran.com/${url.replace(/^\/+/, '')}`
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'
export const toArabicNumber = (n) => String(n).replace(/\d/g, d => ARABIC_DIGITS[d])
