'use client'

import { useState, useEffect } from 'react'
import { authAPI } from '@/services/api'
import { showAlert } from '@/utils/notifications'

export default function ProfileTab({ userData, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const [editData, setEditData] = useState({ ...profileData })

  // Update profile data when userData prop changes
  useEffect(() => {
    if (userData) {
      const updatedData = {
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        nic: userData.nic || '',
        address: userData.address || '',
        city: userData.city || '',
        postalCode: userData.postal_code || userData.postalCode || ''
      }
      setProfileData(updatedData)
      setEditData(updatedData)
    }
  }, [userData])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...profileData })
  }

  const handleSave = async () => {
    try {
      // Validate phone number
      if (editData.phone && editData.phone.length !== 10) {
        await showAlert('Phone number must be exactly 10 digits!', 'error')
        return
      }

      // Validate NIC format
      const nicPattern9 = /^[0-9]{9}[VX]$/  // Old format: 9 digits + V or X
      const nicPattern12 = /^[0-9]{12}$/     // New format: 12 digits

      if (editData.nic && !nicPattern9.test(editData.nic) && !nicPattern12.test(editData.nic)) {
        await showAlert('Invalid NIC format! Use old format (e.g., 911042754V) or new format (e.g., 199110402757)', 'error')
        return
      }

      console.log('Sending profile update:', {
        fullName: editData.fullName,
        phone: editData.phone,
        address: editData.address,
        city: editData.city,
        postalCode: editData.postalCode,
      });

      // Call API to update profile
      const response = await authAPI.updateProfile({
        fullName: editData.fullName,
        phone: editData.phone,
        address: editData.address,
        city: editData.city,
        postalCode: editData.postalCode,
      })

      console.log('Profile update response:', response);

      if (response.success) {
        // Update local state
        setProfileData({ ...editData })
        setIsEditing(false)

        // Trigger parent component to reload user data
        if (onProfileUpdate) {
          onProfileUpdate()
        }

        await showAlert('Profile updated successfully!', 'success')
      } else {
        // Show error from response
        await showAlert(response.message || 'Failed to update profile. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      console.error('Error details:', error.response || error);
      await showAlert(error.message || 'Failed to update profile. Please try again.', 'error')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ ...profileData })
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Phone number validation - only allow digits and max 10 characters
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 10) {
        setEditData({
          ...editData,
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
        setEditData({
          ...editData,
          [name]: validChars
        })
      }
      return
    }

    setEditData({
      ...editData,
      [name]: value
    })
  }

  // Show loading state if no user data
  if (!userData || !profileData.fullName) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {profileData.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">{profileData.fullName}</h2>
            <p className="text-gray-600 text-lg mt-1">{profileData.email}</p>
            <div className="flex space-x-4 mt-3">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                ✓ Verified Customer
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                Active Account
              </span>
            </div>
          </div>
          <div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  💾 Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-md"
                >
                  ✕ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-600 pb-3">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number (10 digits)</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength="10"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter 10 digit phone number"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">NIC Number (9 digits+V or 12 digits)</label>
            {isEditing ? (
              <input
                type="text"
                name="nic"
                value={editData.nic}
                onChange={handleChange}
                maxLength="12"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., 911042754V or 199110402757"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.nic}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

