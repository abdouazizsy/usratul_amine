import { auth } from '../firebase/config'

const callR2 = async (payload) => {
  const token = await auth.currentUser?.getIdToken()
  const response = await fetch('/.netlify/functions/r2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || `Erreur du stockage (${response.status})`)
  return data
}

// Envoie un fichier audio vers Cloudflare R2 avec suivi de progression.
// Retourne { url, key } une fois l'envoi terminé.
export const uploadAudioToR2 = async (file, folder, onProgress) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const key = `audio/${folder}/${Date.now()}_${safeName}`
  const { uploadUrl, publicUrl } = await callR2({ action: 'presign', key })

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type || 'audio/mpeg')
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Envoi refusé (${xhr.status})`)))
    xhr.onerror = () => reject(new Error("Envoi interrompu (connexion ou configuration CORS du bucket)"))
    xhr.send(file)
  })

  return { url: publicUrl, key }
}

export const deleteAudioFromR2 = (key) => callR2({ action: 'delete', key })

// Lit la durée (en secondes) d'un fichier audio local, 0 si illisible
export const readAudioDuration = (file) =>
  new Promise((resolve) => {
    const audio = new Audio()
    const objectUrl = URL.createObjectURL(file)
    const done = (value) => {
      URL.revokeObjectURL(objectUrl)
      resolve(value)
    }
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => done(Number.isFinite(audio.duration) ? Math.round(audio.duration) : 0)
    audio.onerror = () => done(0)
    audio.src = objectUrl
  })
