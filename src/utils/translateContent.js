import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const TARGET_LANGUAGES = ['ar', 'en']

// Traduit un objet de champs français vers l'arabe et l'anglais via OpenAI (fonction Netlify).
// Retourne un objet { <champ>_ar: '...', <champ>_en: '...' } — vide en cas d'échec,
// pour ne jamais bloquer un enregistrement.
const translateFields = async (fields) => {
  try {
    const response = await fetch('/.netlify/functions/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields, languages: TARGET_LANGUAGES })
    })

    if (!response.ok) {
      console.error('translateFields: réponse non-ok', response.status)
      return {}
    }

    const translated = await response.json()
    const result = {}
    TARGET_LANGUAGES.forEach((lang) => {
      const langFields = translated[lang]
      if (!langFields || typeof langFields !== 'object') return
      Object.entries(langFields).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          result[`${key}_${lang}`] = value.trim()
        }
      })
    })
    return result
  } catch (error) {
    console.error('translateFields: erreur', error)
    return {}
  }
}

// Traduit des champs et met à jour le document Firestore correspondant une fois prêt.
// Conçu pour être appelé sans "await" (traduction en arrière-plan, ne bloque jamais l'enregistrement).
export const translateAndPatchDoc = async (collectionName, docId, fields) => {
  const translated = await translateFields(fields)
  if (Object.keys(translated).length === 0) return
  try {
    await updateDoc(doc(db, collectionName, docId), translated)
  } catch (error) {
    console.error('translateAndPatchDoc: erreur de mise à jour', error)
  }
}
