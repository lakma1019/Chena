'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const tabs = [
    { name: 'Home', href: '/' },
    { name: 'Our Services', href: '/our-services' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Login', href: '/login' }
  ]

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-[#1e6b3e] py-1.5 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between px-6">
        {/* Logo Section - Left Corner */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <span className="text-white text-2xl font-bold tracking-wide">CHENA</span>
          <Image
            src="/images/header/header.png"
            alt="CHENA Logo"
            width={180}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation Tabs - Right Corner */}
        <nav className="hidden md:flex gap-10">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                bg-white text-gray-800 px-4 py-1 rounded-full
                font-medium transition-all duration-200 text-sm
                hover:bg-gray-50 cursor-pointer
                ${isActive(tab.href) ? 'border-4 border-[#90EE90]' : 'border-2 border-transparent'}
              `}
            >
              {tab.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md text-white hover:bg-green-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 px-6">
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  bg-white text-gray-800 px-4 py-1 rounded-full
                  font-medium transition-all duration-200 text-center text-sm
                  hover:bg-gray-50 cursor-pointer
                  ${isActive(tab.href) ? 'border-4 border-[#90EE90]' : 'border-2 border-transparent'}
                `}
                onClick={() => setIsOpen(false)}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}