# Admin Edit User Profile Feature

## Problem
Admin dashboard had no functionality to edit farmer (or other user) details. When trying to edit and save farmer information, the error "Server error while updating profile" appeared because:
1. No edit button or modal existed in the UsersTab component
2. No backend API endpoint for admins to update user profiles
3. No frontend API method to call the admin update endpoint

## Solution Implemented

### 1. Backend Changes

#### Added Admin Update User Profile Endpoint
**File:** `backend/src/controllers/adminController.js`

Added `updateUserProfile` function that:
- Accepts userId as a parameter (admin can update any user)
- Updates the `users` table (fullName, phone, address)
- Updates user-type specific tables:
  - **Farmers**: farm_name, farm_size, farm_size_unit, farm_type, bank details
  - **Customers**: city, postal_code
  - **Transport**: city, postal_code
- Parses farm size correctly (e.g., "120 Acre" → 120 + "Acre")
- Creates farmer record if it doesn't exist

#### Updated getAllUsers Query
**File:** `backend/src/controllers/adminController.js`

Enhanced the query to include all farmer fields:
- farm_size, farm_size_unit, farm_type
- bank_account, bank_name, branch
- customer_postal_code, transport_postal_code

#### Added Route
**File:** `backend/src/routes/adminRoutes.js`

```javascript
// PUT /api/admin/users/:userId/profile - Update user profile
router.put("/users/:userId/profile", updateUserProfile);
```

### 2. Frontend API Changes

**File:** `frontend/src/services/api.js`

Added admin API method:
```javascript
updateUserProfile: async (userId, profileData) => {
  return apiRequest(`/api/admin/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}
```

### 3. Frontend UI Changes

**File:** `frontend/src/components/admin-dashboard/UsersTab.jsx`

#### Added State Management
- `editingUser`: Stores the user being edited
- `editData`: Stores the form data

#### Added Functions
- `handleEditUser(user)`: Opens edit modal with user data
- `handleSaveEdit()`: Saves changes via API
- `handleCancelEdit()`: Closes modal without saving

#### Added Edit Button
Added "Edit" button to each user row in the table

#### Added Edit Modal
Full-featured modal with:
- Common fields: Full Name, Phone, Address
- Farmer-specific fields: Farm Name, Farm Size, Farm Type, Bank Details
- Customer/Transport fields: City, Postal Code
- Dropdowns for Bank Name, Branch, Farm Type
- Save and Cancel buttons

## Features

### For All Users
- Edit full name, phone, address

### For Farmers
- Edit farm name, size (with unit), type
- Edit bank account, bank name, branch
- Dropdown selection for banks and branches
- Dropdown selection for farm types

### For Customers/Transport
- Edit city and postal code

## API Endpoints

### Update User Profile (Admin)
```
PUT /api/admin/users/:userId/profile
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+94 77 123 4567",
  "address": "123 Main St, Colombo",
  "farmName": "Green Valley Farm",
  "farmSize": "120 Acre",
  "farmType": "Organic Vegetables",
  "bankAccount": "1234567890",
  "bankName": "Bank of Ceylon",
  "branch": "Colombo Fort"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User profile updated successfully"
}
```

## Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Login as admin at http://localhost:3000/login/admin-login
4. Go to Users tab
5. Click "Edit" button on any user
6. Modify fields and click "Save Changes"
7. Verify data is updated in the database and UI

## Files Modified

### Backend
- `backend/src/controllers/adminController.js` - Added updateUserProfile function and enhanced getAllUsers
- `backend/src/routes/adminRoutes.js` - Added PUT route for profile update

### Frontend
- `frontend/src/services/api.js` - Added updateUserProfile API method
- `frontend/src/components/admin-dashboard/UsersTab.jsx` - Added edit functionality and modal

## Database Schema Reference

The update handles these tables:
- `users` - full_name, phone, address
- `farmers` - farm_name, farm_size, farm_size_unit, farm_type, bank_account, bank_name, branch
- `customers` - city, postal_code
- `transport_providers` - city, postal_code

