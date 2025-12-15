'use client'

import { useState } from 'react'
import Image from 'next/image'
import { showAlert } from '@/utils/notifications'

export default function AboutUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData)
    await showAlert('Thank you for contacting us! We will get back to you soon.', 'success')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Content Section with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Why Chena Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-[#1e6b3e] mr-2">🌿</span> Why Chena ?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Chena is a web-based agricultural supply chain platform designed to transform Sri Lanka's farming trade.
              </p>

              {/* Mission, What We Do, Why Chena, Vision */}
              <div className="space-y-6">
                <div className="flex items-start">
                  <span className="text-[#1e6b3e] text-xl mr-3 mt-1">•</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      <span className="text-[#1e6b3e]">Our Mission:</span> Empower farmers, ensure fair trade, and connect all players in the agriculture ecosystem.
                    </h3>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-[#1e6b3e] text-xl mr-3 mt-1">•</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      <span className="text-[#1e6b3e]">What We Do:</span> Provide a direct marketplace for farmers, fresh produce for buyers, and reliable transport options.
                    </h3>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-[#1e6b3e] text-xl mr-3 mt-1">•</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      <span className="text-[#1e6b3e]">Why Chena:</span> We eliminate middlemen, promote transparency, and help local farmers earn more.
                    </h3>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-[#1e6b3e] text-xl mr-3 mt-1">•</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      <span className="text-[#1e6b3e]">Our Vision:</span> Build a smarter, fairer, and more sustainable future for agriculture in Sri Lanka.
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chef Image */}
          <div className="flex justify-center items-start lg:justify-end">
            <div className="relative w-full max-w-md">
              <Image
                src="/images/about us/chef.png"
                alt="Chef with fresh vegetables"
                width={500}
                height={500}
                className="rounded-lg shadow-lg w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div id="contact" className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e6b3e] focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1e6b3e] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#165a32] transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📍</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                      <p className="text-gray-600">123 Agricultural Road, Colombo, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📞</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                      <p className="text-gray-600">+94 XX XXX XXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📧</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600">support@chena.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">🕒</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e6b3e] text-white rounded-lg shadow-md p-8">
                <h4 className="text-xl font-semibold mb-4">Need Immediate Help?</h4>
                <p className="mb-4">
                  For urgent matters, please call our 24/7 helpline or check our FAQ section for quick answers.
                </p>
                <a
                  href="/faq"
                  className="inline-block bg-white text-[#1e6b3e] px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                  View FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

