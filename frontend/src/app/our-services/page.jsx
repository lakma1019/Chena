export default function OurServices() {
  const services = [
    {
      title: 'Farmer Services',
      icon: '🌾',
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
      icon: '🛒',
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
      icon: '🚚',
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions for farmers, customers, and transport providers
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center">{service.icon}</div>
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

