import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import About from '../components/About'
import Pins from '../components/Pins'
import Biography from '../components/Biography'
import Memories from '../components/Memories'
import Library from '../components/Library'
import Message from '../components/Message'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroller vers la section si un hash est présent dans l'URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [location])

  return (
    <div className="min-h-screen">
      <Navigation scrolled={scrolled} />
      <Hero />
      <About />
      <Pins />
      <Biography />
      <Memories />
      <Library />
      <Message />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default HomePage
