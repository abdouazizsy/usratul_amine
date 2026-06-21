import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Banknote, Smartphone, CheckCircle2 } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { useTranslation } from '../hooks/useTranslation'
import { useCart } from '../contexts/CartContext'

const ORDER_PHONE = '221771082626'

const PAYMENT_METHODS = [
  { id: 'wave', label: 'Wave', icon: Smartphone, locked: true },
  { id: 'orange_money', label: 'Orange Money', icon: Smartphone, locked: true },
  { id: 'cash', label: 'Espèces', icon: Banknote, locked: false }
]

const CheckoutPage = () => {
  const { t, language } = useTranslation()
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (items.length === 0 && !orderPlaced) {
    return <Navigate to="/panier" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'orders'), {
        items,
        total: totalPrice,
        customerName,
        customerPhone,
        paymentMethod,
        status: 'pending',
        createdAt: new Date()
      })

      const itemsSummary = items
        .map((item) => `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA)`)
        .join('\n')
      const message = `Bonjour, je viens de passer une commande sur le site Usratul Amine :\n${itemsSummary}\n\nTotal : ${totalPrice.toLocaleString('fr-FR')} FCFA\nPaiement : Espèces\nNom : ${customerName}\nTéléphone : ${customerPhone}`
      window.open(`https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(message)}`, '_blank')

      clearCart()
      setOrderPlaced(true)
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen">
        <Navigation scrolled={true} />
        <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 min-h-[60vh] flex items-center">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto mb-6" />
            <h1 className="text-3xl font-elegant font-bold text-gradient mb-4">
              {t('checkout.successTitle')}
            </h1>
            <p className="text-gray-700 mb-8">{t('checkout.successMessage')}</p>
            <button
              onClick={() => navigate('/produits')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              {t('cart.backToShop')}
            </button>
          </div>
        </section>
        <Footer />
        <Chatbot />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />

      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-gold-50 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl md:text-5xl font-elegant font-bold text-gradient mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('checkout.title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-gold-600 mx-auto"></div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8"
          >
            {/* Récapitulatif */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t('checkout.summary')}</h2>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-semibold text-gray-800">{t('cart.total')}</span>
                <span className="text-2xl font-bold text-emerald-700">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* Coordonnées */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t('checkout.contactInfo')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.name')}</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.phone')}</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    placeholder="77 000 00 00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Mode de paiement */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t('checkout.paymentMethod')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  const selected = paymentMethod === method.id
                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={method.locked}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        method.locked
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : selected
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      {method.locked && (
                        <Lock className="w-4 h-4 text-gray-400 absolute top-2 right-2" />
                      )}
                      <Icon className={`w-8 h-8 ${method.locked ? 'text-gray-400' : 'text-emerald-600'}`} />
                      <span className={`text-sm font-semibold ${method.locked ? 'text-gray-500' : 'text-gray-800'}`}>
                        {method.label}
                      </span>
                      {method.locked && (
                        <span className="text-xs text-gray-400">{t('checkout.comingSoon')}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {submitting ? t('checkout.processing') : t('checkout.confirmOrder')}
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default CheckoutPage
