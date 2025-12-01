'use client'

import { useState } from 'react'

export default function OrdersTab() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      orderDate: '2024-11-25',
      status: 'delivered',
      products: [
        { name: 'Fresh Tomatoes', quantity: 2, weight: '500g', price: 180.00 },
        { name: 'Carrot', quantity: 1, weight: '500g', price: 200.00 }
      ],
      totalAmount: 760.00,
      deliveryAddress: 'No. 45, Main Street, Colombo 07',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: 'ORD002',
      orderDate: '2024-11-28',
      status: 'processing',
      products: [
        { name: 'Papaya', quantity: 2, weight: '1kg', price: 180.00 },
        { name: 'Avocado', quantity: 3, weight: '250g', price: 150.00 }
      ],
      totalAmount: 1010.00,
      deliveryAddress: 'No. 45, Main Street, Colombo 07',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: 'ORD003',
      orderDate: '2024-11-29',
      status: 'pending',
      products: [
        { name: 'Cabbage', quantity: 1, weight: '1kg', price: 180.00 },
        { name: 'Beetroot', quantity: 2, weight: '500g', price: 200.00 }
      ],
      totalAmount: 780.00,
      deliveryAddress: 'No. 45, Main Street, Colombo 07',
      paymentMethod: 'Cash on Delivery'
    }
  ])

  const [filterStatus, setFilterStatus] = useState('all')

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
    filterStatus === 'all' || order.status === filterStatus
  )

  const handleCancelOrder = (orderId) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ))
      alert(`Order ${orderId} has been cancelled`)
    }
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
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('processing')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filterStatus === 'processing'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Processing ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filterStatus === 'delivered'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </div>
              </div>

              {/* Order Products */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-700 mb-3">Products:</h4>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {product.name} ({product.weight}) x {product.quantity}
                      </span>
                      <span className="font-semibold text-gray-800">
                        Rs. {(product.price * product.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Delivery Address:</p>
                  <p className="font-semibold text-gray-800">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method:</p>
                  <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <div className="text-xl font-bold text-blue-600">
                  Total: Rs. {order.totalAmount.toFixed(2)}
                </div>
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

