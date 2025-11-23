'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How do I register on Chena?',
      answer: 'Click on the Login button and select your user type (Farmer, Customer, or Transport). Then click on the registration link to create your account.',
    },
    {
      question: 'Is there any registration fee?',
      answer: 'No, registration is completely free for all user types. We only charge a small commission on successful transactions.',
    },
    {
      question: 'How do farmers list their products?',
      answer: 'After logging in, farmers can access their dashboard and use the "Add Product" feature to list items with photos, descriptions, and pricing.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept cash on delivery, bank transfers, and online payments through our secure payment gateway.',
    },
    {
      question: 'How is delivery handled?',
      answer: 'Our network of verified transport providers handles all deliveries. You can track your order in real-time through your dashboard.',
    },
    {
      question: 'What if I receive damaged products?',
      answer: 'We have a quality guarantee policy. Contact our support team within 24 hours of delivery, and we will resolve the issue.',
    },
    {
      question: 'How do transport providers get paid?',
      answer: 'Transport providers receive payment after successful delivery confirmation. Payments are processed weekly to your registered bank account.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, orders can be cancelled before they are picked up by the transport provider. A full refund will be issued for prepaid orders.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us through the Contact Us page, email us at support@chena.com, or call our helpline at +94 XX XXX XXXX.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect all user data and transactions.',
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions</p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-primary transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact-us"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-green-600 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

