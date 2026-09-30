import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Edit, Trash2, Save, X, Upload, ArrowLeft, ArrowUp, ArrowDown,
  Headphones, ChevronDown, Check, Merge
} from 'lucide-react'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload'
import { uploadAudioToR2, deleteAudioFromR2, readAudioDuration } from '../utils/r2Upload'
import { translateAndPatchDoc } from '../utils/translateContent'
import { formatDuration, formatTotalDuration } from '../utils/audio'

const emptyForm = { title: '', author: '', description: '', image: '', published: true }

const newId = () => crypto.randomUUID()

// Trie "00 1.mp3", "00 2.mp3", "00 10.mp3" dans l'ordre des numéros
const byFileNumber = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })

const move = (list, index, delta) => {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const copy = [...list]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
}

const AudioManagement = ({ setNotification, setConfirmModal }) => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newPartTitle, setNewPartTitle] = useState('')
  const [openPartId, setOpenPartId] = useState(null)
  const [upload, setUpload] = useState(null) // { partId, current, total, percent, name }
  const [mergeIds, setMergeIds] = useState(null) // null = mode fusion inactif, sinon ids cochés

  const selected = collections.find(c => c.id === selectedId) || null

  const notify = (type, title, message) => setNotification({ isOpen: true, type, title, message })

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'audio_collections'))
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      setCollections(data)
    } catch (error) {
      console.error('Error fetching audio collections:', error)
    } finally {
      setLoading(false)
    }
  }

  // Enregistre les parties d'une collection (Firestore + état local)
  const saveParts = async (collectionId, parts) => {
    await updateDoc(doc(db, 'audio_collections', collectionId), { parts })
    setCollections(prev => prev.map(c => (c.id === collectionId ? { ...c, parts } : c)))
  }

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormData(emptyForm)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadImageToCloudinary(file)
      setFormData(prev => ({ ...prev, image: url }))
    } catch (error) {
      console.error('Error uploading image:', error)
      notify('error', "Erreur d'upload", error.message || "Impossible d'uploader l'image.")
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fieldsToTranslate = { title: formData.title, description: formData.description }
    try {
      if (editing) {
        await updateDoc(doc(db, 'audio_collections', editing.id), formData)
        translateAndPatchDoc('audio_collections', editing.id, fieldsToTranslate)
        notify('success', 'Collection modifiée', 'La collection a été modifiée avec succès.')
      } else {
        const newDocRef = await addDoc(collection(db, 'audio_collections'), {
          ...formData,
          parts: [],
          order: collections.length,
          createdAt: new Date()
        })
        translateAndPatchDoc('audio_collections', newDocRef.id, fieldsToTranslate)
        setSelectedId(newDocRef.id)
        notify('success', 'Collection créée', 'Ajoutez maintenant ses parties et ses épisodes.')
      }
      resetForm()
      fetchCollections()
    } catch (error) {
      console.error('Error saving audio collection:', error)
      notify('error', 'Erreur', "Impossible d'enregistrer la collection.")
    }
  }

  const handleEdit = (item) => {
    setEditing(item)
    setFormData({
      title: item.title || '',
      author: item.author || '',
      description: item.description || '',
      image: item.image || '',
      published: item.published !== false
    })
    setShowForm(true)
  }

  // Supprime les fichiers de R2 sans bloquer si l'un d'eux a déjà disparu
  const removeFiles = (tracks) =>
    Promise.allSettled(tracks.filter(t => t.key).map(t => deleteAudioFromR2(t.key)))

  const handleDeleteCollection = (item) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer la collection',
      message: `Supprimer « ${item.title} » et tous ses épisodes ? Cette action est irréversible.`,
      onConfirm: async () => {
        try {
          await removeFiles((item.parts || []).flatMap(p => p.tracks || []))
          await deleteDoc(doc(db, 'audio_collections', item.id))
          setSelectedId(null)
          notify('success', 'Collection supprimée', 'La collection a été supprimée.')
          fetchCollections()
        } catch (error) {
          console.error('Error deleting audio collection:', error)
          notify('error', 'Erreur', 'Impossible de supprimer la collection.')
        }
      }
    })
  }

  // Regroupe les parties des collections cochées dans la première (ordre de la liste).
  // Les fichiers audio ne bougent pas : seules les fiches des autres collections sont retirées.
  const handleMerge = () => {
    const chosen = collections.filter(c => mergeIds.includes(c.id))
    const [target, ...sources] = chosen
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Fusionner les collections',
      message: `Les parties de ${sources.length} collection(s) seront déplacées dans « ${target.title} », puis ces collections seront retirées. Aucun fichier audio n'est supprimé.`,
      onConfirm: async () => {
        try {
          const parts = chosen.flatMap(c => c.parts || [])
          await updateDoc(doc(db, 'audio_collections', target.id), { parts })
          await Promise.all(sources.map(c => deleteDoc(doc(db, 'audio_collections', c.id))))
          setMergeIds(null)
          setSelectedId(target.id)
          notify('success', 'Collections fusionnées', `${parts.length} partie(s) regroupée(s). Vous pouvez maintenant renommer la collection.`)
          fetchCollections()
        } catch (error) {
          console.error('Error merging audio collections:', error)
          notify('error', 'Erreur', 'La fusion a échoué. Rechargez la page et vérifiez les collections avant de réessayer.')
          fetchCollections()
        }
      }
    })
  }

  const toggleMerge = (id) =>
    setMergeIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))

  const runPartsUpdate = async (parts, errorMessage) => {
    try {
      await saveParts(selected.id, parts)
    } catch (error) {
      console.error('Error updating audio parts:', error)
      notify('error', 'Erreur', errorMessage)
    }
  }

  const handleAddPart = async (e) => {
    e.preventDefault()
    const title = newPartTitle.trim()
    if (!title) return
    const part = { id: newId(), title, tracks: [] }
    await runPartsUpdate([...(selected.parts || []), part], "Impossible d'ajouter la partie.")
    setNewPartTitle('')
    setOpenPartId(part.id)
  }

  const updatePart = (partId, changes, errorMessage = "Impossible d'enregistrer la modification.") =>
    runPartsUpdate(
      (selected.parts || []).map(p => (p.id === partId ? { ...p, ...changes } : p)),
      errorMessage
    )

  const handleDeletePart = (part) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer la partie',
      message: `Supprimer « ${part.title} » et ses ${(part.tracks || []).length} épisode(s) ? Cette action est irréversible.`,
      onConfirm: async () => {
        await removeFiles(part.tracks || [])
        await runPartsUpdate((selected.parts || []).filter(p => p.id !== part.id), 'Impossible de supprimer la partie.')
      }
    })
  }

  const handleDeleteTrack = (part, track) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: "Supprimer l'épisode",
      message: `Supprimer « ${track.title} » ? Cette action est irréversible.`,
      onConfirm: async () => {
        await removeFiles([track])
        await updatePart(part.id, { tracks: part.tracks.filter(t => t.id !== track.id) }, "Impossible de supprimer l'épisode.")
      }
    })
  }

  const handleFilesChange = async (part, e) => {
    const files = Array.from(e.target.files || []).sort(byFileNumber)
    e.target.value = ''
    if (files.length === 0) return

    const collectionId = selected.id
    let tracks = [...(part.tracks || [])]
    let uploaded = 0
    try {
      for (const [i, file] of files.entries()) {
        setUpload({ partId: part.id, current: i + 1, total: files.length, percent: 0, name: file.name })
        const duration = await readAudioDuration(file)
        const { url, key } = await uploadAudioToR2(file, `${collectionId}/${part.id}`, (percent) =>
          setUpload(prev => (prev ? { ...prev, percent } : prev))
        )
        tracks = [...tracks, { id: newId(), title: `Épisode ${tracks.length + 1}`, url, key, duration, size: file.size }]
        // Enregistré après chaque fichier : un envoi interrompu ne perd pas les épisodes déjà envoyés
        const latest = await getDoc(doc(db, 'audio_collections', collectionId))
        const current = latest.data()?.parts || []
        await saveParts(collectionId, current.map(p => (p.id === part.id ? { ...p, tracks } : p)))
        uploaded += 1
      }
      notify('success', 'Épisodes ajoutés', `${uploaded} épisode(s) ajouté(s) à « ${part.title} ».`)
    } catch (error) {
      console.error('Error uploading audio:', error)
      notify('error', "Erreur d'envoi", `${uploaded} fichier(s) envoyé(s) sur ${files.length}. ${error.message || ''}`)
    } finally {
      setUpload(null)
    }
  }

  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">Chargement...</div>
  }

  const collectionForm = showForm && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 p-6 bg-gray-50 rounded-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{editing ? 'Modifier la collection' : 'Nouvelle collection'}</h3>
        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="ex: Tafsir du Noble Coran en wolof"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auteur / récitant</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="ex: El Hadji Malick Gaye"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (optionnel)</label>
          <div className="flex items-center gap-3">
            {formData.image && (
              <div className="relative w-16 h-16 flex-shrink-0">
                <img src={formData.image} alt="Aperçu" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm">
              <Upload className="w-4 h-4" />
              {uploadingImage ? 'Envoi en cours...' : 'Choisir une image'}
              <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploadingImage} className="hidden" />
            </label>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 text-emerald-600 rounded"
          />
          Publiée (visible sur le site)
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploadingImage}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {editing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
          <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Annuler
          </button>
        </div>
      </form>
    </motion.div>
  )

  // Détail d'une collection : parties et épisodes
  if (selected) {
    const parts = selected.parts || []
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <button
          onClick={() => { setSelectedId(null); resetForm() }}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Toutes les collections
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{selected.title}</h2>
            <p className="text-sm text-gray-500">
              {selected.author}
              {selected.published === false && <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gray-200 text-gray-600 rounded-full">Brouillon</span>}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => handleEdit(selected)} className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4" /> Modifier
            </button>
            <button onClick={() => handleDeleteCollection(selected)} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" /> Supprimer
            </button>
          </div>
        </div>

        {collectionForm}

        <div className="space-y-3 mb-6">
          {parts.length === 0 && (
            <p className="text-center py-6 text-gray-500 text-sm">
              Aucune partie pour le moment. Créez-en une ci-dessous (ex: « Partie 01 : Al-Fatiha & Al-Baqara »).
            </p>
          )}
          {parts.map((part, partIndex) => {
            const tracks = part.tracks || []
            const isOpen = openPartId === part.id
            const isUploading = upload?.partId === part.id
            const totalSeconds = tracks.reduce((sum, t) => sum + (t.duration || 0), 0)
            return (
              <div key={part.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50">
                  <button onClick={() => setOpenPartId(isOpen ? null : part.id)} className="flex-1 min-w-0 flex items-center gap-2 text-left">
                    <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    <span className="min-w-0">
                      <span className="block font-semibold text-gray-800 truncate">{part.title}</span>
                      <span className="block text-xs text-gray-500">
                        {tracks.length} épisode(s){totalSeconds > 0 && ` · ${formatTotalDuration(totalSeconds)}`}
                      </span>
                    </span>
                  </button>
                  <button onClick={() => runPartsUpdate(move(parts, partIndex, -1), 'Impossible de déplacer la partie.')} disabled={partIndex === 0} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30" aria-label="Monter">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => runPartsUpdate(move(parts, partIndex, 1), 'Impossible de déplacer la partie.')} disabled={partIndex === parts.length - 1} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30" aria-label="Descendre">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeletePart(part)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" aria-label="Supprimer la partie">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isOpen && (
                  <div className="p-4 space-y-3">
                    <EditableTitle
                      label="Titre de la partie"
                      value={part.title}
                      onSave={(title) => updatePart(part.id, { title })}
                    />

                    {tracks.length > 0 && (
                      <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                        {tracks.map((track, trackIndex) => (
                          <div key={track.id} className="flex items-center gap-2 px-3 py-2">
                            <span className="w-6 text-xs text-gray-400 text-right flex-shrink-0">{trackIndex + 1}</span>
                            <div className="flex-1 min-w-0">
                              <EditableTitle
                                compact
                                value={track.title}
                                onSave={(title) => updatePart(part.id, { tracks: tracks.map(t => (t.id === track.id ? { ...t, title } : t)) })}
                              />
                            </div>
                            <span className="text-xs text-gray-500 tabular-nums flex-shrink-0">{formatDuration(track.duration)}</span>
                            <button onClick={() => updatePart(part.id, { tracks: move(tracks, trackIndex, -1) })} disabled={trackIndex === 0} className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30" aria-label="Monter">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => updatePart(part.id, { tracks: move(tracks, trackIndex, 1) })} disabled={trackIndex === tracks.length - 1} className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30" aria-label="Descendre">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteTrack(part, track)} className="p-1 text-red-600 hover:bg-red-50 rounded" aria-label="Supprimer l'épisode">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {isUploading ? (
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <p className="text-sm text-emerald-800 mb-2">
                          Envoi {upload.current}/{upload.total} — {upload.name} ({upload.percent}%)
                        </p>
                        <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${upload.percent}%` }} />
                        </div>
                        <p className="text-xs text-emerald-700 mt-2">Gardez cette page ouverte jusqu'à la fin de l'envoi.</p>
                      </div>
                    ) : (
                      <div>
                        <label className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm transition-colors ${upload ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}>
                          <Upload className="w-4 h-4" />
                          Ajouter des fichiers MP3
                          <input
                            type="file"
                            accept="audio/*,.mp3"
                            multiple
                            onChange={(e) => handleFilesChange(part, e)}
                            disabled={Boolean(upload)}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Sélectionnez tous les fichiers de la partie d'un coup : ils sont classés d'après le numéro dans leur nom et nommés « Épisode 1, 2, 3… ».
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <form onSubmit={handleAddPart} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newPartTitle}
            onChange={(e) => setNewPartTitle(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Nouvelle partie — ex: Partie 02 : Ali Imran"
          />
          <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            Ajouter la partie
          </button>
        </form>
      </div>
    )
  }

  // Liste des collections
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Audiothèque</h2>
          <p className="text-sm text-gray-500">Collections audio (tafsir, conférences…) écoutables sur le site.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {collections.length > 1 && !mergeIds && (
            <button
              onClick={() => { resetForm(); setMergeIds([]) }}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
            >
              <Merge className="w-4 h-4" />
              Fusionner des collections
            </button>
          )}
          <button
            onClick={() => { setMergeIds(null); setEditing(null); setFormData(emptyForm); setShowForm(true) }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle collection
          </button>
        </div>
      </div>

      {collectionForm}

      {mergeIds && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-sm text-emerald-900 mb-3">
            Cochez les collections à regrouper. Leurs parties seront rassemblées, dans l'ordre de la liste, dans la <strong>première collection cochée</strong> ; les autres seront retirées. Les fichiers audio ne sont pas touchés.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMergeIds(collections.map(c => c.id))}
              className="px-3 py-1.5 text-sm text-emerald-700 border border-emerald-300 rounded-lg hover:bg-white transition-colors"
            >
              Tout cocher
            </button>
            <button
              onClick={handleMerge}
              disabled={mergeIds.length < 2}
              className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50"
            >
              <Merge className="w-4 h-4" />
              Fusionner {mergeIds.length} collection(s)
            </button>
            <button onClick={() => setMergeIds(null)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors">
              Annuler
            </button>
          </div>
        </div>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-8">
          <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune collection audio pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {collections.map((item) => {
            const tracks = (item.parts || []).flatMap(p => p.tracks || [])
            return (
              <button
                key={item.id}
                onClick={() => (mergeIds ? toggleMerge(item.id) : (setSelectedId(item.id), resetForm()))}
                className={`w-full flex items-center gap-4 p-3 border rounded-xl text-left transition-colors ${
                  mergeIds?.includes(item.id) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50 hover:bg-emerald-50'
                }`}
              >
                {mergeIds && (
                  <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded border ${mergeIds.includes(item.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300'}`}>
                    {mergeIds.includes(item.id) && <Check className="w-3.5 h-3.5" />}
                  </span>
                )}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-emerald-800 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Headphones className="w-6 h-6 text-amber-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {item.author}
                    {mergeIds?.[0] && collections.find(c => mergeIds.includes(c.id))?.id === item.id && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-emerald-600 text-white rounded-full">Collection conservée</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(item.parts || []).length} partie(s) · {tracks.length} épisode(s)
                    {item.published === false && <span className="ml-2 px-2 py-0.5 font-semibold bg-gray-200 text-gray-600 rounded-full">Brouillon</span>}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Titre modifiable sur place (enregistré en quittant le champ ou avec Entrée)
const EditableTitle = ({ value, onSave, label, compact = false }) => {
  const [draft, setDraft] = useState(value)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setDraft(value)
  }, [value])

  const commit = async () => {
    const title = draft.trim()
    if (!title || title === value) {
      setDraft(value)
      return
    }
    await onSave(title)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="relative">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          className={`w-full border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
            compact ? 'px-2 py-1 text-sm border-transparent hover:border-gray-300 bg-transparent' : 'px-3 py-2 border-gray-300'
          }`}
        />
        {saved && <Check className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />}
      </div>
    </div>
  )
}

export default AudioManagement
