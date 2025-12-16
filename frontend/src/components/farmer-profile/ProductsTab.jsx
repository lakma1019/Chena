'use client'

import { useState, useEffect } from 'react'
import { productAPI } from '@/services/api'
import { showAlert, showConfirm } from '@/utils/notifications'

export default function ProductsTab() {
  const [activeSubTab, setActiveSubTab] = useState('add')
  const [loading, setLoading] = useState(true)
  const [myProducts, setMyProducts] = useState([])
  const [productCatalog, setProductCatalog] = useState([])

  const [newProduct, setNewProduct] = useState({
    selectedProduct: '',
    quantity: '',
    customPrice: ''
  })

  const [selectedProductDetails, setSelectedProductDetails] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Load farmer's products and product catalog on mount
  useEffect(() => {
    loadFarmerProducts()
    loadProductCatalog()
  }, [])

  const loadFarmerProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getFarmerProducts()
      if (response.success) {
        setMyProducts(response.data)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      alert('Failed to load your products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadProductCatalog = async () => {
    try {
      const response = await productAPI.getProductCatalog()
      if (response.success) {
        setProductCatalog(response.data)
      }
    } catch (error) {
      console.error('Failed to load product catalog:', error)
    }
  }

  const handleProductSelect = (e) => {
    const catalogId = e.target.value
    if (catalogId) {
      const product = productCatalog.find(p => p.catalog_id === parseInt(catalogId))
      setSelectedProductDetails(product)
      setNewProduct({
        selectedProduct: catalogId,
        quantity: '',
        customPrice: product.suggested_price.toString()
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedProductDetails) {
      alert('Please select a product')
      return
    }

    try {
      const productData = {
        catalogId: parseInt(newProduct.selectedProduct),
        quantityAvailable: parseInt(newProduct.quantity),
        price: parseFloat(newProduct.customPrice),
        weightUnit: selectedProductDetails.standard_weight
      }

      console.log('=== ADDING PRODUCT ===');
      console.log('Product Data:', productData);

      const response = await productAPI.addFarmerProduct(productData)

      console.log('Add Product Response:', response);

      if (response.success) {
        alert('Product added to your inventory successfully!')
        // Reset form
        setNewProduct({
          selectedProduct: '',
          quantity: '',
          customPrice: ''
        })
        setSelectedProductDetails(null)
        // Reload products
        await loadFarmerProducts()
        setActiveSubTab('view')
      } else {
        alert(response.message || 'Failed to add product. Please try again.')
      }
    } catch (error) {
      console.error('=== ADD PRODUCT ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      alert(error.message || 'Failed to add product. Please try again.')
    }
  }

  const handleClearForm = () => {
    setNewProduct({
      selectedProduct: '',
      quantity: '',
      customPrice: ''
    })
    setSelectedProductDetails(null)
  }

  const toggleProductStatus = async (farmerProductId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await productAPI.updateFarmerProduct(farmerProductId, { status: newStatus })

      if (response.success) {
        await loadFarmerProducts()
      }
    } catch (error) {
      console.error('Failed to update product status:', error)
      alert('Failed to update product status. Please try again.')
    }
  }

  const deleteProduct = async (farmerProductId) => {
    const confirmed = await showConfirm('Are you sure you want to delete this product from your inventory?')
    if (confirmed) {
      try {
        const response = await productAPI.deleteFarmerProduct(farmerProductId)

        if (response.success) {
          await showAlert('Product removed from inventory successfully!', 'success')
          await loadFarmerProducts()
        }
      } catch (error) {
        console.error('Failed to delete product:', error)
        await showAlert('Failed to delete product. Please try again.', 'error')
      }
    }
  }

  const handleEditPrice = async (farmerProductId, currentPrice) => {
    const newPrice = prompt('Enter new price:', currentPrice)

    if (newPrice && !isNaN(newPrice) && parseFloat(newPrice) > 0) {
      try {
        const response = await productAPI.updateFarmerProduct(farmerProductId, {
          price: parseFloat(newPrice)
        })

        if (response.success) {
          await showAlert('Price updated successfully!', 'success')
          await loadFarmerProducts()
        }
      } catch (error) {
        console.error('Failed to update price:', error)
        await showAlert('Failed to update price. Please try again.', 'error')
      }
    }
  }

  const handleEditQuantity = async (farmerProductId, currentQuantity) => {
    const newQuantity = prompt('Enter new quantity:', currentQuantity)

    if (newQuantity && !isNaN(newQuantity) && parseInt(newQuantity) >= 0) {
      try {
        const response = await productAPI.updateFarmerProduct(farmerProductId, {
          quantityAvailable: parseInt(newQuantity)
        })

        if (response.success) {
          await showAlert('Quantity updated successfully!', 'success')
          await loadFarmerProducts()
        }
      } catch (error) {
        console.error('Failed to update quantity:', error)
        await showAlert('Failed to update quantity. Please try again.', 'error')
      }
    }
  }

  const filteredProducts = myProducts.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' ||
      (filterCategory === 'fruits' && product.category === 'fruits') ||
      (filterCategory === 'vegetables' && (product.category === 'low-country-vegetable' || product.category === 'up-country-vegetable'))
    return matchesSearch && matchesCategory
  })

  // Helper function to get category display name
  const getCategoryDisplay = (category) => {
    if (category === 'fruits') return 'Fruits'
    if (category === 'low-country-vegetable') return 'Vegetables - Low Country'
    if (category === 'up-country-vegetable') return 'Vegetables - Up Country'
    return category
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

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
                  {productCatalog.filter(p => p.category === 'fruits').map(product => (
                    <option key={product.catalog_id} value={product.catalog_id}>
                      {product.product_name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🌿 Low Country Vegetables">
                  {productCatalog.filter(p => p.category === 'low-country-vegetable').map(product => (
                    <option key={product.catalog_id} value={product.catalog_id}>
                      {product.product_name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🥕 Up Country Vegetables">
                  {productCatalog.filter(p => p.category === 'up-country-vegetable').map(product => (
                    <option key={product.catalog_id} value={product.catalog_id}>
                      {product.product_name}
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
                    <p className="text-xl font-bold text-gray-800">{selectedProductDetails.product_name}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Category:</span> {getCategoryDisplay(selectedProductDetails.category)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Standard Weight:</span> {selectedProductDetails.standard_weight}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Suggested Price:</span> Rs. {selectedProductDetails.suggested_price ? Number(selectedProductDetails.suggested_price).toFixed(2) : '0.00'}
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
                    Your Price (Rs. per {selectedProductDetails.standard_weight}) *
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
              <div key={product.farmer_product_id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-48 bg-gray-100">
                  <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${
                    product.status === 'active'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.status === 'active' ? '✓ Active' : '✕ Inactive'}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{product.product_name}</h4>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">ID:</span> #{product.farmer_product_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Category:</span> {getCategoryDisplay(product.category)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Weight:</span> {product.weight_unit}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      Rs. {product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Available:</span> {product.quantity_available} units
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => handleEditPrice(product.farmer_product_id, product.price)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all text-sm"
                    >
                      💰 Edit Price
                    </button>
                    <button
                      onClick={() => handleEditQuantity(product.farmer_product_id, product.quantity_available)}
                      className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all text-sm"
                    >
                      📦 Edit Qty
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleProductStatus(product.farmer_product_id, product.status)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                        product.status === 'active'
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteProduct(product.farmer_product_id)}
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

