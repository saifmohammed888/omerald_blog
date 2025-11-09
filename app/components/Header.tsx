'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.jpg"
                alt="Omerald Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Omerald</h1>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors">
              HOME
            </Link>
            <Link href="/articles" className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors">
              ARTICLES
            </Link>
            <Link href="/health-topics" className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors">
              HEALTH TOPICS
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors">
              CONTACT US
            </Link>
            <div className="relative ml-4">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-full text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </nav>
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            {/* Logo at top */}
            <div className="border-b border-gray-200 px-6 py-4">
              <Link 
                href="/" 
                onClick={closeMenu}
                className="flex items-center space-x-3"
              >
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo.jpg"
                    alt="Omerald Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Omerald</h1>
                </div>
              </Link>
            </div>
            
            <nav className="flex flex-col p-6 space-y-4">
              <Link 
                href="/" 
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors py-2"
              >
                HOME
              </Link>
              <Link 
                href="/articles" 
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors py-2"
              >
                ARTICLES
              </Link>
              <Link 
                href="/health-topics" 
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors py-2"
              >
                HEALTH TOPICS
              </Link>
              <Link 
                href="/contact" 
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 font-semibold text-sm uppercase tracking-wide transition-colors py-2"
              >
                CONTACT US
              </Link>
              
              {/* Mobile Search */}
              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}

