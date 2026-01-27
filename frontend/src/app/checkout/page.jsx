'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { tokenManager } from '@/services/api'
import { showAlert } from '@/utils/notifications'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

// Card Payment Form Component (Manual Entry with Test Cards)
function CardPaymentForm({ total, onPaymentSuccess, deliveryInfo }) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardDetails({ ...cardDetails, cardNumber: formatted })
    }
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.replace('/', '').length <= 4) {
      setCardDetails({ ...cardDetails, expiryDate: formatted })
    }
  }

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '')
    if (value.length <= 4) {
      setCardDetails({ ...cardDetails, cvv: value })
    }
  }

  const validateCard = () => {
    const cardNum = cardDetails.cardNumber.replace(/\s/g, '')
    if (cardNum.length < 13 || cardNum.length > 16) {
      return 'Invalid card number'
    }
    if (!cardDetails.cardName.trim()) {
      return 'Cardholder name is required'
    }
    if (cardDetails.expiryDate.length !== 5) {
      return 'Invalid expiry date'
    }
    if (cardDetails.cvv.length < 3) {
      return 'Invalid CVV'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode) {
      setError('Please fill in all delivery information')
      return
    }

    const validationError = validateCard()
    if (validationError) {
      setError(validationError)
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Simulate card processing (in real scenario, this would go through payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Call backend to create order with card payment
      await onPaymentSuccess('card_payment_' + Date.now())
    } catch (err) {
      setError(err.message)
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg tracking-wider"
              required
            />
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.cardName}
              onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() })}
              placeholder="JOHN DOE"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none uppercase"
              required
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="password"
                value={cardDetails.cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                maxLength="4"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test Card Info */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <p className="text-sm font-semibold text-yellow-800 mb-2">💳 Test Card Numbers:</p>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>• Visa: 4532 1488 0343 6467</p>
          <p>• Mastercard: 5425 2334 3010 9903</p>
          <p>• Amex: 3782 822463 10005</p>
          <p>• Any future expiry date (e.g., 12/25) | Any CVV (e.g., 123)</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-red-800 font-semibold">❌ {error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={processing}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Pay Rs. ${total.toFixed(2)}`
        )}
      </button>

      <div className="text-center text-sm text-gray-600">
        <p>🔒 Secure payment processing</p>
      </div>
    </form>
  )
}

// Stripe Payment Form Component
function StripePaymentForm({ total, onPaymentSuccess, deliveryInfo, cartItems }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode) {
      setError('Please fill in all delivery information')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          address: {
            line1: deliveryInfo.address,
            city: deliveryInfo.city,
            postal_code: deliveryInfo.postalCode,
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message)
        setProcessing(false)
        return
      }

      // Call backend to create order with Stripe payment
      await onPaymentSuccess(paymentMethod.id)
    } catch (err) {
      setError(err.message)
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Card Details
        </label>
        <div className="p-4 border-2 border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-red-800 font-semibold">❌ {error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay Rs. ${total.toFixed(2)}`}
      </button>

      <div className="text-center text-sm text-gray-600">
        <p>🔒 Secure payment powered by Stripe</p>
        <p className="mt-1">Test card: 4242 4242 4242 4242 | Any future date | Any CVV</p>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [deliveryPostalCode, setDeliveryPostalCode] = useState('')
  const [distanceFromColombo, setDistanceFromColombo] = useState('')
  const [transportProviders, setTransportProviders] = useState([])
  const [selectedTransport, setSelectedTransport] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('Card')
  const [processingOrder, setProcessingOrder] = useState(false)
  const [loadingTransport, setLoadingTransport] = useState(false)

  useEffect(() => {
    // Check authentication
    const accessToken = tokenManager.getAccessToken()
    const userType = localStorage.getItem('userType')

    if (!accessToken || userType !== 'customer') {
      router.push('/login/customer-login')
      return
    }

    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length === 0) {
      alert('Your cart is empty!')
      router.push('/customer-dashboard')
      return
    }

    setCartItems(cart)
    loadTransportProviders()
    setLoading(false)
  }, [router])

  /**
   * Load available transport providers with their vehicles and pricing
   */
  const loadTransportProviders = async () => {
    try {
      setLoadingTransport(true)
      const response = await fetch('http://localhost:5000/api/orders/transport-providers/available', {
        headers: {
          'Authorization': `Bearer ${tokenManager.getAccessToken()}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setTransportProviders(data.data)
      } else {
        console.error('Failed to load transport providers:', data.message)
      }
    } catch (error) {
      console.error('Failed to load transport providers:', error)
    } finally {
      setLoadingTransport(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
      return sum + (price * item.quantity)
    }, 0)
  }

  /**
   * Calculate delivery fee based on selected vehicle's price per km and distance
   */
  const calculateDeliveryFee = () => {
    if (!selectedVehicle || !distanceFromColombo) {
      return 0
    }
    const distance = parseFloat(distanceFromColombo) || 0
    const pricePerKm = parseFloat(selectedVehicle.price_per_km) || 0
    return distance * pricePerKm
  }

  const subtotal = calculateSubtotal()
  const deliveryFee = calculateDeliveryFee()
  const total = subtotal + deliveryFee

  const handleCreateOrder = async (stripePaymentMethodId = null) => {
    try {
      setProcessingOrder(true)

      // Validate transport selection
      if (!selectedTransport || !selectedVehicle) {
        await showAlert('Please select a transport provider and vehicle', 'warning')
        setProcessingOrder(false)
        return
      }

      // Validate distance
      if (!distanceFromColombo || parseFloat(distanceFromColombo) <= 0) {
        await showAlert('Please enter a valid distance from Colombo', 'warning')
        setProcessingOrder(false)
        return
      }

      // Map frontend payment method to database-accepted values
      const dbPaymentMethod = (paymentMethod === 'Card' || paymentMethod === 'Stripe')
        ? 'Online Payment'
        : paymentMethod;

      const orderData = {
        cartItems,
        deliveryAddress,
        deliveryCity,
        deliveryPostalCode,
        distanceFromColombo: parseFloat(distanceFromColombo),
        transportId: selectedTransport.transport_id,
        vehicleId: selectedVehicle.vehicle_id,
        deliveryFee: calculateDeliveryFee(),
        paymentMethod: dbPaymentMethod,
        paymentType: paymentMethod, // Keep original for backend processing logic
        stripePaymentMethodId,
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenManager.getAccessToken()}`,
        },
        body: JSON.stringify(orderData),
      })

      // Check if response is ok
      if (!response.ok) {
        const text = await response.text()
        console.error('Server response:', text)
        throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`)
      }

      const data = await response.json()

      if (data.success) {
        // Clear cart
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('cartUpdated'))

        // Show success message
        await showAlert(`Order placed successfully! Order Number: ${data.data.orderNumber}`, 'success')

        // Redirect to orders page
        router.push('/customer-dashboard?tab=orders')
      } else {
        throw new Error(data.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      await showAlert(`Error creating order: ${error.message}`, 'error')
      throw error
    } finally {
      setProcessingOrder(false)
    }
  }

  const handleCashOnDelivery = async () => {
    if (!deliveryAddress || !deliveryCity || !deliveryPostalCode) {
      await showAlert('Please fill in all delivery information', 'warning')
      return
    }

    await handleCreateOrder(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Delivery & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    rows="3"
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={deliveryPostalCode}
                      onChange={(e) => setDeliveryPostalCode(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Postal Code"
                    />
                  </div>
                </div>

                {/* Distance from Colombo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Distance from Colombo (KM) *
                  </label>
                  <input
                    type="number"
                    value={distanceFromColombo}
                    onChange={(e) => setDistanceFromColombo(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter distance in kilometers"
                    min="0"
                    step="0.1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    💡 This will be used to calculate your delivery fee
                  </p>
                </div>
              </div>
            </div>

            {/* Transport Provider Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Transport Provider</h2>

              {loadingTransport ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading transport providers...</p>
                </div>
              ) : transportProviders.length === 0 ? (
                <div className="text-center py-8 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-700">No transport providers available at the moment</p>
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
                                  setSelectedTransport(provider)
                                  setSelectedVehicle(vehicle)
                                }}
                                className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                  selectedVehicle?.vehicle_id === vehicle.vehicle_id
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
                                    {distanceFromColombo && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        Total: Rs. {(parseFloat(vehicle.price_per_km) * parseFloat(distanceFromColombo)).toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {selectedVehicle?.vehicle_id === vehicle.vehicle_id && (
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

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>

              <div className="space-y-3">
                {/* Card Payment Option */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'Card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-800">💳 Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Pay with Visa, Mastercard, or Amex</div>
                  </label>
                </div>

                {/* Stripe Payment Option */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'Stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    id="stripe"
                    name="payment"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <label htmlFor="stripe" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-800">🔷 Stripe Payment</div>
                    <div className="text-sm text-gray-600">Secure payment powered by Stripe</div>
                  </label>
                </div>

                {/* Cash on Delivery Option */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-800">💵 Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </label>
                </div>
              </div>

              {/* Payment Forms */}
              <div className="mt-6">
                {!deliveryAddress || !deliveryCity || !deliveryPostalCode ? (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <p className="text-yellow-800 font-semibold">
                      ⚠️ Please fill in all delivery information before proceeding with payment
                    </p>
                  </div>
                ) : (
                  <>
                    {paymentMethod === 'Card' && (
                      <CardPaymentForm
                        total={total}
                        onPaymentSuccess={handleCreateOrder}
                        deliveryInfo={{
                          address: deliveryAddress,
                          city: deliveryCity,
                          postalCode: deliveryPostalCode,
                        }}
                      />
                    )}

                    {paymentMethod === 'Stripe' && (
                      <Elements stripe={stripePromise}>
                        <StripePaymentForm
                          total={total}
                          onPaymentSuccess={handleCreateOrder}
                          deliveryInfo={{
                            address: deliveryAddress,
                            city: deliveryCity,
                            postalCode: deliveryPostalCode,
                          }}
                          cartItems={cartItems}
                        />
                      </Elements>
                    )}

                    {paymentMethod === 'Cash on Delivery' && (
                      <button
                        onClick={handleCashOnDelivery}
                        disabled={processingOrder}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {processingOrder ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Order...
                          </span>
                        ) : (
                          'Place Order (Cash on Delivery)'
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.farmerName}</div>
                      <div className="text-sm text-gray-600">
                        Rs. {item.price} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold text-gray-800">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t-2 border-gray-300">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Back to Cart */}
              <button
                onClick={() => router.push('/customer-dashboard?tab=cart')}
                className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

