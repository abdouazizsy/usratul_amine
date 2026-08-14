import React from 'react'
import { BookOpen } from 'lucide-react'

const AuteurBadge = ({ name, photo, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 focus:outline-none"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-amber-400 via-amber-300 to-emerald-700 shadow-lg group-hover:scale-105 transition-transform duration-300">
        <div className="w-full h-full rounded-full bg-white p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center">
            {photo ? (
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-10 h-10 text-emerald-300" />
            )}
          </div>
        </div>
      </div>
      <span className="px-4 py-2 bg-white border border-emerald-100 shadow-sm text-emerald-800 font-semibold text-sm rounded-xl text-center max-w-[160px] leading-snug">
        {name}
      </span>
    </button>
  )
}

export default AuteurBadge
