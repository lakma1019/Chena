import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Chena</h3>
            <p className="text-gray-300 text-sm">
              Connecting farmers, customers, and transport services for a better agricultural ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-services" className="text-gray-300 hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/product-list" className="text-gray-300 hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/user-instructions" className="text-gray-300 hover:text-primary transition-colors">
                  User Instructions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about-us#contact" className="text-gray-300 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Login Options */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Login</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login/farmer-login" className="text-gray-300 hover:text-primary transition-colors">
                  Farmer Login
                </Link>
              </li>
              <li>
                <Link href="/login/customer-login" className="text-gray-300 hover:text-primary transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/login/transport-login" className="text-gray-300 hover:text-primary transition-colors">
                  Transport Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Chena. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

