import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Heart, Users, Calendar, Mail, Phone, MapPin, Star, Sparkles } from 'lucide-react'
import Hero from './components/Hero'
import About from './components/About'
import Pins from './components/Pins'
import Biography from './components/Biography'
import Program from './components/Program'
import Library from './components/Library'
import Message from './components/Message'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation scrolled={scrolled} />
      <Hero />
      <About />
      <Pins />
      <Biography />
      <Program />
      <Library />
      <Message />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
