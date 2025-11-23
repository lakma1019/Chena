'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/our-services', label: 'Our Services' },
    { href: '/product-list', label: 'Products' },
    { href: '/user-instructions', label: 'Instructions' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact-us', label: 'Contact' },
  ]

  return (
    <nav className="relative">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
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

      {/* Desktop menu */}
      <ul className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/login/farmer-login"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Login
          </Link>
        </li>
      </ul>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-md md:hidden z-50">
          <ul className="py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login/farmer-login"
                className="block mx-4 my-2 text-center bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

