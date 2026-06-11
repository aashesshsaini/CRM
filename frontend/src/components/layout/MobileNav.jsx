import { useEffect } from 'react'
import Sidebar from './Sidebar.jsx'

export default function MobileNav({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-64 h-full shadow-xl animate-in slide-in-from-left duration-200">
        <Sidebar mobile onClose={onClose} />
      </div>
    </div>
  )
}
