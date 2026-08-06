import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Plus, Edit, Trash2, Save, X, Phone, ArrowLeft,
  UserSquare2, UsersRound, ClipboardList, Upload, Cake, Briefcase,
  Search, ChevronLeft, ChevronRight
} from 'lucide-react'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

const DEFAULT_BUREAU_ROLES = [
  'Coordonnateur', 'Coordonnateur adjoint', 'Trésorier', 'Trésorière adjointe',
  'Responsable féminine', 'Responsable féminine adjointe', 'Responsable Organisation',
  'Adjoint Organisation', 'Responsable Yaatal', 'Adjoint Yaatal', 'Secrétaire',
  'Secrétaire adjoint', 'Responsable Scientifique'
]

const MEMBER_FIELDS = [
  { key: 'ignore', label: 'Ignorer cette colonne' },
  { key: 'firstName', label: 'Prénom' },
  { key: 'lastName', label: 'Nom' },
  { key: 'birthDate', label: 'Date de naissance' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'profession', label: 'Profession' }
]

const FEMININE_FIELDS = [
  { key: 'ignore', label: 'Ignorer cette colonne' },
  { key: 'firstName', label: 'Prénom' },
  { key: 'lastName', label: 'Nom' },
  { key: 'phone', label: 'Téléphone' }
]

const guessMapping = (columnCount, fields) => {
  const keys = fields.filter(f => f.key !== 'ignore').map(f => f.key)
  return Array.from({ length: columnCount }, (_, i) => keys[i] || 'ignore')
}

const parsePastedRows = (text) => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.split('\t').length > 1 ? line.split('\t') : line.split(/ {2,}/))
    .map(cols => cols.map(c => c.trim()))
}

const ImportModal = ({ title, fields, onClose, onConfirm }) => {
  const [text, setText] = useState('')
  const [rows, setRows] = useState([])
  const [mapping, setMapping] = useState([])

  const handleParse = () => {
    const parsed = parsePastedRows(text)
    setRows(parsed)
    const columnCount = parsed.reduce((max, r) => Math.max(max, r.length), 0)
    setMapping(guessMapping(columnCount, fields))
  }

  const handleConfirm = () => {
    const entries = rows.map(cols => {
      const entry = {}
      cols.forEach((value, i) => {
        const field = mapping[i]
        if (field && field !== 'ignore') entry[field] = value
      })
      return entry
    }).filter(entry => entry.firstName || entry.lastName)
    onConfirm(entries)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {rows.length === 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Sélectionne les lignes dans Excel (une personne par ligne) et colle-les ici, puis clique sur "Analyser".
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Colle ici les lignes copiées depuis Excel..."
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleParse}
                disabled={!text.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
              >
                Analyser
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              {rows.length} ligne(s) détectée(s). Vérifie que chaque colonne correspond au bon champ.
            </p>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {mapping.map((m, i) => (
                      <th key={i} className="p-2">
                        <select
                          value={m}
                          onChange={(e) => {
                            const next = [...mapping]
                            next[i] = e.target.value
                            setMapping(next)
                          }}
                          className="text-xs border border-gray-300 rounded px-1 py-1 w-full"
                        >
                          {fields.map(f => (
                            <option key={f.key} value={f.key}>{f.label}</option>
                          ))}
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 8).map((row, ri) => (
                    <tr key={ri} className="border-t border-gray-100">
                      {mapping.map((_, ci) => (
                        <td key={ci} className="p-2 text-gray-700">{row[ci] || ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 8 && (
              <p className="text-xs text-gray-500 mt-2">... et {rows.length - 8} autre(s) ligne(s)</p>
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setRows([])}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Recommencer
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Importer {rows.length} personne(s)
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

const SectionsManagement = ({ setNotification, setConfirmModal }) => {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [detailTab, setDetailTab] = useState('bureau')
  const [importOpenFor, setImportOpenFor] = useState(null) // 'members' | 'celluleFeminine' | null
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const q = query(collection(db, 'sections'), orderBy('name', 'asc'))
      const snap = await getDocs(q)
      setSections(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedSection = sections.find(s => s.id === selectedSectionId)

  const filteredSections = sections.filter(s => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.trim().toLowerCase()
    const coordinateur = (s.bureau || []).find(b => b.role === 'Coordonnateur')?.name || ''
    return s.name.toLowerCase().includes(term) || coordinateur.toLowerCase().includes(term)
  })
  const totalPages = Math.max(1, Math.ceil(filteredSections.length / PAGE_SIZE))
  const paginatedSections = filteredSections.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleAddSection = async (e) => {
    e.preventDefault()
    if (!newSectionName.trim()) return
    try {
      await addDoc(collection(db, 'sections'), {
        name: newSectionName.trim().toUpperCase(),
        bureau: DEFAULT_BUREAU_ROLES.map(role => ({ role, name: '' })),
        members: [],
        celluleFeminine: [],
        createdAt: new Date()
      })
      setNotification({ isOpen: true, type: 'success', title: 'Section créée', message: `La section ${newSectionName} a été créée.` })
      setNewSectionName('')
      setShowAddForm(false)
      fetchSections()
    } catch (error) {
      console.error('Error adding section:', error)
      setNotification({ isOpen: true, type: 'error', title: 'Erreur', message: 'Impossible de créer la section.' })
    }
  }

  const handleDeleteSection = (section) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer la section',
      message: `Êtes-vous sûr de vouloir supprimer la section ${section.name} et toutes ses données (membres, bureau) ? Cette action est irréversible.`,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'sections', section.id))
          setNotification({ isOpen: true, type: 'success', title: 'Section supprimée', message: 'La section a été supprimée.' })
          if (selectedSectionId === section.id) setSelectedSectionId(null)
          fetchSections()
        } catch (error) {
          console.error('Error deleting section:', error)
          setNotification({ isOpen: true, type: 'error', title: 'Erreur', message: 'Impossible de supprimer la section.' })
        }
      }
    })
  }

  const updateSectionField = async (sectionId, field, value) => {
    try {
      await updateDoc(doc(db, 'sections', sectionId), { [field]: value, updatedAt: new Date() })
      setSections(prev => prev.map(s => s.id === sectionId ? { ...s, [field]: value } : s))
    } catch (error) {
      console.error('Error updating section:', error)
      setNotification({ isOpen: true, type: 'error', title: 'Erreur', message: 'Impossible d\'enregistrer la modification.' })
    }
  }

  const handleImportConfirm = (field, entries) => {
    if (!selectedSection) return
    const current = selectedSection[field] || []
    const merged = [...current, ...entries]
    updateSectionField(selectedSection.id, field, merged)
    setImportOpenFor(null)
    setNotification({ isOpen: true, type: 'success', title: 'Import réussi', message: `${entries.length} personne(s) ajoutée(s).` })
  }

  const handleDeleteEntry = (field, index) => {
    if (!selectedSection) return
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer',
      message: 'Voulez-vous vraiment supprimer cette personne ?',
      onConfirm: () => {
        const current = [...(selectedSection[field] || [])]
        current.splice(index, 1)
        updateSectionField(selectedSection.id, field, current)
      }
    })
  }

  const handleEditEntry = (field, index, key, value) => {
    if (!selectedSection) return
    const current = [...(selectedSection[field] || [])]
    current[index] = { ...current[index], [key]: value }
    setSections(prev => prev.map(s => s.id === selectedSection.id ? { ...s, [field]: current } : s))
  }

  const persistEntries = (field) => {
    if (!selectedSection) return
    updateSectionField(selectedSection.id, field, selectedSection[field] || [])
  }

  const handleBureauChange = (index, key, value) => {
    if (!selectedSection) return
    const bureau = [...(selectedSection.bureau || [])]
    bureau[index] = { ...bureau[index], [key]: value }
    setSections(prev => prev.map(s => s.id === selectedSection.id ? { ...s, bureau } : s))
  }

  const handleAddBureauRow = () => {
    if (!selectedSection) return
    const bureau = [...(selectedSection.bureau || []), { role: '', name: '' }]
    setSections(prev => prev.map(s => s.id === selectedSection.id ? { ...s, bureau } : s))
  }

  const handleRemoveBureauRow = (index) => {
    if (!selectedSection) return
    const bureau = [...(selectedSection.bureau || [])]
    bureau.splice(index, 1)
    setSections(prev => prev.map(s => s.id === selectedSection.id ? { ...s, bureau } : s))
  }

  // --- Vue détail d'une section ---
  if (selectedSection) {
    const coordinateur = (selectedSection.bureau || []).find(b => b.role === 'Coordonnateur')?.name

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <button
          onClick={() => setSelectedSectionId(null)}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux sections
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{selectedSection.name}</h2>
            {coordinateur && <p className="text-sm text-gray-500">Coordonnateur : {coordinateur}</p>}
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
              {(selectedSection.members || []).length} membre(s)
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
              {(selectedSection.celluleFeminine || []).length} cellule féminine
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'bureau', label: 'Bureau', icon: UserSquare2 },
            { id: 'members', label: 'Membres', icon: Users },
            { id: 'celluleFeminine', label: 'Cellule féminine', icon: UsersRound }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDetailTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 transition-colors ${
                detailTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {detailTab === 'bureau' && (
          <div>
            <div className="space-y-2 mb-4">
              {(selectedSection.bureau || []).map((entry, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={entry.role}
                    onChange={(e) => handleBureauChange(i, 'role', e.target.value)}
                    placeholder="Rôle (ex: Coordonnateur)"
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    value={entry.name}
                    onChange={(e) => handleBureauChange(i, 'name', e.target.value)}
                    placeholder="Nom de la personne"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleRemoveBureauRow(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddBureauRow}
                className="flex items-center gap-2 px-4 py-2 text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Ajouter un rôle
              </button>
              <button
                onClick={() => {
                  updateSectionField(selectedSection.id, 'bureau', selectedSection.bureau || [])
                  setNotification({ isOpen: true, type: 'success', title: 'Bureau enregistré', message: 'Les modifications ont été enregistrées.' })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                <Save className="w-4 h-4" /> Enregistrer le bureau
              </button>
            </div>
          </div>
        )}

        {(detailTab === 'members' || detailTab === 'celluleFeminine') && (
          <EntryTable
            field={detailTab}
            entries={selectedSection[detailTab] || []}
            withExtraFields={detailTab === 'members'}
            onEdit={(i, k, v) => handleEditEntry(detailTab, i, k, v)}
            onBlurSave={() => persistEntries(detailTab)}
            onDelete={(i) => handleDeleteEntry(detailTab, i)}
            onImportClick={() => setImportOpenFor(detailTab)}
          />
        )}

        {importOpenFor && (
          <ImportModal
            title={importOpenFor === 'members' ? 'Importer des membres' : 'Importer la cellule féminine'}
            fields={importOpenFor === 'members' ? MEMBER_FIELDS : FEMININE_FIELDS}
            onClose={() => setImportOpenFor(null)}
            onConfirm={(entries) => handleImportConfirm(importOpenFor, entries)}
          />
        )}
      </div>
    )
  }

  // --- Vue liste des sections ---
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sections de l'association</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter une section
        </button>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleAddSection}
          className="mb-6 p-4 bg-gray-50 rounded-lg flex gap-3"
        >
          <input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Nom de la section (ex: DAKAR PLATEAU)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Créer
          </button>
          <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Annuler
          </button>
        </motion.form>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une section ou un coordonnateur..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : sections.length === 0 ? (
        <div className="text-center py-8">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune section enregistrée pour le moment</p>
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="text-center py-8">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune section ne correspond à "{searchTerm}"</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-700">Section</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Coordonnateur</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Membres</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Cellule féminine</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedSections.map((section) => {
                  const coordinateur = (section.bureau || []).find(b => b.role === 'Coordonnateur')?.name
                  return (
                    <tr
                      key={section.id}
                      onClick={() => { setSelectedSectionId(section.id); setDetailTab('bureau') }}
                      className="border-t border-gray-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-semibold text-gray-800">{section.name}</td>
                      <td className="p-3 text-gray-600">{coordinateur || '—'}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">
                          {(section.members || []).length}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                          {(section.celluleFeminine || []).length}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteSection(section) }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages} — {filteredSections.length} section(s)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-emerald-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const EntryTable = ({ field, entries, withExtraFields, onEdit, onBlurSave, onDelete, onImportClick }) => {
  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={onImportClick}
          className="flex items-center gap-2 px-4 py-2 text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
        >
          <Upload className="w-4 h-4" />
          Importer depuis Excel
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          Aucune personne enregistrée. Utilise "Importer depuis Excel" pour ajouter en masse.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Prénom</th>
                <th className="p-2 text-left">Nom</th>
                {withExtraFields && <th className="p-2 text-left"><Cake className="w-3.5 h-3.5 inline mr-1" />Naissance</th>}
                <th className="p-2 text-left"><Phone className="w-3.5 h-3.5 inline mr-1" />Téléphone</th>
                {withExtraFields && <th className="p-2 text-left"><Briefcase className="w-3.5 h-3.5 inline mr-1" />Profession</th>}
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="p-1">
                    <input
                      value={entry.firstName || ''}
                      onChange={(e) => onEdit(i, 'firstName', e.target.value)}
                      onBlur={onBlurSave}
                      className="w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-emerald-400 rounded text-sm"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      value={entry.lastName || ''}
                      onChange={(e) => onEdit(i, 'lastName', e.target.value)}
                      onBlur={onBlurSave}
                      className="w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-emerald-400 rounded text-sm"
                    />
                  </td>
                  {withExtraFields && (
                    <td className="p-1">
                      <input
                        value={entry.birthDate || ''}
                        onChange={(e) => onEdit(i, 'birthDate', e.target.value)}
                        onBlur={onBlurSave}
                        className="w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-emerald-400 rounded text-sm"
                      />
                    </td>
                  )}
                  <td className="p-1">
                    <input
                      value={entry.phone || ''}
                      onChange={(e) => onEdit(i, 'phone', e.target.value)}
                      onBlur={onBlurSave}
                      className="w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-emerald-400 rounded text-sm"
                    />
                  </td>
                  {withExtraFields && (
                    <td className="p-1">
                      <input
                        value={entry.profession || ''}
                        onChange={(e) => onEdit(i, 'profession', e.target.value)}
                        onBlur={onBlurSave}
                        className="w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-emerald-400 rounded text-sm"
                      />
                    </td>
                  )}
                  <td className="p-1 text-right">
                    <button
                      onClick={() => onDelete(i)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SectionsManagement
