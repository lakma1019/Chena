'use client'

import { useState, useEffect } from 'react'
import { farmerOrderAPI } from '@/services/api'

export default function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showTransportModal, setShowTransportModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [transportProviders, setTransportProviders] = useState([])
  const [selectedTransport, setSelectedTransport] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [assigningTransport, setAssigningTransport] = useState(false)

  // Load orders on component mount
  useEffect(() => {
    loadOrders()
  }, [])

  /**
   * Fetch all orders containing farmer's products from the backend
   */
  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await farmerOrderAPI.getFarmerOrders()
      if (response.success) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
      alert('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load available transport providers when modal opens
   */
  const loadTransportProviders = async () => {
    try {
      const response = await farmerOrderAPI.getTransportProviders()
      if (response.success) {
        setTransportProviders(response.data)
      }
    } catch (error) {
      console.error('Failed to load transport providers:', error)
      alert('Failed to load transport providers. Please try again.')
    }
  }

  /**
   * Open transport assignment modal for an order
   */
  const handleAssignTransport = (order) => {
    setSelectedOrder(order)
    setShowTransportModal(true)
    setSelectedTransport(null)
    setSelectedVehicle(null)
    loadTransportProviders()
  }

  /**
   * Assign selected transport provider and vehicle to the order
   */
  const handleConfirmAssignment = async () => {
    if (!selectedTransport || !selectedVehicle) {
      alert('Please select both a transport provider and a vehicle')
      return
    }

    try {
      setAssigningTransport(true)
      const response = await farmerOrderAPI.assignTransport(selectedOrder.order_id, {
        transportId: selectedTransport,
        vehicleId: selectedVehicle,
      })

      if (response.success) {
        alert('Transport provider assigned successfully!')
        setShowTransportModal(false)
        loadOrders() // Reload orders to show updated status
      }
    } catch (error) {
      console.error('Failed to assign transport:', error)
      alert('Failed to assign transport provider. Please try again.')
    } finally {
      setAssigningTransport(false)
    }
  }

  /**
   * Filter orders based on selected status
   */
  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.order_status === filterStatus
  )

  /**
   * Get color classes for order status badges
   */

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'ready': return 'bg-green-100 text-green-700 border-green-300'
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'delivered': return 'bg-green-100 text-green-700 border-green-300'
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  /**
   * Get color classes for delivery status badges
   */
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'assigned': return 'bg-blue-100 text-blue-700'
      case 'in_progress': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
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

              {/* Customer Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Customer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-600">Name:</span> <span className="font-semibold">{order.customer_name}</span></p>
                  <p><span className="text-gray-600">Phone:</span> <span className="font-semibold">{order.customer_phone}</span></p>
                  <p className="md:col-span-2"><span className="text-gray-600">Delivery Address:</span> <span className="font-semibold">{order.delivery_address}</span></p>
                </div>
              </div>

              {/* Your Products in this Order */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Your Products in this Order</h4>
                <div className="space-y-2">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-3">
                      <div>
                        <p className="font-semibold text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-600">{item.weight_unit} × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-green-600">Rs. {parseFloat(item.subtotal).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Status */}
              {order.delivery_status && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Delivery Status</h4>
                      <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDeliveryStatusColor(order.delivery_status)}`}>
                        {order.delivery_status.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    {order.delivery_notes && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Transport Notes:</p>
                        <p className="text-sm font-semibold text-gray-800">{order.delivery_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="flex justify-between items-center border-t-2 pt-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-800">{order.payment_method}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Your Portion</p>
                  <p className="text-2xl font-bold text-green-600">Rs. {parseFloat(order.farmer_subtotal || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Show Assign Transport button if delivery not assigned yet */}
                {(!order.delivery_status || order.delivery_status === 'pending') && (
                  <button
                    onClick={() => handleAssignTransport(order)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                  >
                    🚚 Assign Transport Provider
                  </button>
                )}
                {order.delivery_status === 'assigned' && (
                  <div className="flex-1 px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg text-center">
                    ✓ Transport Assigned
                  </div>
                )}
                <button
                  onClick={() => window.open(`tel:${order.customer_phone}`)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  📞 Contact Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transport Provider Selection Modal */}
      {showTransportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Assign Transport Provider</h2>
                  <p className="text-green-100">Order: {selectedOrder?.order_number}</p>
                </div>
                <button
                  onClick={() => setShowTransportModal(false)}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">Available Transport Providers</h3>

              {transportProviders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No transport providers available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transportProviders.map((provider) => (
                    <div key={provider.transport_id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 transition-all">
                      {/* Provider Info */}
                      <div className="mb-3">
                        <h4 className="text-lg font-bold text-gray-800">{provider.provider_name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                          <p>📞 {provider.provider_phone}</p>
                          <p>📍 {provider.city || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Vehicles */}
                      {provider.vehicles && provider.vehicles.length > 0 ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Available Vehicles:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {provider.vehicles.map((vehicle) => (
                              <div
                                key={vehicle.vehicle_id}
                                onClick={() => {
                                  setSelectedTransport(provider.transport_id)
                                  setSelectedVehicle(vehicle.vehicle_id)
                                }}
                                className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                  selectedVehicle === vehicle.vehicle_id
                                    ? 'border-green-600 bg-green-50'
                                    : 'border-gray-300 hover:border-green-400'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-semibold text-gray-800">{vehicle.vehicle_type}</p>
                                    <p className="text-xs text-gray-600">{vehicle.vehicle_number}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-green-600">
                                      Rs. {parseFloat(vehicle.price_per_km).toFixed(2)}/km
                                    </p>
                                  </div>
                                </div>
                                {selectedVehicle === vehicle.vehicle_id && (
                                  <div className="mt-2 text-green-600 text-sm font-semibold">
                                    ✓ Selected
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No vehicles available</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 p-6 rounded-b-2xl flex justify-between items-center">
              <button
                onClick={() => setShowTransportModal(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                disabled={!selectedTransport || !selectedVehicle || assigningTransport}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedTransport && selectedVehicle && !assigningTransport
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {assigningTransport ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
