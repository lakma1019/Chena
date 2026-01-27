'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/services/api'
import { showAlert } from '@/utils/notifications'
import { sriLankanBanks, farmTypes, farmSizeUnits } from '@/data/sriLankanBanks'

export default function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    userType: 'all',
    status: 'all',
    search: ''
  })
  const [editingUser, setEditingUser] = useState(null)
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [filters])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllUsers(filters)
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
      await showAlert('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      return
    }

    try {
      const response = await adminAPI.updateUserStatus(userId, !currentStatus)
      if (response.success) {
        await showAlert(response.message, 'success')
        loadUsers()
      }
    } catch (error) {
      await showAlert('Failed to update user status', 'error')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await adminAPI.deleteUser(userId)
      if (response.success) {
        await showAlert(response.message, 'success')
        loadUsers()
      }
    } catch (error) {
      await showAlert(error.message || 'Failed to delete user', 'error')
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)

    // Prepare edit data based on user type
    const baseData = {
      fullName: user.full_name || '',
      phone: user.phone || '',
      address: user.address || '',
    }

    if (user.user_type === 'farmer') {
      // Combine farm_size and farm_size_unit for display
      const farmSizeDisplay = user.farm_size && user.farm_size_unit
        ? `${user.farm_size} ${user.farm_size_unit}`
        : ''

      setEditData({
        ...baseData,
        farmName: user.farm_name || '',
        farmSize: farmSizeDisplay,
        farmType: user.farm_type || '',
        bankAccount: user.bank_account || '',
        bankName: user.bank_name || '',
        branch: user.branch || '',
      })
    } else if (user.user_type === 'customer') {
      setEditData({
        ...baseData,
        city: user.customer_city || '',
        postalCode: user.customer_postal_code || '',
      })
    } else if (user.user_type === 'transport') {
      setEditData({
        ...baseData,
        city: user.transport_city || '',
        postalCode: user.transport_postal_code || '',
      })
    } else {
      setEditData(baseData)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingUser || !editData) return

    // Validate phone number
    if (editData.phone && editData.phone.length !== 10) {
      await showAlert('Phone number must be exactly 10 digits!', 'error')
      return
    }

    try {
      const response = await adminAPI.updateUserProfile(editingUser.user_id, editData)
      if (response.success) {
        await showAlert('User profile updated successfully!', 'success')
        setEditingUser(null)
        setEditData(null)
        loadUsers()
      } else {
        await showAlert(response.message || 'Failed to update user profile', 'error')
      }
    } catch (error) {
      console.error('Failed to update user profile:', error)
      await showAlert(error.message || 'Server error while updating profile', 'error')
    }
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setEditData(null)
  }

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'farmer': return '🌾'
      case 'customer': return '🛒'
      case 'transport': return '🚚'
      case 'admin': return '👑'
      default: return '👤'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">User Type</label>
            <select
              value={filters.userType}
              onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Users</option>
              <option value="farmer">Farmers</option>
              <option value="customer">Customers</option>
              <option value="transport">Transport Providers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, email, phone..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-800">{user.full_name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center space-x-2">
                        <span className="text-2xl">{getUserTypeIcon(user.user_type)}</span>
                        <span className="capitalize font-medium text-gray-700">{user.user_type}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.user_id, user.is_active)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            user.is_active
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        {user.user_type !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.user_id, user.full_name)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit User Profile - {editingUser.full_name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                User Type: <span className="font-semibold capitalize">{editingUser.user_type}</span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Common Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (10 digits)</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '')
                    if (digitsOnly.length <= 10) {
                      setEditData({ ...editData, phone: digitsOnly })
                    }
                  }}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter 10 digit phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Farmer-specific Fields */}
              {editingUser.user_type === 'farmer' && (
                <>
                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Name</label>
                    <input
                      type="text"
                      value={editData.farmName}
                      onChange={(e) => setEditData({ ...editData, farmName: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Size</label>
                      <input
                        type="text"
                        value={editData.farmSize}
                        onChange={(e) => setEditData({ ...editData, farmSize: e.target.value })}
                        placeholder="e.g., 120 Acre"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Type</label>
                      <select
                        value={editData.farmType}
                        onChange={(e) => setEditData({ ...editData, farmType: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select Farm Type</option>
                        {farmTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                    <select
                      value={editData.bankName}
                      onChange={(e) => setEditData({ ...editData, bankName: e.target.value, branch: '' })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select Bank</option>
                      {sriLankanBanks.map((bank) => (
                        <option key={bank.name} value={bank.name}>{bank.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
                    <select
                      value={editData.branch}
                      onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
                      disabled={!editData.bankName}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Branch</option>
                      {editData.bankName && sriLankanBanks.find(b => b.name === editData.bankName)?.branches.map((branch) => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Account Number</label>
                    <input
                      type="text"
                      value={editData.bankAccount}
                      onChange={(e) => setEditData({ ...editData, bankAccount: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </>
              )}

              {/* Customer/Transport-specific Fields */}
              {(editingUser.user_type === 'customer' || editingUser.user_type === 'transport') && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={editData.postalCode}
                      onChange={(e) => setEditData({ ...editData, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

