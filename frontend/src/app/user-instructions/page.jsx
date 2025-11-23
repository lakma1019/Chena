export default function UserInstructions() {
  const instructions = {
    farmers: [
      'Create your farmer account with valid credentials',
      'Complete your profile with farm details and location',
      'Add products with accurate descriptions and pricing',
      'Upload clear photos of your products',
      'Manage inventory and update stock regularly',
      'Respond to customer inquiries promptly',
      'Process orders and coordinate with transport',
    ],
    customers: [
      'Register as a customer with your details',
      'Browse products by category or search',
      'Add items to cart and review your order',
      'Choose delivery address and time slot',
      'Select payment method and complete checkout',
      'Track your order status in real-time',
      'Rate and review products after delivery',
    ],
    transport: [
      'Sign up as a transport provider',
      'Complete vehicle and license verification',
      'Set your availability and service areas',
      'Accept delivery requests from the dashboard',
      'Pick up products from farmers',
      'Deliver to customers on time',
      'Update delivery status and collect payment',
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">User Instructions</h1>
          <p className="text-xl text-gray-600">Step-by-step guide for all users</p>
        </div>

        {/* Farmers Instructions */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🌾</span>
            <h2 className="text-2xl font-semibold text-primary">For Farmers</h2>
          </div>
          <ol className="space-y-3">
            {instructions.farmers.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 pt-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Customers Instructions */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🛒</span>
            <h2 className="text-2xl font-semibold text-secondary">For Customers</h2>
          </div>
          <ol className="space-y-3">
            {instructions.customers.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 pt-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Transport Instructions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🚚</span>
            <h2 className="text-2xl font-semibold text-accent">For Transport Providers</h2>
          </div>
          <ol className="space-y-3">
            {instructions.transport.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 pt-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

