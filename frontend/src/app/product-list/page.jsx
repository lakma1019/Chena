'use client'

import { useState } from 'react'

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample products data
  const products = [
    { id: 1, name: 'Fresh Tomatoes', category: 'vegetables', price: 150, unit: 'kg', farmer: 'John Farm', image: '🍅' },
    { id: 2, name: 'Organic Carrots', category: 'vegetables', price: 120, unit: 'kg', farmer: 'Green Valley', image: '🥕' },
    { id: 3, name: 'Rice', category: 'grains', price: 200, unit: 'kg', farmer: 'Rice Fields', image: '🌾' },
    { id: 4, name: 'Fresh Apples', category: 'fruits', price: 300, unit: 'kg', farmer: 'Apple Orchard', image: '🍎' },
    { id: 5, name: 'Bananas', category: 'fruits', price: 100, unit: 'dozen', farmer: 'Tropical Farm', image: '🍌' },
    { id: 6, name: 'Potatoes', category: 'vegetables', price: 80, unit: 'kg', farmer: 'Valley Farm', image: '🥔' },
  ]

  const categories = ['all', 'vegetables', 'fruits', 'grains']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product List</h1>
          <p className="text-xl text-gray-600">Browse fresh products from local farmers</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="text-6xl text-center py-8 bg-gray-50">{product.image}</div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">By: {product.farmer}</p>
                <p className="text-sm text-gray-500 mb-4 capitalize">Category: {product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    Rs. {product.price}
                    <span className="text-sm text-gray-600">/{product.unit}</span>
                  </span>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

