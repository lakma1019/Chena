'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { showAlert } from '@/utils/notifications'
import { sriLankanBanks, farmTypes, farmSizeUnits } from '@/data/sriLankanBanks'

export default function SignIn({
  title = "Sign In as a Farmer",
  imageSrc = "/images/login/farmer1.png",
  imageAlt = "Login Image",
  showSignUp = true,
  userType = "farmer",
  onSubmit,
  onSignUp
}) {
  const [activeTab, setActiveTab] = useState('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    password: '',
    confirmPassword: '',
    address: '',
    agreeToTerms: false,
    // Farmer specific fields
    farmName: '',
    farmSize: '',
    farmSizeUnit: 'Acre',
    farmType: '',
    bankName: '',
    branch: '',
    bankAccount: ''
  })

  const [selectedBankBranches, setSelectedBankBranches] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSignUpChange = (e) => {
    const { name, value, type, checked } = e.target

    // Phone number validation - only allow digits and max 10 characters
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 10) {
        setSignUpData({
          ...signUpData,
          [name]: digitsOnly
        })
      }
      return
    }

    // NIC validation - allow old format (9 digits + V/X) or new format (12 digits)
    if (name === 'nic') {
      const upperValue = value.toUpperCase()
      // Allow only digits and V/X characters
      const validChars = upperValue.replace(/[^0-9VX]/g, '')

      // Limit to max 12 characters
      if (validChars.length <= 12) {
        setSignUpData({
          ...signUpData,
          [name]: validChars
        })
      }
      return
    }

    setSignUpData({
      ...signUpData,
      [name]: type === 'checkbox' ? checked : value
    })

    // Update branches when bank is selected
    if (name === 'bankName') {
      const selectedBank = sriLankanBanks.find(bank => bank.name === value)
      setSelectedBankBranches(selectedBank ? selectedBank.branches : [])
      setSignUpData(prev => ({ ...prev, branch: '' })) // Reset branch when bank changes
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    } else {
      console.log('Form submitted:', formData)
    }
  }

  const handleSignUpSubmit = async (e) => {
    e.preventDefault()

    // Validate email domain
    const emailLower = signUpData.email.toLowerCase()
    if (!emailLower.endsWith('@gmail.com') && !emailLower.endsWith('@yahoo.com')) {
      await showAlert('Email must be a @gmail.com or @yahoo.com address!', 'error')
      return
    }

    // Validate phone number
    if (signUpData.phone.length !== 10) {
      await showAlert('Phone number must be exactly 10 digits!', 'error')
      return
    }

    // Validate NIC format
    const nicPattern9 = /^[0-9]{9}[VX]$/  // Old format: 9 digits + V or X
    const nicPattern12 = /^[0-9]{12}$/     // New format: 12 digits

    if (!nicPattern9.test(signUpData.nic) && !nicPattern12.test(signUpData.nic)) {
      await showAlert('Invalid NIC format! Use old format (e.g., 911042754V) or new format (e.g., 199110402757)', 'error')
      return
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      await showAlert('Passwords do not match!', 'error')
      return
    }
    if (onSignUp) {
      onSignUp(signUpData)
    } else {
      console.log('Sign up submitted:', signUpData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">{title}</h1>

      <div className="w-full max-w-5xl border-4 border-green-700 rounded-lg shadow-2xl bg-white p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0 flex justify-center items-center">
            <div className="relative w-64 h-64">
              <Image src={imageSrc} alt={imageAlt} width={256} height={256} className="w-full h-full object-contain" priority />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex border-b border-gray-300 mb-6">
              <button
                onClick={() => setActiveTab('signin')}
                className={'flex-1 pb-3 text-center font-medium transition-colors ' + (activeTab === 'signin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400')}
              >
                Sign In
              </button>
              {showSignUp && (
                <button
                  onClick={() => setActiveTab('signup')}
                  className={'flex-1 pb-3 text-center font-medium transition-colors ' + (activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400')}
                >
                  Sign Up
                </button>
              )}
            </div>

            {activeTab === 'signin' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50" placeholder="Enter your email" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50" placeholder="Enter your password" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href={`/login/${userType}-login/reset-password`} className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-md font-semibold transition-colors shadow-md">
                  Sign In
                </button>

                <div className="mt-4">
                  <p className="text-center text-sm text-gray-500 mb-3">Or continue with</p>
                  <div className="flex gap-3 justify-center">
                    <button type="button" className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </button>
                    <button type="button" className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    </button>
                    <button type="button" className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'signup' && showSignUp && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={signUpData.fullName} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50" placeholder="Enter your full name" />
                </div>
                <div>
                  <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-2">Email Address (@gmail.com or @yahoo.com)</label>
                  <input
                    type="email"
                    id="signupEmail"
                    name="email"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                    placeholder="example@gmail.com or example@yahoo.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number (10 digits)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={signUpData.phone}
                    onChange={handleSignUpChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                    placeholder="Enter 10 digit phone number"
                  />
                </div>
                <div>
                  <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-2">NIC Number (9 digits+V or 12 digits)</label>
                  <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={signUpData.nic}
                    onChange={handleSignUpChange}
                    required
                    maxLength="12"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                    placeholder="e.g., 911042754V or 199110402757"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" id="address" name="address" value={signUpData.address} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50" placeholder="Enter your address" />
                </div>

                {/* Farmer-specific fields */}
                {userType === 'farmer' && (
                  <>
                    <div className="border-t-2 border-gray-200 pt-4 mt-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm Information</h3>
                    </div>

                    <div>
                      <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                      <input type="text" id="farmName" name="farmName" value={signUpData.farmName} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50" placeholder="Enter your farm name" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-2">Farm Size</label>
                        <input type="number" id="farmSize" name="farmSize" value={signUpData.farmSize} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50" placeholder="Enter size" />
                      </div>
                      <div>
                        <label htmlFor="farmSizeUnit" className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <select id="farmSizeUnit" name="farmSizeUnit" value={signUpData.farmSizeUnit} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50">
                          {farmSizeUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="farmType" className="block text-sm font-medium text-gray-700 mb-2">Farm Type</label>
                      <select id="farmType" name="farmType" value={signUpData.farmType} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50">
                        <option value="">Select farm type</option>
                        {farmTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4 mt-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Information</h3>
                    </div>

                    <div>
                      <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                      <select id="bankName" name="bankName" value={signUpData.bankName} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50">
                        <option value="">Select bank</option>
                        {sriLankanBanks.map(bank => (
                          <option key={bank.name} value={bank.name}>{bank.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                      <select id="branch" name="branch" value={signUpData.branch} onChange={handleSignUpChange} required disabled={!signUpData.bankName} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed">
                        <option value="">Select branch</option>
                        {selectedBankBranches.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input type="text" id="bankAccount" name="bankAccount" value={signUpData.bankAccount} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50" placeholder="Enter account number" />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input type="password" id="signupPassword" name="password" value={signUpData.password} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50" placeholder="Create a password" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={signUpData.confirmPassword} onChange={handleSignUpChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50" placeholder="Confirm your password" />
                </div>
                <div className="flex items-start">
                  <input type="checkbox" id="agreeToTerms" name="agreeToTerms" checked={signUpData.agreeToTerms} onChange={handleSignUpChange} required className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
                <button type="submit" className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-md font-semibold transition-colors shadow-md">
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

