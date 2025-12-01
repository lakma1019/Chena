'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import { getAllProducts } from '@/data/products'

export default function ViewProductsTab() {
  const allProducts = getAllProducts()
  const [displayCount, setDisplayCount] = useState(12)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [applyFilter, setApplyFilter] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'fruits') {
        filtered = filtered.filter(product => product.category === 'fruits')
      } else if (selectedCategory === 'vegetables') {
        if (selectedSubCategory === 'low-country') {
          filtered = filtered.filter(product => product.category === 'low-country-vegetable')
        } else if (selectedSubCategory === 'up-country') {
          filtered = filtered.filter(product => product.category === 'up-country-vegetable')
        } else {
          filtered = filtered.filter(product => 
            product.category === 'low-country-vegetable' || 
            product.category === 'up-country-vegetable'
          )
        }
      }
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    return filtered
  }, [allProducts, selectedCategory, selectedSubCategory, priceRange, applyFilter])

  const handleFilter = () => {
    setApplyFilter(!applyFilter)
    setDisplayCount(12)
  }

  const productsToDisplay = filteredProducts.slice(0, displayCount)

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Browse Fresh Products</h2>
        <p className="text-blue-100">Discover fresh fruits and vegetables from local farmers</p>
      </div>

      {/* Two Column Layout: Filter Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar - Left Side */}
        <div className="lg:col-span-1">
          <ProductFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onFilter={handleFilter}
          />
        </div>

        {/* Products Grid - Right Side */}
        <div className="lg:col-span-3">
          {/* Product Count */}
          <div className="mb-6 text-gray-600 font-semibold">
            Showing {productsToDisplay.length} of {filteredProducts.length} Products
          </div>

          {/* Products Grid */}
          {productsToDisplay.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {productsToDisplay.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {displayCount < filteredProducts.length && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

