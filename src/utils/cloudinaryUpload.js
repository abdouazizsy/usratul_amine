const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const uploadImageToCloudinary = async (file, folder = 'usratul-amine/products') => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary non configuré : ajoutez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env.local"
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error("Échec de l'upload de l'image sur Cloudinary")
  }

  const data = await response.json()
  return data.secure_url
}

// Transforme une URL Cloudinary en lien de téléchargement forcé (Content-Disposition: attachment),
// nécessaire car un simple <a download> ne fonctionne pas sur une URL cross-origin.
export const getCloudinaryDownloadUrl = (url) => {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/fl_attachment/')
}
