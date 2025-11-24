'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null)

  const loginOptions = [
    {
      id: 'farmer',
      title: 'Login as a farmer.',
      description: 'Then you can add your products with price and directly meet the market.',
      image: '/images/login/farmer1.png',
      href: '/login/farmer-login',
      imagePosition: 'left'
    },
    {
      id: 'customer',
      title: 'Login as a customer.',
      description: 'Then you can purchase products which you want as fresh without going to the market.',
      image: '/images/login/login separatly/customer2.jpg',
      href: '/login/customer-login',
      imagePosition: 'right'
    },
    {
      id: 'transport',
      title: 'Login as a transport provider.',
      description: 'Then you can add your price per 1km to take hire for orders.',
      image: '/images/login/login separatly/tp2.jpg',
      href: '/login/transport-login',
      imagePosition: 'left'
    }
  ]

  return (
    <div className="min-h-screen bg-[#f5f5dc] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {loginOptions.map((option) => (
          <Link
            key={option.id}
            href={option.href}
            onMouseEnter={() => setSelectedRole(option.id)}
            onMouseLeave={() => setSelectedRole(null)}
            className={`
              block bg-white rounded-lg p-8 transition-all duration-300 cursor-pointer
              ${selectedRole === option.id ? 'border-4 border-[#87CEEB] shadow-xl' : 'border-2 border-transparent shadow-md'}
              hover:shadow-xl
            `}
          >
            <div className={`flex items-center gap-8 ${option.imagePosition === 'right' ? 'flex-row-reverse' : ''}`}>
              {/* Image Section */}
              <div className="flex-shrink-0">
                <Image
                  src={option.image}
                  alt={option.title}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Text Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {option.title}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

