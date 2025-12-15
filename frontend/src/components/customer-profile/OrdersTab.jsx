'use client'

import { useState, useEffect } from 'react'
import { orderAPI } from '@/services/api'
import { generateInvoice } from '@/utils/invoiceGenerator'
import { showAlert, showConfirm } from '@/utils/notifications'

export default function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await orderAPI.getCustomerOrders()
      if (response.success) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.order_status === filterStatus
  )

  const handleCancelOrder = async (orderId) => {
    const confirmed = await showConfirm('Are you sure you want to cancel this order?')
    if (confirmed) {
      // TODO: Implement cancel order API
      await showAlert('Cancel order functionality will be implemented soon', 'info')
    }
  }

  const handleDownloadInvoice = async (order) => {
    try {
      generateInvoice(order)
    } catch (error) {
      console.error('Failed to generate invoice:', error)
      await showAlert('Failed to generate invoice. Please try again.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">My Orders</h2>
        <p className="text-blue-100">Track and manage your orders</p>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({orders.filter(o => o.order_status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('processing')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filterStatus === 'processing'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Processing ({orders.filter(o => o.order_status === 'processing').length})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filterStatus === 'delivered'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered ({orders.filter(o => o.order_status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all'
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `No ${filterStatus} orders found.`}
            </p>
            <button
              onClick={() => window.location.href = '/customer-dashboard?tab=products'}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.order_id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{order.order_number}</h3>
                  <p className="text-sm text-gray-500">Date: {new Date(order.order_date).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(order.order_status)}`}>
                  {order.order_status.toUpperCase()}
                </div>
              </div>

              {/* Order Products */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-700 mb-3">Products:</h4>
                <div className="space-y-2">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product_name} ({item.weight_unit}) x {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-800">
                        Rs. {parseFloat(item.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Delivery Address:</p>
                  <p className="font-semibold text-gray-800">{order.delivery_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method:</p>
                  <p className="font-semibold text-gray-800">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status:</p>
                  <p className="font-semibold text-gray-800 capitalize">{order.payment_status}</p>
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <div className="text-xl font-bold text-blue-600">
                  Total: Rs. {parseFloat(order.total_amount).toFixed(2)}
                </div>
                <div className="flex gap-3">
                  {/* Download Invoice Button */}
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Invoice
                  </button>

                  {/* Cancel Order Button */}
                  {(order.order_status === 'pending' || order.order_status === 'processing') && (
                    <button
                      onClick={() => handleCancelOrder(order.order_id)}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

