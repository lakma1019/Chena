'use client'

import { useState, useEffect } from 'react'

export default function DeliveriesTab() {
  const [activeSubTab, setActiveSubTab] = useState('assigned')
  // TODO: Fetch real deliveries from backend API when implemented
  // For now, initialize with empty array to avoid showing fake data
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    if (activeSubTab === 'all') return true
    return delivery.status === activeSubTab
  })

  const handleUpdateStatus = (deliveryId, newStatus) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
    ))
    alert(`Delivery ${deliveryId} status updated to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Delivery Management</h2>
        <p className="text-yellow-100">Manage your deliveries and track progress</p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveSubTab('assigned')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSubTab === 'assigned'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🚚 Assigned ({deliveries.filter(d => d.status === 'assigned').length})
          </button>
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSubTab === 'pending'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⏳ Pending ({deliveries.filter(d => d.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveSubTab('completed')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSubTab === 'completed'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Completed ({deliveries.filter(d => d.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No deliveries found</p>
            </div>
          ) : (
            filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                {/* Delivery Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Delivery #{delivery.id}</h3>
                    <p className="text-sm text-gray-500">Order: {delivery.orderId} | Assigned: {new Date(delivery.assignedDate).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(delivery.status)}`}>
                    {delivery.status.toUpperCase()}
                  </div>
                </div>

                {/* Customer & Address Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Customer:</p>
                    <p className="text-gray-800">{delivery.customerName}</p>
                    <p className="text-sm text-gray-600">{delivery.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Delivery Fee:</p>
                    <p className="text-xl font-bold text-yellow-600">Rs. {delivery.deliveryFee.toFixed(2)}</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-semibold mb-1">📍 Pickup:</p>
                    <p className="text-gray-800">{delivery.pickupAddress}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-semibold mb-1">🏠 Delivery:</p>
                    <p className="text-gray-800">{delivery.deliveryAddress}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Products:</p>
                  <div className="space-y-1">
                    {delivery.products.map((product, index) => (
                      <p key={index} className="text-gray-700 text-sm">
                        • {product.name} ({product.weight}) x {product.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  {delivery.status === 'assigned' && (
                    <button
                      onClick={() => handleUpdateStatus(delivery.id, 'completed')}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {delivery.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(delivery.id, 'assigned')}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Accept Delivery
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  )
}

