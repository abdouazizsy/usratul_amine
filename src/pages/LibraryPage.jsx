import React from 'react'
import Navigation from '../components/Navigation'
import Library from '../components/Library'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const LibraryPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />
      <Library />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default LibraryPage
