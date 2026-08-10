import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import ComingSoonPage from './ComingSoonPage'

const LaunchGate = ({ children }) => {
  const location = useLocation()
  const [status, setStatus] = useState('loading') // loading | gated | open
  const [targetDate, setTargetDate] = useState(null)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'launch'))
        if (cancelled) return
        const data = snap.exists() ? snap.data() : null

        if (data?.enabled && data?.launchDate) {
          const target = new Date(data.launchDate)
          if (!isNaN(target.getTime()) && target > new Date()) {
            setTargetDate(target)
            setStatus('gated')
            return
          }
        }
        setStatus('open')
      } catch (error) {
        console.error('LaunchGate: erreur de vérification', error)
        setStatus('open')
      }
    }

    check()
    return () => { cancelled = true }
  }, [])

  if (location.pathname.startsWith('/admin')) return children
  if (status === 'loading') return <div className="min-h-screen bg-emerald-950" />
  if (status === 'gated') {
    return <ComingSoonPage targetDate={targetDate} onReveal={() => setStatus('open')} />
  }
  return children
}

export default LaunchGate
