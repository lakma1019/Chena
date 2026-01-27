'use client'

import { useState, useEffect } from 'react'
import { authAPI, transportAPI } from '@/services/api'
import { showAlert } from '@/utils/notifications'

export default function ProfileTab({ userData, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [hasDeliveryDetails, setHasDeliveryDetails] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const [deliveryData, setDeliveryData] = useState({
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    isVehicleOwner: 'yes',
    ownerNic: '',
    ownerPhone: '',
    ownerAddress: '',
    pricePerKm: ''
  })

  const [editData, setEditData] = useState({ ...profileData })
  const [editDeliveryData, setEditDeliveryData] = useState({ ...deliveryData })

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

      // Load existing vehicles
      loadVehicles()
    }
  }, [userData])

  const loadVehicles = async () => {
    try {
      const response = await transportAPI.getVehicles()
      if (response.success && response.data && response.data.length > 0) {
        // If vehicles exist, show the first one in the delivery details
        const firstVehicle = response.data[0]
        setDeliveryData({
          vehicleType: firstVehicle.vehicle_type,
          vehicleNumber: firstVehicle.vehicle_number,
          licenseNumber: firstVehicle.license_number,
          isVehicleOwner: firstVehicle.is_vehicle_owner ? 'yes' : 'no',
          ownerNic: firstVehicle.owner_nic || '',
          ownerPhone: firstVehicle.owner_phone || '',
          ownerAddress: firstVehicle.owner_address || '',
          pricePerKm: firstVehicle.price_per_km || ''
        })
        setHasDeliveryDetails(true)
      }
    } catch (error) {
      console.error('Error loading vehicles:', error)
    }
  }

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

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target

    // Phone number validation for owner phone - only allow digits and max 10 characters
    if (name === 'ownerPhone') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 10) {
        setEditDeliveryData({
          ...editDeliveryData,
          [name]: digitsOnly
        })
      }
      return
    }

    // NIC validation for owner NIC - allow old format (9 digits + V/X) or new format (12 digits)
    if (name === 'ownerNic') {
      const upperValue = value.toUpperCase()
      // Allow only digits and V/X characters
      const validChars = upperValue.replace(/[^0-9VX]/g, '')

      // Limit to max 12 characters
      if (validChars.length <= 12) {
        setEditDeliveryData({
          ...editDeliveryData,
          [name]: validChars
        })
      }
      return
    }

    setEditDeliveryData({
      ...editDeliveryData,
      [name]: value
    })
  }

  const handleAddDeliveryDetails = () => {
    setShowDeliveryForm(true)
    setEditDeliveryData({ ...deliveryData })
  }

  const handleSaveDeliveryDetails = async () => {
    // Validate required fields
    if (!editDeliveryData.vehicleType || !editDeliveryData.vehicleNumber ||
        !editDeliveryData.licenseNumber || !editDeliveryData.pricePerKm) {
      await showAlert('Please fill in all required fields!', 'error')
      return
    }

    // Validate price per km
    const pricePerKm = parseFloat(editDeliveryData.pricePerKm)
    if (isNaN(pricePerKm) || pricePerKm <= 0) {
      await showAlert('Please enter a valid price per kilometer!', 'error')
      return
    }

    // Validate owner phone number if vehicle is not owned
    if (editDeliveryData.isVehicleOwner === 'no' && editDeliveryData.ownerPhone && editDeliveryData.ownerPhone.length !== 10) {
      await showAlert('Owner phone number must be exactly 10 digits!', 'error')
      return
    }

    // Validate owner NIC format if vehicle is not owned
    const nicPattern9 = /^[0-9]{9}[VX]$/  // Old format: 9 digits + V or X
    const nicPattern12 = /^[0-9]{12}$/     // New format: 12 digits

    if (editDeliveryData.isVehicleOwner === 'no' && editDeliveryData.ownerNic &&
        !nicPattern9.test(editDeliveryData.ownerNic) && !nicPattern12.test(editDeliveryData.ownerNic)) {
      await showAlert('Invalid owner NIC format! Use old format (e.g., 911042754V) or new format (e.g., 199110402757)', 'error')
      return
    }

    try {
      // Call API to save vehicle to database
      const response = await transportAPI.addVehicle({
        vehicleType: editDeliveryData.vehicleType,
        vehicleNumber: editDeliveryData.vehicleNumber,
        licenseNumber: editDeliveryData.licenseNumber,
        isVehicleOwner: editDeliveryData.isVehicleOwner === 'yes',
        ownerNic: editDeliveryData.ownerNic || null,
        ownerPhone: editDeliveryData.ownerPhone || null,
        ownerAddress: editDeliveryData.ownerAddress || null,
        pricePerKm: pricePerKm
      })

      if (response.success) {
        setDeliveryData({ ...editDeliveryData })
        setHasDeliveryDetails(true)
        setShowDeliveryForm(false)
        await showAlert('Vehicle added successfully! It will now appear in customer orders.', 'success')
      } else {
        await showAlert(response.message || 'Failed to add vehicle. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error saving vehicle:', error)
      await showAlert(error.message || 'Failed to add vehicle. Please try again.', 'error')
    }
  }

  const handleEditDeliveryDetails = () => {
    setShowDeliveryForm(true)
    setEditDeliveryData({ ...deliveryData })
  }

  const handleCancelDeliveryDetails = () => {
    setShowDeliveryForm(false)
    setEditDeliveryData({ ...deliveryData })
  }

  // Show loading state if no user data
  if (!userData || !profileData.fullName) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
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
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {profileData.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">{profileData.fullName}</h2>
            <p className="text-gray-600 text-lg mt-1">{profileData.email}</p>
            <div className="flex space-x-4 mt-3">
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">
                ✓ Verified Provider
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
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-yellow-600 pb-3">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business/Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Details Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b-2 border-yellow-600 pb-3">
          <h3 className="text-2xl font-bold text-gray-800">
            Delivery Details
          </h3>
          {!hasDeliveryDetails && !showDeliveryForm && (
            <button
              onClick={handleAddDeliveryDetails}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
            >
              ➕ Add Delivery Details
            </button>
          )}
          {hasDeliveryDetails && !showDeliveryForm && (
            <button
              onClick={handleEditDeliveryDetails}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
            >
              ✏️ Edit Details
            </button>
          )}
          {showDeliveryForm && (
            <div className="space-x-2">
              <button
                onClick={handleSaveDeliveryDetails}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                💾 Save
              </button>
              <button
                onClick={handleCancelDeliveryDetails}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-md"
              >
                ✕ Cancel
              </button>
            </div>
          )}
        </div>

        {!hasDeliveryDetails && !showDeliveryForm && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg mb-4">No delivery details added yet</p>
            <p className="text-gray-400">Click "Add Delivery Details" to get started</p>
          </div>
        )}

        {(hasDeliveryDetails || showDeliveryForm) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
              {showDeliveryForm ? (
                <select
                  name="vehicleType"
                  value={editDeliveryData.vehicleType}
                  onChange={handleDeliveryChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                >
                  <option value="">Select vehicle type</option>
                  <option value="Lorry">Lorry</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Three Wheeler">Three Wheeler</option>
                  <option value="Bike">Bike</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{deliveryData.vehicleType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number</label>
              {showDeliveryForm ? (
                <input
                  type="text"
                  name="vehicleNumber"
                  value={editDeliveryData.vehicleNumber}
                  onChange={handleDeliveryChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  placeholder="e.g., WP CAB-1234"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{deliveryData.vehicleNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
              {showDeliveryForm ? (
                <input
                  type="text"
                  name="licenseNumber"
                  value={editDeliveryData.licenseNumber}
                  onChange={handleDeliveryChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  placeholder="e.g., B1234567"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{deliveryData.licenseNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Are you the owner of the vehicle?</label>
              {showDeliveryForm ? (
                <select
                  name="isVehicleOwner"
                  value={editDeliveryData.isVehicleOwner}
                  onChange={handleDeliveryChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {deliveryData.isVehicleOwner === 'yes' ? 'Yes' : 'No'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price per 1 Kilometer (Rs.)</label>
              {showDeliveryForm ? (
                <input
                  type="number"
                  name="pricePerKm"
                  value={editDeliveryData.pricePerKm}
                  onChange={handleDeliveryChange}
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  placeholder="e.g., 50.00"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">Rs. {deliveryData.pricePerKm}</p>
              )}
            </div>

            {/* Owner Details - Only show if not the owner */}
            {(showDeliveryForm ? editDeliveryData.isVehicleOwner === 'no' : deliveryData.isVehicleOwner === 'no') && (
              <>
                <div className="md:col-span-2">
                  <h4 className="text-lg font-bold text-gray-700 mb-4 mt-4 border-t-2 border-gray-200 pt-4">
                    Vehicle Owner Information
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Owner NIC Number (9 digits+V or 12 digits)</label>
                  {showDeliveryForm ? (
                    <input
                      type="text"
                      name="ownerNic"
                      value={editDeliveryData.ownerNic}
                      onChange={handleDeliveryChange}
                      required
                      maxLength="12"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="e.g., 911042754V or 199110402757"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{deliveryData.ownerNic || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Phone Number (10 digits)</label>
                  {showDeliveryForm ? (
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={editDeliveryData.ownerPhone}
                      onChange={handleDeliveryChange}
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Enter 10 digit phone number"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{deliveryData.ownerPhone || 'N/A'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Address</label>
                  {showDeliveryForm ? (
                    <input
                      type="text"
                      name="ownerAddress"
                      value={editDeliveryData.ownerAddress}
                      onChange={handleDeliveryChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Owner's address"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{deliveryData.ownerAddress || 'N/A'}</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

