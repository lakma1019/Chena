'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { tokenManager, productAPI } from '@/services/api'
import { showAlert } from '@/utils/notifications'

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [showFarmerModal, setShowFarmerModal] = useState(false)
  const [farmerDetails, setFarmerDetails] = useState(null)
  const [loadingFarmers, setLoadingFarmers] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const router = useRouter()

  const handleIncrement = () => {
    setQuantity(prev => prev + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleViewDetails = async () => {
    // Check if product is out of stock
    if (!product.inStock) {
      await showAlert(`${product.name} is currently out of stock. No farmers have this product available at the moment.`, 'warning')
      return
    }

    // Validate catalogId exists
    if (!product.catalogId) {
      console.error('Product missing catalogId:', product)
      await showAlert('Error: Product data is incomplete. Please refresh the page.', 'error')
      return
    }

    try {
      setLoadingFarmers(true)
      setShowFarmerModal(true)
      const response = await productAPI.getProductDetails(product.catalogId)

      if (response.success) {
        setFarmerDetails(response.data)
        // Auto-select the farmer with minimum price
        if (response.data.farmers && response.data.farmers.length > 0) {
          setSelectedFarmer(response.data.farmers[0])
        } else {
          await showAlert('No farmers are currently selling this product.', 'warning')
          setShowFarmerModal(false)
        }
      } else {
        await showAlert(response.message || 'Failed to load product details', 'error')
        setShowFarmerModal(false)
      }
    } catch (error) {
      console.error('Failed to load farmer details:', error)
      await showAlert(`Failed to load product details: ${error.message || 'Unknown error'}`, 'error')
      setShowFarmerModal(false)
    } finally {
      setLoadingFarmers(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      // Check if product is out of stock
      if (!product.inStock) {
        await showAlert(`${product.name} is currently out of stock!`, 'warning')
        return
      }

      // Check if customer is logged in using JWT token
      const accessToken = tokenManager.getAccessToken()
      const userType = localStorage.getItem('userType')

      if (!accessToken || userType !== 'customer') {
        // Redirect to customer login page if not logged in
        router.push('/login/customer-login')
        return
      }

      // If no farmer is selected, show the modal to select a farmer
      if (!selectedFarmer) {
        handleViewDetails()
        return
      }

      // Validate selectedFarmer has required fields
      if (!selectedFarmer.farmer_product_id || !selectedFarmer.farmer_id || !selectedFarmer.price) {
        console.error('Invalid farmer data:', selectedFarmer)
        await showAlert('Error: Invalid farmer data. Please try selecting a different farmer.', 'error')
        return
      }

      // Get existing cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')

      // Check if this specific farmer's product already exists in cart
      const existingItemIndex = cart.findIndex(item =>
        item.farmerProductId === selectedFarmer.farmer_product_id
      )

      if (existingItemIndex > -1) {
        // Update quantity if product exists
        cart[existingItemIndex].quantity += quantity
      } else {
        // Add new product to cart with farmer details
        cart.push({
          id: product.id,
          catalogId: product.catalogId,
          farmerProductId: selectedFarmer.farmer_product_id,
          farmerId: selectedFarmer.farmer_id,
          name: product.name,
          price: parseFloat(selectedFarmer.price),
          weight: selectedFarmer.weight_unit || product.weight,
          image: product.image,
          quantity: quantity,
          farmerName: selectedFarmer.farmer_name,
          farmName: selectedFarmer.farm_name
        })
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart))

      // Dispatch event to update cart count
      window.dispatchEvent(new Event('cartUpdated'))

      // Show success message
      await showAlert(`${product.name} from ${selectedFarmer.farm_name} added to cart!`, 'success')

      // Reset quantity and close modal
      setQuantity(1)
      setShowFarmerModal(false)
    } catch (error) {
      console.error('Error adding to cart:', error)
      await showAlert(`Error adding product to cart: ${error.message}`, 'error')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 relative group">
      {/* Product Image */}
      <div className="relative w-full h-36 mb-3 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-xs">{product.weight}</p>
        <p className="text-red-600 text-xl font-bold">
          Rs. {(product.price && !isNaN(product.price)) ? product.price.toFixed(2) : '0.00'}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-center gap-3 mt-3 mb-2">
        <button
          onClick={handleDecrement}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="text-lg font-semibold w-10 text-center">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* View Details Button */}
      <button
        onClick={handleViewDetails}
        className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
      >
        View Farmers
      </button>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="absolute top-3 right-3 w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
        aria-label="Add to cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </button>

      {/* Farmer Selection Modal */}
      {showFarmerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {product.name} - Select Farmer
                </h2>
                <button
                  onClick={() => setShowFarmerModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {loadingFarmers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : farmerDetails ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    {farmerDetails.farmers.length} farmer(s) selling this product
                  </p>

                  <div className="space-y-4">
                    {farmerDetails.farmers.map((farmer) => (
                      <div
                        key={farmer.farmer_product_id}
                        onClick={() => setSelectedFarmer(farmer)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedFarmer?.farmer_product_id === farmer.farmer_product_id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">
                              {farmer.farm_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Farmer: {farmer.farmer_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Location: {farmer.location}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              Available: {farmer.quantity_available} units
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              Rs. {parseFloat(farmer.price).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">per {farmer.weight_unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowFarmerModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedFarmer}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

