'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleIncrement = () => {
    setQuantity(prev => prev + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = () => {
    // Check if customer is logged in
    const isLoggedIn = localStorage.getItem('customerLoggedIn')

    if (!isLoggedIn) {
      // Redirect to customer login page if not logged in
      router.push('/login/customer-login')
      return
    }

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id)

    if (existingItemIndex > -1) {
      // Update quantity if product exists
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.image,
        quantity: quantity
      })
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))

    // Dispatch event to update cart count
    window.dispatchEvent(new Event('cartUpdated'))

    // Show success message
    alert(`${product.name} added to cart!`)

    // Reset quantity to 1
    setQuantity(1)
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
        <p className="text-red-600 text-xl font-bold">Rs. {product.price.toFixed(2)}</p>
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
    </div>
  )
}

