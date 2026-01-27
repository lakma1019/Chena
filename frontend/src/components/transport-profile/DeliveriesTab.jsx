'use client'

import { useState, useEffect } from 'react'
import { transportAPI } from '@/services/api'

export default function DeliveriesTab() {
  const [activeSubTab, setActiveSubTab] = useState('assigned')
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  // Load deliveries on component mount
  useEffect(() => {
    loadDeliveries()
  }, [])

  /**
   * Fetch all deliveries assigned to the transport provider
   */
  const loadDeliveries = async () => {
    try {
      setLoading(true)
      console.log('Loading deliveries...')
      const response = await transportAPI.getDeliveries()
      console.log('Deliveries response:', response)

      if (response.success) {
        setDeliveries(response.data || [])
        console.log('Deliveries loaded:', response.data)
      } else {
        console.error('Failed to load deliveries:', response.message)
        alert(`Failed to load deliveries: ${response.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to load deliveries - Error:', error)
      console.error('Error details:', error.message, error.stack)
      alert(`Failed to load deliveries. Error: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Open update status modal for a delivery
   */
  const handleOpenUpdateModal = (delivery) => {
    setSelectedDelivery(delivery)
    setNewStatus(delivery.delivery_status)
    setSpecialNotes(delivery.special_notes || '')
    setShowUpdateModal(true)
  }

  /**
   * Update delivery status and special notes
   */
  const handleUpdateDelivery = async () => {
    if (!newStatus) {
      alert('Please select a status')
      return
    }

    try {
      setUpdating(true)
      const response = await transportAPI.updateDeliveryStatus(selectedDelivery.delivery_id, {
        status: newStatus,
        specialNotes: specialNotes,
      })

      if (response.success) {
        alert('Delivery updated successfully!')
        setShowUpdateModal(false)
        loadDeliveries() // Reload deliveries to show updated status
      }
    } catch (error) {
      console.error('Failed to update delivery:', error)
      alert('Failed to update delivery. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  /**
   * Get color classes for delivery status badges
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'picked_up':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300'
      case 'in_progress':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'in_transit':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  /**
   * Filter deliveries based on selected tab
   */
  const filteredDeliveries = deliveries.filter(delivery => {
    if (activeSubTab === 'all') return true
    if (activeSubTab === 'assigned') {
      return delivery.delivery_status === 'assigned' || delivery.delivery_status === 'picked_up'
    }
    if (activeSubTab === 'in_progress') {
      return delivery.delivery_status === 'in_progress' || delivery.delivery_status === 'in_transit'
    }
    if (activeSubTab === 'completed') {
      return delivery.delivery_status === 'delivered' || delivery.delivery_status === 'completed'
    }
    return delivery.delivery_status === activeSubTab
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-xl text-gray-600">Loading deliveries...</div>
      </div>
    )
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
            ⏳ Pending ({deliveries.filter(d => d.delivery_status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveSubTab('completed')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSubTab === 'completed'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Completed ({deliveries.filter(d => d.delivery_status === 'delivered' || d.delivery_status === 'completed').length})
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
              <div key={delivery.delivery_id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                {/* Delivery Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{delivery.delivery_number}</h3>
                    <p className="text-sm text-gray-500">Order: {delivery.order_number} | Assigned: {new Date(delivery.assigned_date).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(delivery.delivery_status)}`}>
                    {delivery.delivery_status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Customer & Vehicle Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Customer:</p>
                    <p className="text-gray-800">{delivery.customer_name}</p>
                    <p className="text-sm text-gray-600">📞 {delivery.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Vehicle:</p>
                    <p className="text-gray-800">{delivery.vehicle_type}</p>
                    <p className="text-sm text-gray-600">{delivery.vehicle_number}</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-semibold mb-1">📍 Pickup:</p>
                    <p className="text-gray-800">{delivery.pickup_address}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-semibold mb-1">🏠 Delivery:</p>
                    <p className="text-gray-800">{delivery.delivery_address}</p>
                  </div>
                </div>

                {/* Products */}
                {delivery.items && delivery.items.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Products:</p>
                    <div className="space-y-1">
                      {delivery.items.map((item, index) => (
                        <p key={index} className="text-gray-700 text-sm">
                          • {item.product_name} ({item.weight_unit}) x {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Notes */}
                {delivery.special_notes && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-700 font-semibold mb-1">📝 Special Notes:</p>
                    <p className="text-gray-800">{delivery.special_notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleOpenUpdateModal(delivery)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    📝 Update Status
                  </button>
                  <button
                    onClick={() => window.open(`tel:${delivery.customer_phone}`)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    📞 Contact Customer
                  </button>
                </div>
              </div>
            ))
          )}
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Update Delivery Status</h2>
                  <p className="text-blue-100">{selectedDelivery?.delivery_number}</p>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Status Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="assigned">Assigned</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Special Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Notes (Optional)
                </label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Add any special notes about this delivery..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 p-6 rounded-b-2xl flex justify-between items-center">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDelivery}
                disabled={updating}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  !updating
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {updating ? 'Updating...' : 'Update Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

