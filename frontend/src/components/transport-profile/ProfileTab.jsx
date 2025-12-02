'use client'

import { useState } from 'react'

export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [hasDeliveryDetails, setHasDeliveryDetails] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: 'Kamal Transport Services',
    email: 'kamal@transport.com',
    phone: '+94 77 345 6789',
    nic: '198512345678',
    address: 'No. 78, Galle Road, Colombo 03',
    city: 'Colombo',
    postalCode: '00300'
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

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...profileData })
  }

  const handleSave = () => {
    setProfileData({ ...editData })
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ ...profileData })
  }

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const handleDeliveryChange = (e) => {
    setEditDeliveryData({
      ...editDeliveryData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddDeliveryDetails = () => {
    setShowDeliveryForm(true)
    setEditDeliveryData({ ...deliveryData })
  }

  const handleSaveDeliveryDetails = () => {
    setDeliveryData({ ...editDeliveryData })
    setHasDeliveryDetails(true)
    setShowDeliveryForm(false)
    alert('Delivery details saved successfully!')
  }

  const handleEditDeliveryDetails = () => {
    setShowDeliveryForm(true)
    setEditDeliveryData({ ...deliveryData })
  }

  const handleCancelDeliveryDetails = () => {
    setShowDeliveryForm(false)
    setEditDeliveryData({ ...deliveryData })
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {profileData.fullName.charAt(0)}
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{profileData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">NIC Number</label>
            {isEditing ? (
              <input
                type="text"
                name="nic"
                value={editData.nic}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Owner NIC Number</label>
                  {showDeliveryForm ? (
                    <input
                      type="text"
                      name="ownerNic"
                      value={editDeliveryData.ownerNic}
                      onChange={handleDeliveryChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Owner's NIC"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{deliveryData.ownerNic || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Phone Number</label>
                  {showDeliveryForm ? (
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={editDeliveryData.ownerPhone}
                      onChange={handleDeliveryChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Owner's phone number"
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

