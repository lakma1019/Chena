'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { tokenManager } from '@/services/api'

export default function AdminDirectAccess() {
  const router = useRouter()

  useEffect(() => {
    // Create a temporary admin session
    const createTempSession = () => {
      // Create a fake token (this is just for frontend bypass - backend will still need proper auth)
      const fakeToken = 'temp-admin-access-token'
      
      // Store in localStorage
      localStorage.setItem('accessToken', fakeToken)
      localStorage.setItem('refreshToken', fakeToken)
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('userData', JSON.stringify({
        userId: 1,
        email: 'admin@gmail.com',
        userType: 'admin',
        fullName: 'System Administrator'
      }))

      console.log('✅ Temporary admin session created')
      console.log('⚠️ WARNING: This is a temporary bypass. Backend API calls may still fail without proper authentication.')
      
      // Redirect to admin dashboard
      setTimeout(() => {
        router.push('/admin-dashboard')
      }, 1000)
    }

    createTempSession()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
          <span className="text-5xl">🔓</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Creating Admin Session...</h1>
        <p className="text-gray-400 mb-2">Bypassing authentication for direct access</p>
        <p className="text-yellow-400 text-sm">⚠️ Temporary access - for development only</p>
        <div className="mt-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  )
}

