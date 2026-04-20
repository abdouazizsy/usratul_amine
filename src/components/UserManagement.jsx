import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Edit, Trash2, Save, X, Mail, Lock, Shield, UserCheck } from 'lucide-react'
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { auth, db } from '../firebase/config'
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore'

const UserManagement = ({ setNotification, setConfirmModal }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'admin'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(usersQuery)
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        // Mise à jour de l'utilisateur dans Firestore
        await updateDoc(doc(db, 'users', editingUser.id), {
          displayName: formData.displayName,
          role: formData.role,
          updatedAt: new Date()
        })
        
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Utilisateur modifié',
          message: 'Les informations ont été mises à jour avec succès.'
        })
      } else {
        // Création d'un nouvel utilisateur dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )

        // Enregistrement dans Firestore
        await addDoc(collection(db, 'users'), {
          uid: userCredential.user.uid,
          email: formData.email,
          displayName: formData.displayName,
          role: formData.role,
          createdAt: new Date(),
          isActive: true
        })

        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Utilisateur créé',
          message: `L'utilisateur ${formData.email} a été créé avec succès.`
        })
      }

      setFormData({
        email: '',
        password: '',
        displayName: '',
        role: 'admin'
      })
      setShowAddForm(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Error saving user:', error)
      let errorMessage = 'Impossible de créer l\'utilisateur.'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'L\'adresse email est invalide.'
      }

      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: errorMessage
      })
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      displayName: user.displayName,
      role: user.role
    })
    setShowAddForm(true)
  }

  const handleDelete = (user) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Supprimer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ? Cette action est irréversible.`,
      onConfirm: async () => {
        try {
          // Suppression de Firestore
          await deleteDoc(doc(db, 'users', user.id))
          
          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Utilisateur supprimé',
            message: 'L\'utilisateur a été supprimé avec succès.'
          })
          fetchUsers()
        } catch (error) {
          console.error('Error deleting user:', error)
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Erreur',
            message: 'Impossible de supprimer l\'utilisateur.'
          })
        }
      }
    })
  }

  const toggleUserStatus = async (user) => {
    try {
      await updateDoc(doc(db, 'users', user.id), {
        isActive: !user.isActive,
        updatedAt: new Date()
      })
      
      setNotification({
        isOpen: true,
        type: 'success',
        title: user.isActive ? 'Utilisateur désactivé' : 'Utilisateur activé',
        message: `L'utilisateur a été ${user.isActive ? 'désactivé' : 'activé'} avec succès.`
      })
      fetchUsers()
    } catch (error) {
      console.error('Error toggling user status:', error)
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de modifier le statut de l\'utilisateur.'
      })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Gestion des utilisateurs
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un utilisateur
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
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingUser(null)
                setFormData({
                  email: '',
                  password: '',
                  displayName: '',
                  role: 'admin'
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
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="ex: Abdou Aziz Sy"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="email@example.com"
                    required
                    disabled={editingUser}
                  />
                </div>
              </div>
            </div>

            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Minimum 6 caractères"
                    required={!editingUser}
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="admin">Administrateur</option>
                  <option value="editor">Éditeur</option>
                  <option value="viewer">Lecteur</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingUser ? 'Mettre à jour' : 'Créer l\'utilisateur'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingUser(null)
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
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    user.isActive ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <Users className={`w-6 h-6 ${
                      user.isActive ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {user.displayName}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'editor'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' : user.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                      </span>
                      {!user.isActive && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                          Désactivé
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                    {user.createdAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Créé le {new Date(user.createdAt.seconds * 1000).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUserStatus(user)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.isActive
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={user.isActive ? 'Désactiver' : 'Activer'}
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserManagement
