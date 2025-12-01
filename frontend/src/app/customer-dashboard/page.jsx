'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileTab from '@/components/customer-profile/ProfileTab'
import ViewProductsTab from '@/components/customer-profile/ViewProductsTab'
import CartTab from '@/components/customer-profile/CartTab'
import OrdersTab from '@/components/customer-profile/OrdersTab'

export default function CustomerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [cartItemCount, setCartItemCount] = useState(0)

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('customerLoggedIn')
    if (!isLoggedIn) {
      router.push('/login/customer-login')
    }
  }, [router])

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartItemCount(totalItems)
    }

    updateCartCount()
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount)
    return () => window.removeEventListener('cartUpdated', updateCartCount)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('customerLoggedIn')
    localStorage.removeItem('customerEmail')
    router.push('/login/customer-login')
  }

  const menuItems = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'products', name: 'View Products', icon: '🛒' },
    { id: 'cart', name: 'Cart', icon: '🛍️', badge: cartItemCount },
    { id: 'orders', name: 'Orders', icon: '📦' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-50 to-cyan-50 text-gray-800 transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Header */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h2 className="text-xl font-bold text-blue-700">Customer Portal</h2>
                <p className="text-sm text-blue-600">Chena Platform</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-700"
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
                  className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} p-3 rounded-lg transition-all relative ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'hover:bg-blue-100 text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="ml-3 font-semibold">{item.name}</span>
                  )}
                  {item.badge > 0 && (
                    <span className={`absolute ${isSidebarOpen ? 'right-3' : 'top-1 right-1'} bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md`}
          >
            <span className="text-2xl">🚪</span>
            {isSidebarOpen && (
              <span className="ml-3 font-semibold">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-md p-6 border-b-4 border-blue-600">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.name}
              </h1>
              <p className="text-gray-600 mt-1">Welcome to your customer dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{localStorage.getItem('customerEmail')}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {localStorage.getItem('customerEmail')?.charAt(0).toUpperCase() || 'C'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'products' && <ViewProductsTab />}
          {activeTab === 'cart' && <CartTab />}
          {activeTab === 'orders' && <OrdersTab />}
        </div>
      </main>
    </div>
  )
}

