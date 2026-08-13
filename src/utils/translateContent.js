import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// Traduit un objet de champs français vers l'arabe via OpenAI (fonction Netlify).
// Retourne un objet { <champ>_ar: '...' } — vide en cas d'échec, pour ne jamais bloquer un enregistrement.
export const translateFieldsToArabic = async (fields) => {
  try {
    const response = await fetch('/.netlify/functions/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    })

    if (!response.ok) {
      console.error('translateFieldsToArabic: réponse non-ok', response.status)
      return {}
    }

    const translated = await response.json()
    const result = {}
    Object.entries(translated).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        result[`${key}_ar`] = value.trim()
      }
    })
    return result
  } catch (error) {
    console.error('translateFieldsToArabic: erreur', error)
    return {}
  }
}

// Traduit des champs et met à jour le document Firestore correspondant une fois prêt.
// Conçu pour être appelé sans "await" (traduction en arrière-plan, ne bloque jamais l'enregistrement).
export const translateAndPatchDoc = async (collectionName, docId, fields) => {
  const translated = await translateFieldsToArabic(fields)
  if (Object.keys(translated).length === 0) return
  try {
    await updateDoc(doc(db, collectionName, docId), translated)
  } catch (error) {
    console.error('translateAndPatchDoc: erreur de mise à jour', error)
  }
}
