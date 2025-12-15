'use client'

import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import { productAPI } from '@/services/api'
import { useState, useMemo, useEffect } from 'react'

export default function Home() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(8)

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carouselImages = [
    '/images/background/home.jpg',
    '/images/background/home1.png',
    '/images/background/home2.png',
    '/images/background/home3.png',
    '/images/background/home4.png',
    '/images/background/home5.png',
  ]

  // Load products from database
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAllProducts()
      if (response.success) {
        // Transform database products to match frontend format
        const transformedProducts = response.data.map(product => ({
          id: `cat-${product.catalog_id}`,
          catalogId: product.catalog_id,
          name: product.product_name,
          weight: product.standard_weight,
          price: parseFloat(product.price), // This is min_price or suggested_price
          image: product.image_url,
          category: product.category,
          farmerCount: product.farmer_count,
          totalQuantity: product.total_quantity,
          inStock: product.in_stock, // Track stock status
          hasMinPrice: product.min_price !== null // Track if any farmer is selling
        }))
        setAllProducts(transformedProducts)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-switch images every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 7000) // 7 seconds

    return () => clearInterval(interval)
  }, [carouselImages.length])

  // Filter states - using single values instead of arrays
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [applyFilter, setApplyFilter] = useState(false)

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Filter by subcategory first (more specific)
    if (selectedSubCategory) {
      filtered = filtered.filter(product => product.category === selectedSubCategory)
    }
    // Then filter by main category if no subcategory is selected
    else if (selectedCategory) {
      if (selectedCategory === 'vegetables') {
        filtered = filtered.filter(product =>
          product.category === 'low-country-vegetable' || product.category === 'up-country-vegetable'
        )
      } else if (selectedCategory === 'fruits') {
        filtered = filtered.filter(product => product.category === 'fruits')
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
    setDisplayCount(8) // Reset display count when filtering
  }

  const productsToDisplay = filteredProducts.slice(0, displayCount)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Automatic Image Carousel */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        {/* Background Images with Fade Transition */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* Minimal overlay for brightness */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-black drop-shadow-[0_4px_8px_rgba(255,255,255,0.8)] leading-tight">
              Bringing the Farm to Your Front Door
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black drop-shadow-[0_4px_8px_rgba(255,255,255,0.8)] mb-8">
              With Fresh Produce, Fair Prices, and Fast Delivery.
            </p>

            {/* Carousel Dots Indicator */}
            <div className="flex justify-center gap-3 mt-10">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-green-600 w-8'
                      : 'bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-green-100 rounded-full">
              <span className="text-green-700 font-semibold">Our Platform</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Comprehensive Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering farmers, delighting customers, and connecting transport providers
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Farmer Services */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 relative overflow-hidden flex justify-center items-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
                <div className="relative z-10 transform group-hover:scale-110 transition-transform">
                  <Image
                    src="/images/login/farmer1.png"
                    alt="Farmer Services"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Farmer Services
                </h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start group/item">
                    <span className="text-green-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Product listing and management</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-green-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Inventory tracking</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-green-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Direct customer connections</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-green-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Price management</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-green-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Order notifications</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-green-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Sales analytics</span>
                  </li>
                </ul>
                <Link
                  href="/login/farmer-login"
                  className="block text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started →
                </Link>
              </div>
            </div>

            {/* Customer Services */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 relative overflow-hidden flex justify-center items-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
                <div className="relative z-10 transform group-hover:scale-110 transition-transform">
                  <Image
                    src="/images/login/login separatly/customer2.jpg"
                    alt="Customer Services"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  Customer Services
                </h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start group/item">
                    <span className="text-blue-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Browse fresh products</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-blue-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Advanced search filters</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-blue-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Secure online ordering</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-blue-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Multiple payment options</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-blue-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Order tracking</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-blue-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Customer support</span>
                  </li>
                </ul>
                <Link
                  href="/login/customer-login"
                  className="block text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Shopping →
                </Link>
              </div>
            </div>

            {/* Transport Services */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 relative overflow-hidden flex justify-center items-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl"></div>
                <div className="relative z-10 transform group-hover:scale-110 transition-transform">
                  <Image
                    src="/images/login/login separatly/tp2.jpg"
                    alt="Transport Services"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent">
                  Transport Services
                </h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start group/item">
                    <span className="text-orange-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Delivery management</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-orange-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Route optimization</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-orange-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Earnings tracking</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-orange-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Schedule management</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-orange-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Real-time updates</span>
                  </li>
                  <li className="flex items-start group/item">
                    <span className="text-orange-600 mr-3 mt-1 transform group-hover/item:scale-125 transition-transform">✓</span>
                    <span className="text-gray-700">Performance metrics</span>
                  </li>
                </ul>
                <Link
                  href="/login/transport-login"
                  className="block text-center bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Join Network →
                </Link>
              </div>
            </div>
          </div>

          {/* Why Choose Chena */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl p-10 border border-green-100 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
            
            <h3 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent relative z-10">
              Why Choose Chena?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/80 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl transform group-hover:scale-110 transition-transform shadow-lg">
                  ✨
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Easy to Use</h4>
                  <p className="text-gray-600">
                    Intuitive interface designed for users of all technical levels
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/80 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl transform group-hover:scale-110 transition-transform shadow-lg">
                  🔒
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Secure Platform</h4>
                  <p className="text-gray-600">
                    Your data and transactions are protected with industry-standard security
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/80 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl transform group-hover:scale-110 transition-transform shadow-lg">
                  💬
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">24/7 Support</h4>
                  <p className="text-gray-600">
                    Our dedicated team is always ready to help you succeed
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/80 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white text-xl transform group-hover:scale-110 transition-transform shadow-lg">
                  💰
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Fair Pricing</h4>
                  <p className="text-gray-600">
                    Transparent pricing with no hidden fees or commissions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Products Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-green-100 rounded-full">
              <span className="text-green-700 font-semibold">Fresh from Farm</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Fresh Fruits & Vegetables
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our wide selection of farm-fresh produce delivered straight to your door
            </p>
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
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading fresh products...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Product Count */}
                  <div className="mb-6 text-gray-600">
                    Showing {productsToDisplay.length} of {filteredProducts.length} Products
                  </div>

                  {/* Products Grid */}
                  {productsToDisplay.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {productsToDisplay.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <p className="text-gray-500 text-lg">No products available at the moment</p>
                    </div>
                  )}
                </>
              )}

              {/* View More/Less Button */}
              <div className="text-center">
                {displayCount < filteredProducts.length ? (
                  <button
                    onClick={() => setDisplayCount(filteredProducts.length)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View All Products ({filteredProducts.length})
                  </button>
                ) : displayCount > 8 ? (
                  <button
                    onClick={() => setDisplayCount(8)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Show Less
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl mb-10 text-green-100">Join thousands of farmers, customers, and transport providers</p>
          <Link
            href="/about-us"
            className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all inline-block transform hover:scale-105 shadow-2xl hover:shadow-green-900/50"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  )
}