'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { tokenManager } from '@/services/api'
import { showAlert } from '@/utils/notifications'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

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
  const [paymentMethod, setPaymentMethod] = useState('Stripe')
  const [processingOrder, setProcessingOrder] = useState(false)

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
    setLoading(false)
  }, [router])

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
      return sum + (price * item.quantity)
    }, 0)
  }

  const deliveryFee = 200
  const subtotal = calculateSubtotal()
  const total = subtotal + deliveryFee

  const handleCreateOrder = async (stripePaymentMethodId = null) => {
    try {
      setProcessingOrder(true)

      const orderData = {
        cartItems,
        deliveryAddress,
        deliveryCity,
        deliveryPostalCode,
        paymentMethod,
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
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
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
                    <div className="font-semibold text-gray-800">💳 Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Pay securely with Stripe</div>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg">
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
                {paymentMethod === 'Stripe' ? (
                  !deliveryAddress || !deliveryCity || !deliveryPostalCode ? (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                      <p className="text-yellow-800 font-semibold">
                        ⚠️ Please fill in all delivery information before proceeding with payment
                      </p>
                    </div>
                  ) : (
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
                  )
                ) : (
                  <button
                    onClick={handleCashOnDelivery}
                    disabled={processingOrder || !deliveryAddress}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {processingOrder ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                  </button>
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

