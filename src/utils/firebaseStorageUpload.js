import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'

// Upload un fichier (ex: PDF) vers Firebase Storage avec suivi de progression.
// Retourne l'URL de téléchargement une fois l'upload terminé.
export const uploadFileToStorage = (file, folder, onProgress) => {
  return new Promise((resolve, reject) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const path = `${folder}/${Date.now()}_${safeName}`
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file)

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
        }
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}
