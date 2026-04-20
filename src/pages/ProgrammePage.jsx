import React from 'react'
import Navigation from '../components/Navigation'
import ProgramDynamic from '../components/ProgramDynamic'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const ProgrammePage = () => {
  return (
    <div className="min-h-screen">
      <Navigation scrolled={true} />
      <ProgramDynamic />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default ProgrammePage
