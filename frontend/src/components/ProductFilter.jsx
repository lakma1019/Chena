'use client'

import { useState } from 'react'

export default function ProductFilter({
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  priceRange,
  setPriceRange,
  onFilter
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showVegetableSubMenu, setShowVegetableSubMenu] = useState(false)

  const handleCategorySelect = (category, subCategory = null) => {
    setSelectedCategory(category)
    if (subCategory) {
      setSelectedSubCategory(subCategory)
    } else if (category === 'fruits') {
      setSelectedSubCategory(null)
    }
    setShowDropdown(false)
    setShowVegetableSubMenu(false)
  }

  const handleCategoryRadioChange = (category) => {
    setSelectedCategory(category)
    if (category === 'fruits') {
      setSelectedSubCategory(null)
    }
  }

  const handleSubCategoryRadioChange = (subCategory) => {
    setSelectedSubCategory(subCategory)
    setSelectedCategory('vegetables')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
      {/* Categories Dropdown Header */}
      <div className="mb-6 relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center justify-between hover:bg-green-700 transition-all"
        >
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Categories
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden">
            <div className="py-2">
              {/* Vegetables with submenu */}
              <div>
                <div
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all"
                  onClick={() => setShowVegetableSubMenu(!showVegetableSubMenu)}
                >
                  <span className="text-green-600 font-semibold">Vegetables</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${showVegetableSubMenu ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Vegetable Submenu */}
                {showVegetableSubMenu && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => handleCategorySelect('vegetables', 'up-country-vegetable')}
                      className="w-full text-left px-8 py-2 text-gray-700 hover:bg-gray-100 transition-all"
                    >
                      Upcountry Vegetables
                    </button>
                    <button
                      onClick={() => handleCategorySelect('vegetables', 'low-country-vegetable')}
                      className="w-full text-left px-8 py-2 text-gray-700 hover:bg-gray-100 transition-all"
                    >
                      Low Country Vegetables
                    </button>
                  </div>
                )}
              </div>

              {/* Fruits */}
              <button
                onClick={() => handleCategorySelect('fruits')}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-all"
              >
                <span className="text-green-600 font-semibold">Fruits</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-6 border-b pb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2 inline-block">
          Categories
        </h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'vegetables'}
              onChange={() => handleCategoryRadioChange('vegetables')}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span className="ml-3 text-gray-700 group-hover:text-green-600 transition-colors">Vegetables</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'fruits'}
              onChange={() => handleCategoryRadioChange('fruits')}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span className="ml-3 text-gray-700 group-hover:text-green-600 transition-colors">Fruits</span>
          </label>
        </div>
      </div>

      {/* Sub Categories Section */}
      <div className="mb-6 border-b pb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2 inline-block">
          Sub Categories
        </h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="subcategory"
              checked={selectedSubCategory === 'up-country-vegetable'}
              onChange={() => handleSubCategoryRadioChange('up-country-vegetable')}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span className="ml-3 text-gray-700 group-hover:text-green-600 transition-colors">Up Country Vegetables</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="subcategory"
              checked={selectedSubCategory === 'low-country-vegetable'}
              onChange={() => handleSubCategoryRadioChange('low-country-vegetable')}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span className="ml-3 text-gray-700 group-hover:text-green-600 transition-colors">Low Country Vegetables</span>
          </label>
        </div>
      </div>

      {/* Filter By Price Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2 inline-block">
          Filter By Price
        </h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Price:</span>
            <span className="font-semibold">Rs. {priceRange[0]} — Rs. {priceRange[1]}</span>
          </div>
          <button
            onClick={onFilter}
            className="w-full bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  )
}

