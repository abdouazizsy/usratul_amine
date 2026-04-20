import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../contexts/AdminContext'
import { 
  Calendar, 
  Users, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { importTariqaEvents } from '../utils/importTariqaEvents'
import { importHadaraDjoumaToFirebase } from '../utils/importHadaraDjouma'
import ConfirmModal from './ConfirmModal'
import NotificationToast from './NotificationToast'
import UserManagement from './UserManagement'
import Settings from './Settings'

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAdmin()
  const [activeTab, setActiveTab] = useState('programs')
  const [programs, setPrograms] = useState([])
  const [tariqaEvents, setTariqaEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [dateConflict, setDateConflict] = useState(null)
  const [importing, setImporting] = useState(false)
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', onConfirm: null })
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' })

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    participants: ''
  })

  const [showTariqaForm, setShowTariqaForm] = useState(false)
  const [editingTariqaEvent, setEditingTariqaEvent] = useState(null)
  const [tariqaFormData, setTariqaFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: 'COSKAS',
    description: ''
  })

  // État Hadara Djouma
  const [hadaraDjoumaEvents, setHadaraDjoumaEvents] = useState([])
  const [showHadaraDjoumaForm, setShowHadaraDjoumaForm] = useState(false)
  const [editingHadaraDjouma, setEditingHadaraDjouma] = useState(null)
  const [importingHadara, setImportingHadara] = useState(false)
  const [hadaraDjoumaFormData, setHadaraDjoumaFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  })

  useEffect(() => {
    if (isAdmin) {
      fetchPrograms()
      fetchTariqaEvents()
      fetchHadaraDjoumaEvents()
    }
  }, [isAdmin])

  useEffect(() => {
    if (formData.date) {
      checkDateConflict(formData.date)
    } else {
      setDateConflict(null)
    }
  }, [formData.date])

  const fetchPrograms = async () => {
    try {
      const programsQuery = query(collection(db, 'programs'), orderBy('date', 'desc'))
      const querySnapshot = await getDocs(programsQuery)
      const programsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPrograms(programsData)
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTariqaEvents = async () => {
    try {
      const eventsQuery = query(collection(db, 'tariqa_events'), orderBy('date', 'asc'))
      const querySnapshot = await getDocs(eventsQuery)
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTariqaEvents(eventsData)
    } catch (error) {
      console.error('Error fetching tariqa events:', error)
    }
  }

  const fetchHadaraDjoumaEvents = async () => {
    try {
      const eventsQuery = query(collection(db, 'hadara_djouma_events'), orderBy('date', 'asc'))
      const querySnapshot = await getDocs(eventsQuery)
      const eventsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setHadaraDjoumaEvents(eventsData)
    } catch (error) {
      console.error('Error fetching hadara djouma events:', error)
    }
  }

  const handleImportHadaraDjouma = () => {
    setConfirmModal({
      isOpen: true,
      type: 'import',
      title: 'Importer le calendrier Abna\'u Hadara Tidiani',
      message: 'Voulez-vous importer les 70 Abna\'u Hadara Tidiani 2026/2027 ? Cette action ajoutera tous les événements du calendrier annuel officiel.',
      onConfirm: async () => {
        setImportingHadara(true)
        try {
          const result = await importHadaraDjoumaToFirebase()
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Importation réussie !',
            message: `${result.imported} Hadaras importées avec succès (${result.skipped} déjà existantes).`
          })
          fetchHadaraDjoumaEvents()
        } catch (error) {
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Erreur d\'importation',
            message: 'Une erreur est survenue lors de l\'importation.'
          })
        }
        setImportingHadara(false)
      }
    })
  }

  const handleHadaraDjoumaSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingHadaraDjouma) {
        await updateDoc(doc(db, 'hadara_djouma_events', editingHadaraDjouma.id), hadaraDjoumaFormData)
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Hadara modifiée',
          message: 'L\'Abna\'u Hadara Tidiani a été modifiée avec succès.'
        })
      } else {
        await addDoc(collection(db, 'hadara_djouma_events'), {
          ...hadaraDjoumaFormData,
          category: 'HADARA_DJOUMA',
          createdAt: new Date().toISOString()
        })
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Hadara ajoutée',
          message: 'L\'Abna\'u Hadara Tidiani a été ajoutée avec succès.'
        })
      }
      
      setHadaraDjoumaFormData({
        title: '',
        date: '',
        location: '',
        description: ''
      })
      setShowHadaraDjoumaForm(false)
      setEditingHadaraDjouma(null)
      fetchHadaraDjoumaEvents()
    } catch (error) {
      console.error('Error saving hadara djouma:', error)
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'enregistrer l\'Abna\'u Hadara Tidiani.'
      })
    }
  }

  const handleEditHadaraDjouma = (event) => {
    setEditingHadaraDjouma(event)
    setHadaraDjoumaFormData({
      title: event.title,
      date: event.date,
      location: event.location || '',
      description: event.description || ''
    })
    setShowHadaraDjoumaForm(true)
  }

  const handleDeleteHadaraDjouma = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer l\'Abna\'u Hadara Tidiani',
      message: 'Êtes-vous sûr de vouloir supprimer cette Abna\'u Hadara Tidiani ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'hadara_djouma_events', id))
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Hadara supprimée',
            message: 'L\'Abna\'u Hadara Tidiani a été supprimée avec succès.'
          })
          fetchHadaraDjoumaEvents()
        } catch (error) {
          console.error('Error deleting hadara djouma:', error)
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Erreur',
            message: 'Impossible de supprimer l\'Abna\'u Hadara Tidiani.'
          })
        }
      }
    })
  }

  const checkDateConflict = (selectedDate) => {
    const conflict = tariqaEvents.find(event => event.date === selectedDate)
    setDateConflict(conflict)
  }

  const handleImportTariqaEvents = () => {
    setConfirmModal({
      isOpen: true,
      type: 'import',
      title: 'Importer le calendrier COSKAS',
      message: 'Voulez-vous importer les 50+ événements du calendrier COSKAS 2025-2026 ? Cette action ajoutera tous les événements officiels de la Tariqa.',
      onConfirm: async () => {
        setImporting(true)
        const result = await importTariqaEvents()
        if (result.success) {
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Importation réussie !',
            message: `${result.count} événements ont été importés avec succès.`
          })
          fetchTariqaEvents()
        } else {
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Erreur d\'importation',
            message: result.message || 'Une erreur est survenue lors de l\'importation.'
          })
        }
        setImporting(false)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProgram) {
        await updateDoc(doc(db, 'programs', editingProgram.id), formData)
      } else {
        await addDoc(collection(db, 'programs'), {
          ...formData,
          createdAt: new Date()
        })
      }
      
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        participants: ''
      })
      setShowAddForm(false)
      setEditingProgram(null)
      fetchPrograms()
    } catch (error) {
      console.error('Error saving program:', error)
    }
  }

  const handleEdit = (program) => {
    setEditingProgram(program)
    setFormData({
      title: program.title,
      date: program.date,
      time: program.time,
      location: program.location,
      description: program.description,
      participants: program.participants
    })
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer le programme',
      message: 'Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'programs', id))
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Programme supprimé',
            message: 'Le programme a été supprimé avec succès.'
          })
          fetchPrograms()
        } catch (error) {
          console.error('Error deleting program:', error)
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Erreur',
            message: 'Impossible de supprimer le programme.'
          })
        }
      }
    })
  }

  const handleTariqaSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTariqaEvent) {
        await updateDoc(doc(db, 'tariqa_events', editingTariqaEvent.id), tariqaFormData)
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Événement modifié',
          message: 'L\'événement a été modifié avec succès.'
        })
      } else {
        await addDoc(collection(db, 'tariqa_events'), {
          ...tariqaFormData,
          createdAt: new Date()
        })
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Événement ajouté',
          message: 'L\'événement a été ajouté avec succès.'
        })
      }
      
      setTariqaFormData({
        title: '',
        date: '',
        location: '',
        category: 'COSKAS',
        description: ''
      })
      setShowTariqaForm(false)
      setEditingTariqaEvent(null)
      fetchTariqaEvents()
    } catch (error) {
      console.error('Error saving tariqa event:', error)
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'enregistrer l\'événement.'
      })
    }
  }

  const handleEditTariqaEvent = (event) => {
    setEditingTariqaEvent(event)
    setTariqaFormData({
      title: event.title,
      date: event.date,
      location: event.location || '',
      category: event.category || 'COSKAS',
      description: event.description || ''
    })
    setShowTariqaForm(true)
  }

  const handleDeleteTariqaEvent = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer l\'événement',
      message: 'Êtes-vous sûr de vouloir supprimer cet événement de la Tariqa ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'tariqa_events', id))
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Événement supprimé',
            message: 'L\'événement a été supprimé avec succès.'
          })
          fetchTariqaEvents()
        } catch (error) {
          console.error('Error deleting tariqa event:', error)
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Erreur',
            message: 'Impossible de supprimer l\'événement.'
          })
        }
      }
    })
  }

  if (!isAdmin) {
    return <div>Accès non autorisé</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gold-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-4 gap-3">
            <h1 className="text-lg sm:text-2xl font-bold text-emerald-800">
              Administration Usratul Amine
            </h1>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[180px] sm:max-w-none">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar desktop / Tabs horizontaux mobile */}
          <div className="lg:w-64 bg-white rounded-xl shadow-sm p-3 lg:p-6">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:space-y-2 scrollbar-hide">
              <button
                onClick={() => setActiveTab('programs')}
                className={`flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors whitespace-nowrap text-sm lg:text-base ${
                  activeTab === 'programs'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5 flex-shrink-0" />
                Programmes
              </button>
              <button
                onClick={() => setActiveTab('tariqa')}
                className={`flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors whitespace-nowrap text-sm lg:text-base ${
                  activeTab === 'tariqa'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5 flex-shrink-0" />
                Calendrier Hadara
              </button>
              <button
                onClick={() => setActiveTab('hadara-djouma')}
                className={`flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors whitespace-nowrap text-sm lg:text-base ${
                  activeTab === 'hadara-djouma'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                Abna'u Hadara Tidiani
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors whitespace-nowrap text-sm lg:text-base ${
                  activeTab === 'users'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors whitespace-nowrap text-sm lg:text-base ${
                  activeTab === 'settings'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SettingsIcon className="w-5 h-5 flex-shrink-0" />
                Paramètres
              </button>
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'programs' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Gestion des programmes
                  </h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un programme
                  </button>
                </div>

                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-6 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingProgram ? 'Modifier le programme' : 'Nouveau programme'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddForm(false)
                          setEditingProgram(null)
                          setFormData({
                            title: '',
                            date: '',
                            time: '',
                            location: '',
                            description: '',
                            participants: ''
                          })
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                          />
                        </div>
                      </div>

                      {dateConflict && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-yellow-800 mb-1">
                                Conflit avec un événement de la Tariqa
                              </h4>
                              <p className="text-sm text-yellow-700">
                                <strong>{dateConflict.title}</strong> est prévu le même jour à {dateConflict.location || 'un lieu non spécifié'}.
                              </p>
                              <p className="text-xs text-yellow-600 mt-2">
                                ⚠️ Il est recommandé de choisir une autre date pour éviter les chevauchements.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.date && !dateConflict && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-700">
                              Aucun conflit détecté avec le calendrier de la Tariqa
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heure
                          </label>
                          <input
                            type="text"
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ex: 14h00"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lieu
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Participants
                        </label>
                        <input
                          type="text"
                          value={formData.participants}
                          onChange={(e) => setFormData({...formData, participants: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ex: Tous, ABNA'U, Public..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {editingProgram ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false)
                            setEditingProgram(null)
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Chargement...</div>
                  </div>
                ) : programs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Aucun programme trouvé</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {programs.map((program, index) => {
                      const isFuture = new Date(program.date) > new Date()
                      return (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
                        >
                          {/* Barre de couleur en haut */}
                          <div className={`h-1.5 ${isFuture ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />
                          
                          <div className="p-4">
                            {/* En-tête avec titre et badge */}
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex-1 pr-2">
                                {program.title}
                              </h3>
                              {isFuture && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 flex-shrink-0">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                                  À venir
                                </span>
                              )}
                            </div>

                            {/* Informations avec icônes */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
                                  <Calendar className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-gray-500">Date</p>
                                  <p className="text-sm font-semibold truncate">{new Date(program.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-gray-500">Heure</p>
                                  <p className="text-sm font-semibold">{program.time}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex-shrink-0">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-gray-500">Lieu</p>
                                  <p className="text-sm font-semibold truncate">{program.location}</p>
                                </div>
                              </div>

                              {program.participants && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex-shrink-0">
                                    <Users className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500">Participants</p>
                                    <p className="text-sm font-semibold truncate">{program.participants}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                                {program.description}
                              </p>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(program)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDelete(program.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Supprimer
                              </button>
                            </div>
                          </div>

                          {/* Effet de brillance au survol */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'tariqa' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
              >
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Calendrier de la Hadara 2025-2026
                    </h2>
                    <div className="text-sm text-gray-600">
                      {tariqaEvents.length} événements
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setShowTariqaForm(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un événement
                      </button>
                      {tariqaEvents.length === 0 && (
                        <button
                          onClick={handleImportTariqaEvents}
                          disabled={importing}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          {importing ? 'Importation...' : 'Importer COSKAS'}
                        </button>
                      )}
                  </div>
                </div>

                {showTariqaForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-6 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingTariqaEvent ? 'Modifier l\'événement' : 'Nouvel événement Tariqa'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowTariqaForm(false)
                          setEditingTariqaEvent(null)
                          setTariqaFormData({
                            title: '',
                            date: '',
                            location: '',
                            category: 'COSKAS',
                            description: ''
                          })
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleTariqaSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre de l'événement
                          </label>
                          <input
                            type="text"
                            value={tariqaFormData.title}
                            onChange={(e) => setTariqaFormData({...tariqaFormData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={tariqaFormData.date}
                            onChange={(e) => setTariqaFormData({...tariqaFormData, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lieu
                          </label>
                          <input
                            type="text"
                            value={tariqaFormData.location}
                            onChange={(e) => setTariqaFormData({...tariqaFormData, location: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ex: Tivaouane"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Catégorie
                          </label>
                          <select
                            value={tariqaFormData.category}
                            onChange={(e) => setTariqaFormData({...tariqaFormData, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="COSKAS">COSKAS</option>
                            <option value="TAMKHARITE">TAMKHARITE</option>
                            <option value="AUTRES">AUTRES</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={tariqaFormData.description}
                          onChange={(e) => setTariqaFormData({...tariqaFormData, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Description de l'événement (optionnel)"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {editingTariqaEvent ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowTariqaForm(false)
                            setEditingTariqaEvent(null)
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {tariqaEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Aucun événement de la Tariqa enregistré
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Cliquez sur le bouton ci-dessus pour importer automatiquement les 50+ événements du calendrier COSKAS 2025-2026
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tariqaEvents.map((event) => {
                      const eventDate = new Date(event.date)
                      const isFuture = eventDate > new Date()
                      
                      return (
                        <div
                          key={event.id}
                          className={`border rounded-lg p-4 ${
                            isFuture ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-800">
                                  {event.title}
                                </h3>
                                {event.category && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                    {event.category}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {eventDate.toLocaleDateString('fr-FR', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                              {event.description && (
                                <p className="mt-2 text-sm text-gray-700">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {isFuture && (
                                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                                  À venir
                                </span>
                              )}
                              <button
                                onClick={() => handleEditTariqaEvent(event)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTariqaEvent(event.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'hadara-djouma' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
              >
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-gold-600 bg-clip-text text-transparent">
                        Abna'u Hadara Tidiani 2026/2027
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Calendrier annuel des Hadaratoul Jumu'ah
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {hadaraDjoumaEvents.length} Abna'u Hadara Tidiani
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setShowHadaraDjoumaForm(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-700 to-gold-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une Hadara
                    </button>
                    {hadaraDjoumaEvents.length === 0 && (
                      <button
                        onClick={handleImportHadaraDjouma}
                        disabled={importingHadara}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-gold-500 text-gray-900 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold text-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        {importingHadara ? 'Importation...' : 'Importer 70 événements'}
                      </button>
                    )}
                  </div>
                </div>

                {showHadaraDjoumaForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-gold-50 rounded-lg border border-emerald-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {editingHadaraDjouma ? 'Modifier la Hadara' : 'Nouvelle Hadara Abna\'u Hadara Tidiani'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowHadaraDjoumaForm(false)
                          setEditingHadaraDjouma(null)
                          setHadaraDjoumaFormData({
                            title: '',
                            date: '',
                            location: '',
                            description: ''
                          })
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleHadaraDjoumaSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de la Hadara
                          </label>
                          <input
                            type="text"
                            value={hadaraDjoumaFormData.title}
                            onChange={(e) => setHadaraDjoumaFormData({...hadaraDjoumaFormData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="ex: Tabaski, Gamou Tivaouine..."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={hadaraDjoumaFormData.date}
                            onChange={(e) => setHadaraDjoumaFormData({...hadaraDjoumaFormData, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lieu
                        </label>
                        <input
                          type="text"
                          value={hadaraDjoumaFormData.location}
                          onChange={(e) => setHadaraDjoumaFormData({...hadaraDjoumaFormData, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="ex: Tivaouine, National, Dakar..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (optionnel)
                        </label>
                        <textarea
                          value={hadaraDjoumaFormData.description}
                          onChange={(e) => setHadaraDjoumaFormData({...hadaraDjoumaFormData, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows={3}
                          placeholder="Description de la Hadara..."
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-700 to-gold-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Save className="w-4 h-4" />
                          {editingHadaraDjouma ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowHadaraDjoumaForm(false)
                            setEditingHadaraDjouma(null)
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {hadaraDjoumaEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-block p-6 bg-gradient-to-br from-emerald-100 to-gold-100 rounded-full mb-4">
                      <Sparkles className="w-16 h-16 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Aucune Abna'u Hadara Tidiani enregistrée
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      Cliquez sur "Importer 70 événements" pour ajouter automatiquement le calendrier annuel 2026/2027 avec toutes les Abna'u Hadara Tidiani.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hadaraDjoumaEvents.map((event) => {
                      const eventDate = new Date(event.date)
                      const isFuture = eventDate > new Date()
                      
                      return (
                        <div
                          key={event.id}
                          className={`border rounded-lg p-4 transition-all ${
                            isFuture 
                              ? 'bg-gradient-to-r from-emerald-50 to-gold-50 border-emerald-200 hover:shadow-md' 
                              : 'border-gray-100 bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-2">
                                <h3 className="font-semibold text-gray-800">
                                  {event.title}
                                </h3>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {eventDate.toLocaleDateString('fr-FR', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                              {event.description && (
                                <p className="mt-2 text-sm text-gray-700">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
                              {isFuture && (
                                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                                  À venir
                                </span>
                              )}
                              <button
                                onClick={() => handleEditHadaraDjouma(event)}
                                className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteHadaraDjouma(event.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <UserManagement 
                  setNotification={setNotification}
                  setConfirmModal={setConfirmModal}
                />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Settings setNotification={setNotification} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type === 'danger' ? 'danger' : 'warning'}
        confirmText={confirmModal.type === 'danger' ? 'Supprimer' : 'Confirmer'}
      />

      <NotificationToast
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  )
}

export default AdminDashboard
