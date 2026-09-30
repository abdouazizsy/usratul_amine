// Formate une durée en secondes : 1805 -> "30:05", 3725 -> "1:02:05"
export const formatDuration = (seconds) => {
  const total = Math.max(0, Math.floor(seconds || 0))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

// Durée lisible pour un total : 43500 -> "12 h 05"
export const formatTotalDuration = (seconds) => {
  const total = Math.round((seconds || 0) / 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} min`
  return `${h} h ${String(m).padStart(2, '0')}`
}

// Met à plat tous les épisodes d'une collection, dans l'ordre d'écoute
export const flattenTracks = (collection) =>
  (collection?.parts || []).flatMap(part =>
    (part.tracks || []).map(track => ({
      ...track,
      partId: part.id,
      partTitle: part.title,
      collectionId: collection.id,
      collectionTitle: collection.title,
      image: collection.image || null
    }))
  )

// Position d'écoute mémorisée sur l'appareil du visiteur
const positionKey = (trackId) => `audio:pos:${trackId}`
const lastKey = (collectionId) => `audio:last:${collectionId}`

export const getSavedPosition = (trackId) => {
  try {
    return Number(localStorage.getItem(positionKey(trackId))) || 0
  } catch {
    return 0
  }
}

export const savePosition = (track, seconds) => {
  try {
    if (seconds > 5) localStorage.setItem(positionKey(track.id), String(Math.floor(seconds)))
    else localStorage.removeItem(positionKey(track.id))
    localStorage.setItem(lastKey(track.collectionId), track.id)
  } catch {
    // stockage indisponible (navigation privée) : on ignore
  }
}

export const clearPosition = (trackId) => {
  try {
    localStorage.removeItem(positionKey(trackId))
  } catch {
    // ignore
  }
}

export const getLastTrackId = (collectionId) => {
  try {
    return localStorage.getItem(lastKey(collectionId))
  } catch {
    return null
  }
}
