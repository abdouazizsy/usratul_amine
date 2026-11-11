import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Camera, CheckCircle, Lock, Send } from 'lucide-react'
import { addDoc, collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload'
import { MAX_PHOTO_BYTES, MEDIA_TYPES, ROLES } from '../utils/accreditation'

const emptyForm = { firstName: '', lastName: '', media: '', mediaType: '', role: '', phone: '', email: '', consent: false }

const AccreditationPage = () => {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const isAr = language === 'ar'
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'accreditation'))
      .then(snap => setSettings(snap.exists() ? snap.data() : { open: false }))
      .catch(err => {
        console.error('Error fetching accreditation settings:', err)
        setSettings({ open: false })
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => () => photoPreview && URL.revokeObjectURL(photoPreview), [photoPreview])

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > MAX_PHOTO_BYTES) {
      setError(t('accreditation.errorPhotoType'))
      return
    }
    setError('')
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!photoFile) {
      setError(t('accreditation.errorPhoto'))
      return
    }
    setSending(true)
    setError('')
    try {
      const photo = await uploadImageToCloudinary(photoFile, 'usratul-amine/accreditations')
      const { consent, ...fields } = form
      await addDoc(collection(db, 'accreditations'), {
        ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()])),
        photo,
        event: settings.eventName || '',
        status: 'pending',
        consent,
        language,
        createdAt: new Date()
      })
      setSent(true)
      setForm(emptyForm)
      setPhotoFile(null)
      setPhotoPreview(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Error sending accreditation:', err)
      setError(t('accreditation.errorSend'))
    } finally {
      setSending(false)
    }
  }

  const field = (name, type = 'text', extra = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t(`accreditation.${name}`)}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        required
        dir="auto"
        {...extra}
      />
    </div>
  )

  const select = (name, options, labelGroup) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t(`accreditation.${name}`)}</label>
      <select
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        required
      >
        <option value="">{t('accreditation.select')}</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{t(`accreditation.${labelGroup}.${o.id}`)}</option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="pt-28 pb-20 bg-gradient-to-b from-emerald-50/60 to-white min-h-[70vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className={`mb-8 ${isAr ? 'text-right' : ''}`}>
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700 mb-2">
              <BadgeCheck className="w-4 h-4" />
              {t('accreditation.navTitle')}
            </p>
            <h1 className={`text-4xl font-bold text-gray-900 mb-3 ${isAr ? 'font-arabic' : 'font-elegant'}`}>{t('accreditation.title')}</h1>
            <p className={`text-gray-600 ${isAr ? 'font-arabic' : ''}`}>{t('accreditation.subtitle')}</p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">{t('accreditation.loading')}</div>
          ) : sent ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-white border border-emerald-200 rounded-2xl p-10 shadow-sm">
              <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('accreditation.successTitle')}</h2>
              <p className={`text-gray-600 mb-6 ${isAr ? 'font-arabic' : ''}`}>{t('accreditation.successText')}</p>
              <button onClick={() => setSent(false)} className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                {t('accreditation.another')}
              </button>
            </motion.div>
          ) : !settings?.open ? (
            <div className="text-center bg-white border border-gray-200 rounded-2xl p-10">
              <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('accreditation.closedTitle')}</h2>
              <p className={`text-gray-600 ${isAr ? 'font-arabic' : ''}`}>{t('accreditation.closedText')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              {settings.eventName && (
                <div className="px-4 py-3 bg-emerald-50 rounded-xl">
                  <p className="text-xs font-semibold text-emerald-700">{t('accreditation.eventLabel')}</p>
                  <p className="font-bold text-emerald-900">{settings.eventName}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('accreditation.photo')}</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-700 rounded-xl text-sm font-semibold cursor-pointer hover:bg-emerald-50">
                      <Camera className="w-4 h-4" />
                      {photoPreview ? t('accreditation.changePhoto') : t('accreditation.choosePhoto')}
                      <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">{t('accreditation.photoHint')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('firstName', 'text', { autoComplete: 'given-name' })}
                {field('lastName', 'text', { autoComplete: 'family-name' })}
              </div>
              {field('media', 'text', { autoComplete: 'organization' })}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {select('mediaType', MEDIA_TYPES, 'mediaTypes')}
                {select('role', ROLES, 'roles')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('phone', 'tel', { autoComplete: 'tel', dir: 'ltr' })}
                {field('email', 'email', { autoComplete: 'email', dir: 'ltr' })}
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                  required
                />
                <span className={isAr ? 'font-arabic' : ''}>{t('accreditation.consent')}</span>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {sending ? t('accreditation.sending') : t('accreditation.submit')}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default AccreditationPage
