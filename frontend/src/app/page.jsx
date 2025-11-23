import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Modern Overlay */}
      <section
        className="relative bg-cover bg-center py-32 md:py-48 overflow-hidden"
        style={{
          backgroundImage: "url('/images/background/home.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-green-700/30 to-emerald-900/40"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-white font-medium">🌱 Farm-Fresh Marketplace</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
              Bringing the Farm to Your Front Door
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/95 drop-shadow-lg mb-8">
              With Fresh Produce, Fair Prices, and Fast Delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                href="/login/customer-login"
                className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transform hover:scale-105 transition-all shadow-2xl hover:shadow-green-500/50"
              >
                Start Shopping
              </Link>
              <Link
                href="/login/farmer-login"
                className="px-8 py-4 bg-green-600/90 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition-all border-2 border-white/30"
              >
                Join as Farmer
              </Link>
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
                <div className="text-6xl mb-4 text-center relative z-10 transform group-hover:scale-110 transition-transform">🌾</div>
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
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
                <div className="text-6xl mb-4 text-center relative z-10 transform group-hover:scale-110 transition-transform">🛒</div>
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
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl"></div>
                <div className="text-6xl mb-4 text-center relative z-10 transform group-hover:scale-110 transition-transform">🚚</div>
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