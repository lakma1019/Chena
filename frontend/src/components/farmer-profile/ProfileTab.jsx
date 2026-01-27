'use client'

import { useState, useEffect } from 'react'
import { sriLankanBanks, farmTypes } from '@/data/sriLankanBanks'
import { showAlert } from '@/utils/notifications'
import { authAPI } from '@/services/api'

export default function ProfileTab({ userData, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    address: '',
    farmName: '',
    farmSize: '',
    farmType: '',
    bankAccount: '',
    bankName: '',
    branch: ''
  })

  const [editData, setEditData] = useState({ ...profileData })
  const [selectedBankBranches, setSelectedBankBranches] = useState([])

  // Update profile data when userData prop changes
  useEffect(() => {
    if (userData) {
      const updatedData = {
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        nic: userData.nic || '',
        address: userData.address || '',
        farmName: userData.farm_name || '',
        farmSize: userData.farm_size || '',
        farmType: userData.farm_type || '',
        bankAccount: userData.bank_account || '',
        bankName: userData.bank_name || '',
        branch: userData.branch || ''
      }
      setProfileData(updatedData)
      setEditData(updatedData)
    }
  }, [userData])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...profileData })

    // Initialize bank branches if bank is already selected
    if (profileData.bankName) {
      const selectedBank = sriLankanBanks.find(bank => bank.name === profileData.bankName)
      setSelectedBankBranches(selectedBank ? selectedBank.branches : [])
    }
  }

  const handleSave = async () => {
    try {
      // Validate email domain
      if (editData.email) {
        const emailLower = editData.email.toLowerCase()
        if (!emailLower.endsWith('@gmail.com') && !emailLower.endsWith('@yahoo.com')) {
          await showAlert('Email must be a @gmail.com or @yahoo.com address!', 'error')
          return
        }
      }

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
        farmName: editData.farmName,
        farmSize: editData.farmSize,
        farmType: editData.farmType,
        bankAccount: editData.bankAccount,
        bankName: editData.bankName,
        branch: editData.branch,
      });

      // Call API to update profile
      const response = await authAPI.updateProfile({
        fullName: editData.fullName,
        phone: editData.phone,
        address: editData.address,
        farmName: editData.farmName,
        farmSize: editData.farmSize,
        farmType: editData.farmType,
        bankAccount: editData.bankAccount,
        bankName: editData.bankName,
        branch: editData.branch,
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
    setEditData({ ...profileData })
    setIsEditing(false)
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

    // Update branches when bank is selected
    if (name === 'bankName') {
      const selectedBank = sriLankanBanks.find(bank => bank.name === value)
      setSelectedBankBranches(selectedBank ? selectedBank.branches : [])
      setEditData(prev => ({ ...prev, branch: '' })) // Reset branch when bank changes
    }
  }

  // Show loading state if no user data
  if (!userData || !profileData.fullName) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {profileData.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">{profileData.fullName}</h2>
            <p className="text-gray-600 text-lg mt-1">{profileData.farmName || 'No farm name'}</p>
            <div className="flex space-x-4 mt-3">
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                ✓ Verified Farmer
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                📍 {profileData.farmType}
              </span>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-md"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-green-600 pb-3">
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address (@gmail.com or @yahoo.com)</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="example@gmail.com or example@yahoo.com"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.email}</p>
            )}
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Farm Information */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-green-600 pb-3">
          Farm Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Name</label>
            {isEditing ? (
              <input
                type="text"
                name="farmName"
                value={editData.farmName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.farmName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Size</label>
            {isEditing ? (
              <input
                type="text"
                name="farmSize"
                value={editData.farmSize}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.farmSize}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Type</label>
            {isEditing ? (
              <select
                name="farmType"
                value={editData.farmType}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >
                <option value="">Select farm type</option>
                {farmTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.farmType}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bank Information */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-green-600 pb-3">
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
            {isEditing ? (
              <select
                name="bankName"
                value={editData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >
                <option value="">Select bank</option>
                {sriLankanBanks.map(bank => (
                  <option key={bank.name} value={bank.name}>{bank.name}</option>
                ))}
              </select>
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.bankName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
            {isEditing ? (
              <select
                name="branch"
                value={editData.branch}
                onChange={handleChange}
                disabled={!editData.bankName}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <option value="">Select branch</option>
                {selectedBankBranches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.branch}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
            {isEditing ? (
              <input
                type="text"
                name="bankAccount"
                value={editData.bankAccount}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.bankAccount}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-md"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}

