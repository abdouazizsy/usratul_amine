import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BadgeCheck, Check, Download, Mail, Phone, Save, Search, Trash2, User, X, Copy, MessageCircle, CheckCheck
} from 'lucide-react'
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { DEFAULT_TEMPLATES, MEDIA_TYPES, ROLES, STATUSES, fillTemplate, labelOf, toWhatsAppNumber } from '../utils/accreditation'

const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null
  return date ? date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
}

// Export pour Excel (version française) : séparateur ";" et BOM pour les accents
const exportCsv = (rows, filename) => {
  const headers = ['Statut', 'Prénom', 'Nom', 'Média', 'Type de média', 'Fonction', 'Téléphone', 'Email', 'Événement', 'Date de la demande', 'Photo']
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const lines = rows.map(r => [
    labelOf(STATUSES, r.status), r.firstName, r.lastName, r.media, labelOf(MEDIA_TYPES, r.mediaType),
    labelOf(ROLES, r.role), r.phone, r.email, r.event, formatDate(r.createdAt), r.photo
  ].map(escape).join(';'))
  const blob = new Blob(['﻿' + [headers.map(escape).join(';'), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const AccreditationManagement = ({ setNotification, setConfirmModal }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [zoomed, setZoomed] = useState(null)
  const [settings, setSettings] = useState({
    open: false,
    eventName: 'Les 72h de Usratul Amine 2026',
    approvedTemplate: DEFAULT_TEMPLATES.approved,
    rejectedTemplate: DEFAULT_TEMPLATES.rejected
  })
  const [savingSettings, setSavingSettings] = useState(false)

  const notify = (type, title, message) => setNotification({ isOpen: true, type, title, message })

  useEffect(() => {
    fetchItems()
    getDoc(doc(db, 'settings', 'accreditation'))
      .then(snap => snap.exists() && setSettings(prev => ({ ...prev, ...snap.data() })))
      .catch(error => console.error('Error fetching accreditation settings:', error))
  }, [])

  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'accreditations'), orderBy('createdAt', 'desc')))
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (error) {
      console.error('Error fetching accreditations:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (e) => {
    e.preventDefault()
    setSavingSettings(true)
    try {
      await setDoc(doc(db, 'settings', 'accreditation'), settings)
      notify('success', 'Paramètres enregistrés', settings.open ? 'Le formulaire est ouvert aux journalistes.' : 'Le formulaire est fermé.')
    } catch (error) {
      console.error('Error saving accreditation settings:', error)
      notify('error', 'Erreur', "Impossible d'enregistrer les paramètres.")
    } finally {
      setSavingSettings(false)
    }
  }

  const setStatus = async (item, status) => {
    try {
      await updateDoc(doc(db, 'accreditations', item.id), { status, reviewedAt: new Date() })
      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, status } : i)))
    } catch (error) {
      console.error('Error updating accreditation:', error)
      notify('error', 'Erreur', 'Impossible de modifier le statut.')
    }
  }

  // Mémorise que le journaliste a été prévenu de la décision actuelle
  const markNotified = async (item, channel) => {
    const notified = { notifiedStatus: item.status, notifiedAt: new Date(), notifiedBy: channel }
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, ...notified } : i)))
    try {
      await updateDoc(doc(db, 'accreditations', item.id), notified)
    } catch (error) {
      console.error('Error marking accreditation as notified:', error)
    }
  }

  const messageFor = (item) =>
    fillTemplate(item.status === 'approved' ? settings.approvedTemplate : settings.rejectedTemplate, item)

  const remove = (item) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer la demande',
      message: `Supprimer la demande de ${item.firstName} ${item.lastName} ? Cette action est irréversible.`,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'accreditations', item.id))
          setItems(prev => prev.filter(i => i.id !== item.id))
        } catch (error) {
          console.error('Error deleting accreditation:', error)
          notify('error', 'Erreur', 'Impossible de supprimer la demande.')
        }
      }
    })
  }

  // Toujours l'adresse publique, même quand l'admin est ouvert en local
  const publicLink = 'https://usratulamine.sn/accreditation'
  const copyLink = () => {
    navigator.clipboard?.writeText(publicLink)
      .then(() => notify('success', 'Lien copié', 'Vous pouvez le partager aux journalistes.'))
      .catch(() => {})
  }

  const events = [...new Set(items.map(i => i.event).filter(Boolean))]
  const term = search.trim().toLowerCase()
  const filtered = items.filter(i =>
    (statusFilter === 'all' || i.status === statusFilter) &&
    (eventFilter === 'all' || i.event === eventFilter) &&
    (!term || [i.firstName, i.lastName, i.media, i.phone, i.email].filter(Boolean).some(v => v.toLowerCase().includes(term)))
  )
  const countOf = (status) => items.filter(i => (eventFilter === 'all' || i.event === eventFilter) && i.status === status).length

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Accréditations presse</h2>
          <p className="text-sm text-gray-500">Demandes envoyées par les journalistes depuis le formulaire public.</p>
        </div>
        <button
          onClick={() => exportCsv(filtered, `accreditations-${new Date().toISOString().slice(0, 10)}.csv`)}
          disabled={filtered.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Exporter (Excel)
        </button>
      </div>

      {/* Ouverture du formulaire */}
      <form onSubmit={saveSettings} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:pb-2.5">
            <input
              type="checkbox"
              checked={settings.open}
              onChange={(e) => setSettings({ ...settings, open: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            Formulaire ouvert
          </label>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Événement concerné</label>
            <input
              type="text"
              value={settings.eventName}
              onChange={(e) => setSettings({ ...settings, eventName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700">Messages envoyés aux journalistes (WhatsApp / email)</summary>
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Accréditation acceptée</label>
              <textarea
                value={settings.approvedTemplate}
                onChange={(e) => setSettings({ ...settings, approvedTemplate: e.target.value })}
                rows={9}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Demande refusée</label>
              <textarea
                value={settings.rejectedTemplate}
                onChange={(e) => setSettings({ ...settings, rejectedTemplate: e.target.value })}
                rows={9}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Remplacés automatiquement : {'{prenom}'}, {'{nom}'}, {'{evenement}'}, {'{media}'}, {'{fonction}'}. Pensez à cliquer sur « Enregistrer ».
          </p>
        </details>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span>Lien à partager :</span>
          <code className="px-2 py-1 bg-white border border-gray-200 rounded">{publicLink}</code>
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:text-emerald-900">
            <Copy className="w-3.5 h-3.5" /> Copier
          </button>
        </div>
      </form>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[{ id: 'all', label: 'Toutes' }, ...STATUSES].map(s => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              statusFilter === s.id ? 'bg-emerald-700 border-emerald-700 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-600'
            }`}
          >
            {s.label}
            {s.id !== 'all' && <span className="ml-1.5 opacity-75">{countOf(s.id)}</span>}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, média, téléphone, email)…"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        {events.length > 1 && (
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="all">Tous les événements</option>
            {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
          </select>
        )}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <BadgeCheck className="w-14 h-14 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{items.length === 0 ? "Aucune demande d'accréditation pour le moment" : 'Aucune demande ne correspond aux filtres'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(item => {
            const status = STATUSES.find(s => s.id === item.status) || STATUSES[0]
            return (
              <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                <button
                  onClick={() => item.photo && setZoomed(item)}
                  className="w-24 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                  aria-label="Agrandir la photo"
                >
                  {item.photo ? <img src={item.photo} alt={`${item.firstName} ${item.lastName}`} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-300" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 leading-tight">{item.firstName} {item.lastName}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${status.className}`}>{status.label}</span>
                  </div>
                  <p className="text-sm font-medium text-emerald-700">{item.media}</p>
                  <p className="text-xs text-gray-500">{labelOf(ROLES, item.role)} · {labelOf(MEDIA_TYPES, item.mediaType)}</p>
                  <div className="mt-2 space-y-0.5 text-sm">
                    {item.phone && (
                      <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 text-gray-700 hover:text-emerald-700">
                        <Phone className="w-3.5 h-3.5" /> {item.phone}
                      </a>
                    )}
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 text-gray-700 hover:text-emerald-700 truncate">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">{item.email}</span>
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{item.event} · {formatDate(item.createdAt)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.status !== 'approved' && (
                      <button onClick={() => setStatus(item, 'approved')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">
                        <Check className="w-3.5 h-3.5" /> Accréditer
                      </button>
                    )}
                    {item.status !== 'rejected' && (
                      <button onClick={() => setStatus(item, 'rejected')} className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-50">
                        <X className="w-3.5 h-3.5" /> Refuser
                      </button>
                    )}
                    <button onClick={() => remove(item)} className="ml-auto p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.status !== 'pending' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                      {item.notifiedStatus === item.status ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCheck className="w-4 h-4" /> Prévenu le {formatDate(item.notifiedAt)}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700">À prévenir :</span>
                      )}
                      {toWhatsAppNumber(item.phone) && (
                        <a
                          href={`https://wa.me/${toWhatsAppNumber(item.phone)}?text=${encodeURIComponent(messageFor(item))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => markNotified(item, 'whatsapp')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-semibold hover:brightness-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      )}
                      {item.email && (
                        <a
                          href={`mailto:${item.email}?subject=${encodeURIComponent(`Accréditation presse — ${item.event || 'Usratul Amine'}`)}&body=${encodeURIComponent(messageFor(item))}`}
                          onClick={() => markNotified(item, 'email')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                        >
                          <Mail className="w-3.5 h-3.5" /> Email
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(null)}
            className="fixed inset-0 z-[80] bg-black/80 flex flex-col items-center justify-center p-6"
          >
            <img src={zoomed.photo} alt="" className="max-h-[75vh] max-w-full rounded-xl shadow-2xl" />
            <p className="mt-4 text-white font-semibold">{zoomed.firstName} {zoomed.lastName} — {zoomed.media}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AccreditationManagement
