'use client'

import { useState } from 'react'
import { products as productData } from '@/data/products'

export default function ProductsTab() {
  const [activeSubTab, setActiveSubTab] = useState('add')

  // Farmer's inventory - products they are selling
  const [myProducts, setMyProducts] = useState([
    {
      id: 'P001',
      name: 'Tomato',
      category: 'Vegetables',
      subCategory: 'Low Country',
      weight: '500g',
      price: 180.00,
      quantity: 50,
      image: '/images/list/low country vegetable/tomato.png',
      status: 'active'
    },
    {
      id: 'P002',
      name: 'Papaya',
      category: 'Fruits',
      subCategory: '',
      weight: '1kg',
      price: 180.00,
      quantity: 30,
      image: '/images/list/fruits/papaya.png',
      status: 'active'
    },
    {
      id: 'P003',
      name: 'Carrot',
      category: 'Vegetables',
      subCategory: 'Up Country',
      weight: '500g',
      price: 200.00,
      quantity: 40,
      image: '/images/list/up country vegetable/carrot.png',
      status: 'inactive'
    }
  ])

  const [newProduct, setNewProduct] = useState({
    selectedProduct: '',
    quantity: '',
    customPrice: ''
  })

  const [selectedProductDetails, setSelectedProductDetails] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Get all available products from the system
  const allSystemProducts = [
    ...productData.fruits.map(p => ({ ...p, category: 'Fruits', subCategory: '' })),
    ...productData.lowCountryVegetables.map(p => ({ ...p, category: 'Vegetables', subCategory: 'Low Country' })),
    ...productData.upCountryVegetables.map(p => ({ ...p, category: 'Vegetables', subCategory: 'Up Country' }))
  ]

  const handleProductSelect = (e) => {
    const productId = e.target.value
    if (productId) {
      const product = allSystemProducts.find(p => p.id === productId)
      setSelectedProductDetails(product)
      setNewProduct({
        selectedProduct: productId,
        quantity: '',
        customPrice: product.price.toString()
      })
    } else {
      setSelectedProductDetails(null)
      setNewProduct({
        selectedProduct: '',
        quantity: '',
        customPrice: ''
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct({
      ...newProduct,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedProductDetails) {
      alert('Please select a product')
      return
    }

    const productId = 'P' + String(myProducts.length + 1).padStart(3, '0')
    const product = {
      id: productId,
      name: selectedProductDetails.name,
      category: selectedProductDetails.category,
      subCategory: selectedProductDetails.subCategory,
      weight: selectedProductDetails.weight,
      price: parseFloat(newProduct.customPrice),
      quantity: parseInt(newProduct.quantity),
      image: selectedProductDetails.image,
      status: 'active'
    }

    setMyProducts([...myProducts, product])

    // Reset form
    setNewProduct({
      selectedProduct: '',
      quantity: '',
      customPrice: ''
    })
    setSelectedProductDetails(null)
    alert('Product added to your inventory successfully!')
    setActiveSubTab('view')
  }

  const handleClearForm = () => {
    setNewProduct({
      selectedProduct: '',
      quantity: '',
      customPrice: ''
    })
    setSelectedProductDetails(null)
  }

  const toggleProductStatus = (productId) => {
    setMyProducts(myProducts.map(product =>
      product.id === productId
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ))
  }

  const deleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product from your inventory?')) {
      setMyProducts(myProducts.filter(product => product.id !== productId))
      alert('Product removed from inventory successfully!')
    }
  }

  const filteredProducts = myProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category.toLowerCase() === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2 border-2 border-gray-200 flex space-x-2">
        <button
          onClick={() => setActiveSubTab('add')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeSubTab === 'add'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ➕ Add Product
        </button>
        <button
          onClick={() => setActiveSubTab('view')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeSubTab === 'view'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📋 View Products
        </button>
      </div>

      {/* Add Product Form */}
      {activeSubTab === 'add' && (
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-green-600 pb-3">
            Add Product to Your Inventory
          </h3>
          <p className="text-gray-600 mb-6">
            Select a product from our catalog and set your price and available quantity.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Product *</label>
              <select
                name="selectedProduct"
                value={newProduct.selectedProduct}
                onChange={handleProductSelect}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >
                <option value="">-- Choose a product --</option>
                <optgroup label="🍎 Fruits">
                  {productData.fruits.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🌿 Low Country Vegetables">
                  {productData.lowCountryVegetables.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🥕 Up Country Vegetables">
                  {productData.upCountryVegetables.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Product Preview */}
            {selectedProductDetails && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Product Details</h4>
                <div className="flex items-start space-x-6">
                  <div className="w-32 h-32 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      src={selectedProductDetails.image}
                      alt={selectedProductDetails.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xl font-bold text-gray-800">{selectedProductDetails.name}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Category:</span> {selectedProductDetails.category}
                      {selectedProductDetails.subCategory && ` - ${selectedProductDetails.subCategory}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Standard Weight:</span> {selectedProductDetails.weight}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Suggested Price:</span> Rs. {selectedProductDetails.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Price */}
            {selectedProductDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Quantity (units) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="e.g., 50"
                  />
                  <p className="text-xs text-gray-500 mt-1">How many units do you have available?</p>
                </div>

                {/* Custom Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Price (Rs. per {selectedProductDetails.weight}) *
                  </label>
                  <input
                    type="number"
                    name="customPrice"
                    value={newProduct.customPrice}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="e.g., 150.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can adjust the price based on quality</p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClearForm}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all shadow-md"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={!selectedProductDetails}
                className={`px-8 py-3 font-semibold rounded-lg transition-all shadow-md ${
                  selectedProductDetails
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add to Inventory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Products */}
      {activeSubTab === 'view' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    filterCategory === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCategory('fruits')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    filterCategory === 'fruits'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Fruits
                </button>
                <button
                  onClick={() => setFilterCategory('vegetables')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    filterCategory === 'vegetables'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Vegetables
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-48 bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${
                    product.status === 'active'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.status === 'active' ? '✓ Active' : '✕ Inactive'}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h4>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">ID:</span> {product.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Category:</span> {product.category}
                      {product.subCategory && ` - ${product.subCategory}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Weight:</span> {product.weight}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      Rs. {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Available:</span> {product.quantity} units
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                        product.status === 'active'
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => alert('Edit functionality coming soon!')}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 border-2 border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

