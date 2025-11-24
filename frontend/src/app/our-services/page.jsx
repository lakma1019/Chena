import Image from 'next/image'

export default function OurServices() {
  const services = [
    {
      title: 'Farmer Services',
      image: '/images/login/farmer1.png',
      features: [
        'Product listing and management',
        'Inventory tracking',
        'Direct customer connections',
        'Price management',
        'Order notifications',
        'Sales analytics',
      ],
    },
    {
      title: 'Customer Services',
      image: '/images/login/login separatly/customer2.jpg',
      features: [
        'Browse fresh products',
        'Advanced search filters',
        'Secure online ordering',
        'Multiple payment options',
        'Order tracking',
        'Customer support',
      ],
    },
    {
      title: 'Transport Services',
      image: '/images/login/login separatly/tp2.jpg',
      features: [
        'Delivery management',
        'Route optimization',
        'Earnings tracking',
        'Schedule management',
        'Real-time updates',
        'Performance metrics',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Providing Fresh Produce Every Single Day
          </h1>
        </div>

        {/* Fresh Produce Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          {/* Direct Marketplace for Farmers */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <Image
                src="/images/our services/farmer2.png"
                alt="Farmer"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="bg-green-100 rounded-2xl p-6 flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Direct Marketplace for Farmers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We empower farmers by giving them direct access to buyers, eliminating middlemen. Through Chena, they can list produce, manage orders and earn a fair price, all from their fingertips.
              </p>
            </div>
          </div>

          {/* Fast & Reliable Delivery */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <Image
                src="/images/our services/tp2.png"
                alt="Delivery"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="bg-green-100 rounded-2xl p-6 flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Fast & Reliable Delivery
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Chena connects with verified transport providers to ensure quick and safe delivery from farm to doorstep. Our logistics system is designed for speed, reliability, and customer satisfaction.
              </p>
            </div>
          </div>

          {/* Fair & Transparent Pricing */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <Image
                src="/images/our services/shop.png"
                alt="Shop"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="bg-green-100 rounded-2xl p-6 flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Fair & Transparent Pricing
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We ensure fair pricing for both farmers and buyers through real-time market data and direct negotiation. No hidden fees, no unfair cuts — just honest trade for all.
              </p>
            </div>
          </div>

          {/* Fresh Vegetables for Buyers */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <Image
                src="/images/our services/food bucket.png"
                alt="Fresh Vegetables"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="bg-green-100 rounded-2xl p-6 flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Fresh Vegetables for Buyers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Buyers can explore a wide range of freshly harvested vegetables directly from trusted local farmers. Chena ensures quality, transparency, and convenience every step of the way.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
                {service.title}
              </h2>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Why Choose Chena?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface designed for users of all technical levels
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your data and transactions are protected with industry-standard security
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated team is always ready to help you succeed
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Fair Pricing</h3>
              <p className="text-gray-600">
                Transparent pricing with no hidden fees or commissions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

