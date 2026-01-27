'use client'

import { useState, useEffect } from 'react'
import { orderAPI } from '@/services/api'
import { generateInvoice } from '@/utils/invoiceGenerator'
import { showAlert, showConfirm } from '@/utils/notifications'

export default function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [previewOrder, setPreviewOrder] = useState(null)

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

  /**
   * Get color classes for order status badges
   */
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

  /**
   * Get color classes for delivery status badges
   */
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'assigned':
        return 'bg-blue-100 text-blue-700'
      case 'picked_up':
        return 'bg-indigo-100 text-indigo-700'
      case 'in_progress':
        return 'bg-purple-100 text-purple-700'
      case 'in_transit':
        return 'bg-orange-100 text-orange-700'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
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

  const handlePreviewInvoice = (order) => {
    setPreviewOrder(order)
  }

  const handleDownloadInvoice = async (order) => {
    try {
      console.log('Downloading invoice for order:', order);
      generateInvoice(order)
      await showAlert('Invoice downloaded successfully!', 'success')
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      console.error('Error details:', error.message, error.stack);
      await showAlert(`Failed to generate invoice: ${error.message}`, 'error')
    }
  }

  const closePreview = () => {
    setPreviewOrder(null)
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

                {/* Price Breakdown */}
                <div className="mt-4 pt-4 border-t-2 border-gray-300 space-y-2">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">Rs. {parseFloat(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">Rs. {parseFloat(order.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span className="text-blue-600">Rs. {parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
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

              {/* Delivery Tracking */}
              {order.delivery_status && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">🚚</span>
                      Delivery Tracking
                    </h4>
                    <div className={`px-4 py-2 rounded-lg font-semibold ${getDeliveryStatusColor(order.delivery_status)}`}>
                      {order.delivery_status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  {/* Delivery Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Assigned</span>
                      <span>Picked Up</span>
                      <span>In Transit</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          order.delivery_status === 'assigned' ? 'bg-blue-500 w-1/4' :
                          order.delivery_status === 'picked_up' ? 'bg-blue-500 w-2/4' :
                          order.delivery_status === 'in_progress' || order.delivery_status === 'in_transit' ? 'bg-blue-500 w-3/4' :
                          order.delivery_status === 'delivered' || order.delivery_status === 'completed' ? 'bg-green-500 w-full' :
                          'bg-gray-300 w-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Transport Provider Info */}
                  {order.transport_provider && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600">Transport Provider:</p>
                        <p className="font-semibold text-gray-800">{order.transport_provider}</p>
                        {order.transport_phone && (
                          <p className="text-sm text-gray-600">📞 {order.transport_phone}</p>
                        )}
                      </div>
                      {order.vehicle_info && (
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Vehicle:</p>
                          <p className="font-semibold text-gray-800">{order.vehicle_info}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Special Notes from Transport Provider */}
                  {order.delivery_notes && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-3">
                      <p className="text-xs text-yellow-700 font-semibold mb-1">📝 Delivery Notes:</p>
                      <p className="text-sm text-gray-800">{order.delivery_notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Order Footer */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <div className="flex gap-3">
                  {/* Preview Invoice Button */}
                  <button
                    onClick={() => handlePreviewInvoice(order)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Preview Invoice
                  </button>

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

      {/* Invoice Preview Modal */}
      {previewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">🌾 CHENA</h2>
                  <p className="text-green-100">Agricultural Marketplace</p>
                </div>
                <button
                  onClick={closePreview}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-8">
              {/* Invoice Title */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h3>
                <div className="h-1 w-24 bg-green-600 mx-auto rounded"></div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Left Column */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Order Number</p>
                    <p className="text-lg font-bold text-gray-800">{previewOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Order Date</p>
                    <p className="text-gray-800">{new Date(previewOrder.order_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Payment Method</p>
                    <p className="text-gray-800">{previewOrder.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Payment Status</p>
                    <p className={`font-bold ${previewOrder.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                      {previewOrder.payment_status.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Delivery Address</p>
                    <p className="text-gray-800">{previewOrder.delivery_address}</p>
                    {previewOrder.delivery_city && (
                      <p className="text-gray-800">
                        {previewOrder.delivery_city}
                        {previewOrder.delivery_postal_code && `, ${previewOrder.delivery_postal_code}`}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Order Status</p>
                    <p className="text-gray-800 font-semibold capitalize">{previewOrder.order_status}</p>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Order Items</h4>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Product</th>
                        <th className="text-center py-3 px-4 font-semibold">Quantity</th>
                        <th className="text-right py-3 px-4 font-semibold">Unit Price</th>
                        <th className="text-right py-3 px-4 font-semibold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {previewOrder.items && previewOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-800">{item.product_name}</div>
                            <div className="text-sm text-gray-600">{item.weight_unit}</div>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-800">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-gray-800">
                            Rs. {parseFloat(item.unit_price).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">
                            Rs. {parseFloat(item.subtotal).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-semibold">Rs. {parseFloat(previewOrder.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Delivery Fee:</span>
                    <span className="font-semibold">Rs. {parseFloat(previewOrder.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">TOTAL:</span>
                      <span className="text-2xl font-bold text-green-600">
                        Rs. {parseFloat(previewOrder.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center text-gray-600 text-sm border-t-2 border-gray-200 pt-6">
                <p className="font-semibold mb-1">Thank you for your order! 🌾</p>
                <p>For any queries, contact us at support@chena.lk</p>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="bg-gray-100 p-6 rounded-b-2xl flex justify-between items-center">
              <button
                onClick={closePreview}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadInvoice(previewOrder)
                  closePreview()
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

