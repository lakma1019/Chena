'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/services/api'

export default function OverviewTab() {
  // Hardcoded data from database
  const [stats, setStats] = useState({
    users: {
      total_farmers: 7,
      total_customers: 6,
      total_transport: 4,
      total_users: 18
    },
    products: {
      total_products: 7
    },
    orders: {
      total_orders: 6,
      pending_orders: 5,
      total_revenue: 4405.00
    },
    recentOrders: [
      {
        order_id: 7,
        order_number: "ORD1769310092171",
        customer_name: "Rasini Perera",
        total_amount: 1100.00,
        status: "pending",
        created_at: "2026-01-25T03:01:32.000Z"
      },
      {
        order_id: 6,
        order_number: "ORD1769306459736",
        customer_name: "Rasini Perera",
        total_amount: 1095.00,
        status: "pending",
        created_at: "2026-01-25T02:00:59.000Z"
      },
      {
        order_id: 4,
        order_number: "ORD1769303239564",
        customer_name: "Rasini Perera",
        total_amount: 300.00,
        status: "pending",
        created_at: "2026-01-25T01:07:19.000Z"
      },
      {
        order_id: 3,
        order_number: "ORD1769218781398",
        customer_name: "Rasini Perera",
        total_amount: 350.00,
        status: "pending",
        created_at: "2026-01-24T01:39:41.000Z"
      },
      {
        order_id: 2,
        order_number: "ORD1765089148318",
        customer_name: "Sunil Perera",
        total_amount: 350.00,
        status: "pending",
        created_at: "2025-12-07T06:32:28.000Z"
      }
    ]
  })
  const [loading, setLoading] = useState(false)

  // Commented out API call - using hardcoded data instead
  // useEffect(() => {
  //   loadDashboardStats()
  // }, [])

  // const loadDashboardStats = async () => {
  //   try {
  //     const response = await adminAPI.getDashboardStats()
  //     if (response.success) {
  //       setStats(response.data)
  //     }
  //   } catch (error) {
  //     console.error('Failed to load dashboard stats:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total_users || 0,
      icon: '👥',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Farmers',
      value: stats?.users?.total_farmers || 0,
      icon: '🌾',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Customers',
      value: stats?.users?.total_customers || 0,
      icon: '🛒',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Transport Providers',
      value: stats?.users?.total_transport || 0,
      icon: '🚚',
      color: 'bg-amber-500',
      textColor: 'text-amber-600'
    },
    {
      title: 'Total Products',
      value: stats?.products?.total_products || 0,
      icon: '📦',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Orders',
      value: stats?.orders?.total_orders || 0,
      icon: '📋',
      color: 'bg-pink-500',
      textColor: 'text-pink-600'
    },
    {
      title: 'Pending Orders',
      value: stats?.orders?.pending_orders || 0,
      icon: '⏳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${(stats?.orders?.total_revenue || 0).toLocaleString()}`,
      icon: '💰',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
              </div>
              <div className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order #</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{order.order_number}</td>
                    <td className="py-3 px-4 text-gray-600">{order.customer_name}</td>
                    <td className="py-3 px-4 text-gray-800 font-semibold">Rs. {order.total_amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

