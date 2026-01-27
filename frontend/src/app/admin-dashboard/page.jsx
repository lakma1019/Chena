'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OverviewTab from '@/components/admin-dashboard/OverviewTab'
import UsersTab from '@/components/admin-dashboard/UsersTab'
import ProductsTab from '@/components/admin-dashboard/ProductsTab'
import OrdersTab from '@/components/admin-dashboard/OrdersTab'
import { authAPI, tokenManager } from '@/services/api'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = tokenManager.getAccessToken()
      const userType = localStorage.getItem('userType')

      if (!accessToken || userType !== 'admin') {
        router.push('/login/admin-login')
        return
      }

      try {
        // Fetch current user data from backend using JWT token
        const response = await authAPI.getCurrentUser()
        if (response.success) {
          setUserData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        // Token might be invalid, redirect to login
        tokenManager.clearTokens()
        router.push('/login/admin-login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    authAPI.logout()
    router.push('/login/admin-login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'orders', name: 'Orders', icon: '🛒' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-100 to-violet-100 text-gray-800 transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Header */}
        <div className="p-6 border-b border-red-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h2 className="text-xl font-bold text-black-700">Admin Portal</h2>
                <p className="text-sm text-black-600">Chena Platform</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-700"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'hover:bg-purple-100 text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {isSidebarOpen && <span className="font-semibold">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-red-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg"
          >
            <span className="text-2xl">🚪</span>
            {isSidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-md p-6 border-b-4 border-red-600">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.name}
              </h1>
              <p className="text-gray-600 mt-1">Welcome to the admin dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{userData?.email || 'Loading...'}</p>
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {userData?.fullName?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
        </div>
      </main>
    </div>
  )
}

