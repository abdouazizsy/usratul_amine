import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Save, Eye, EyeOff, User, Mail, Rocket, AlertTriangle } from 'lucide-react'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useAdmin } from '../contexts/AdminContext'

const Settings = ({ setNotification }) => {
  const { user } = useAdmin()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [launchEnabled, setLaunchEnabled] = useState(false)
  const [launchDate, setLaunchDate] = useState('')
  const [loadingLaunch, setLoadingLaunch] = useState(true)
  const [savingLaunch, setSavingLaunch] = useState(false)

  useEffect(() => {
    const fetchLaunchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'launch'))
        if (snap.exists()) {
          const data = snap.data()
          const isPast = data.launchDate && new Date(data.launchDate) <= new Date()

          if (data.enabled && isPast) {
            // La date est passée : le site est déjà revenu en ligne pour tout le monde,
            // on décoche automatiquement pour éviter de rester "activé" indéfiniment.
            setLaunchEnabled(false)
            setDoc(doc(db, 'settings', 'launch'), { enabled: false }, { merge: true }).catch((error) => {
              console.error('Error auto-disabling launch settings:', error)
            })
          } else {
            setLaunchEnabled(!!data.enabled)
          }
          setLaunchDate(data.launchDate || '')
        }
      } catch (error) {
        console.error('Error fetching launch settings:', error)
      } finally {
        setLoadingLaunch(false)
      }
    }
    fetchLaunchSettings()
  }, [])

  const handleSaveLaunch = async (e) => {
    e.preventDefault()
    if (launchEnabled && !launchDate) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Choisissez une date et une heure de lancement.'
      })
      return
    }

    setSavingLaunch(true)
    try {
      await setDoc(doc(db, 'settings', 'launch'), {
        enabled: launchEnabled,
        launchDate
      }, { merge: true })
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Paramètres enregistrés',
        message: launchEnabled
          ? 'Le site affichera le compte à rebours jusqu\'à la date choisie.'
          : 'Le compte à rebours est désactivé, le site est accessible normalement.'
      })
    } catch (error) {
      console.error('Error saving launch settings:', error)
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'enregistrer les paramètres de lancement.'
      })
    } finally {
      setSavingLaunch(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Les mots de passe ne correspondent pas'
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      })
      return
    }

    setLoading(true)

    try {
      // Ré-authentification nécessaire pour changer le mot de passe
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      )
      await reauthenticateWithCredential(user, credential)

      // Mise à jour du mot de passe
      await updatePassword(user, passwordData.newPassword)

      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Mot de passe modifié',
        message: 'Votre mot de passe a été modifié avec succès'
      })

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Password change error:', error)
      let errorMessage = 'Impossible de modifier le mot de passe'

      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Le mot de passe actuel est incorrect'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le nouveau mot de passe est trop faible'
      }

      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Paramètres du compte
      </h2>

      {/* Informations du compte */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Informations du compte
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Nom d'utilisateur</p>
              <p className="font-medium text-gray-800">{user?.displayName || 'Non défini'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Changement de mot de passe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gray-50 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Changer le mot de passe
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Répétez le nouveau mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </motion.div>

      {/* Lancement du site / compte à rebours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-gray-50 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          Lancement du site
        </h3>

        {loadingLaunch ? (
          <div className="text-gray-500 text-sm">Chargement...</div>
        ) : (
          <form onSubmit={handleSaveLaunch} className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={launchEnabled}
                onChange={(e) => setLaunchEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Activer la page de compte à rebours (masque le site jusqu'à la date choisie)
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date et heure de lancement
              </label>
              <input
                type="datetime-local"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={!launchEnabled}
              />
            </div>

            {launchEnabled && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  Tant que c'est activé, tous les visiteurs verront le compte à rebours à la place du site.
                  L'espace admin reste toujours accessible pour toi. Le site redevient public automatiquement
                  à l'heure choisie, sans avoir besoin de revenir ici.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={savingLaunch}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {savingLaunch ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        )}
      </motion.div>

      {/* Conseils de sécurité */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Conseils de sécurité</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Utilisez au moins 8 caractères</li>
          <li>• Mélangez lettres majuscules et minuscules</li>
          <li>• Incluez des chiffres et des symboles</li>
          <li>• Évitez les mots de passe évidents</li>
          <li>• Ne partagez jamais votre mot de passe</li>
        </ul>
      </div>
    </div>
  )
}

export default Settings
