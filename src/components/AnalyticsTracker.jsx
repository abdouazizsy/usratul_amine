import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { logEvent } from 'firebase/analytics'
import { analytics } from '../firebase/config'

const AnalyticsTracker = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (!analytics) return
    logEvent(analytics, 'page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title
    })
  }, [pathname, search])

  return null
}

export default AnalyticsTracker
