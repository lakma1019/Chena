'use client'

import { useState } from 'react'

export default function OrdersTab() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'Nimal Silva',
      customerPhone: '+94 77 234 5678',
      customerAddress: 'No. 12, Main Street, Colombo 07',
      products: [
        { name: 'Fresh Tomatoes', quantity: 5, weight: '1kg', price: 150.00 },
        { name: 'Papaya', quantity: 2, weight: '1kg', price: 180.00 }
      ],
      totalAmount: 1110.00,
      orderDate: '2024-11-28',
      status: 'pending',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: 'ORD002',
      customerName: 'Kamala Perera',
      customerPhone: '+94 71 345 6789',
      customerAddress: 'No. 45, Lake Road, Kandy',
      products: [
        { name: 'Carrot', quantity: 10, weight: '500g', price: 120.00 }
      ],
      totalAmount: 1200.00,
      orderDate: '2024-11-28',
      status: 'processing',
      paymentMethod: 'Online Payment'
    },
    {
      id: 'ORD003',
      customerName: 'Suresh Fernando',
      customerPhone: '+94 76 456 7890',
      customerAddress: 'No. 78, Beach Road, Galle',
      products: [
        { name: 'Fresh Tomatoes', quantity: 3, weight: '1kg', price: 150.00 },
        { name: 'Carrot', quantity: 5, weight: '500g', price: 120.00 }
      ],
      totalAmount: 1050.00,
      orderDate: '2024-11-27',
      status: 'ready',
      paymentMethod: 'Cash on Delivery'
    }
  ])

  const [filterStatus, setFilterStatus] = useState('all')

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    alert(`Order ${orderId} status updated to ${newStatus}`)
  }

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.status === filterStatus
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'ready': return 'bg-green-100 text-green-700 border-green-300'
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Current Orders</h2>
        <div className="text-sm text-gray-600">
          Total Orders: <span className="font-bold text-green-600">{orders.length}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            filterStatus === 'all'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({orders.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            filterStatus === 'pending'
              ? 'bg-yellow-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('processing')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            filterStatus === 'processing'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Processing ({orders.filter(o => o.status === 'processing').length})
        </button>
        <button
          onClick={() => setFilterStatus('ready')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            filterStatus === 'ready'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Ready ({orders.filter(o => o.status === 'ready').length})
        </button>
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

              {/* Customer Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Customer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-600">Name:</span> <span className="font-semibold">{order.customerName}</span></p>
                  <p><span className="text-gray-600">Phone:</span> <span className="font-semibold">{order.customerPhone}</span></p>
                  <p className="md:col-span-2"><span className="text-gray-600">Address:</span> <span className="font-semibold">{order.customerAddress}</span></p>
                </div>
              </div>

              {/* Products */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Products</h4>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-3">
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.weight} × {product.quantity}</p>
                      </div>
                      <p className="font-bold text-green-600">Rs. {(product.price * product.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex justify-between items-center border-t-2 pt-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">Rs. {order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'processing')}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                  >
                    ▶ Start Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'ready')}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                  >
                    ✓ Mark as Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'completed')}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
                  >
                    ✓ Complete Order
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all">
                  📞 Contact Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

