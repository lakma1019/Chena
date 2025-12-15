# ✅ Profile Update Fix - Farm Details Not Saving to Database

## 🐛 **Problem**

Farm details (farm name, farm size, farm type, bank information) were showing in the UI after editing but **disappearing after page refresh**. The data was **NOT being saved to the database**.

### Root Cause
The `handleSave` function in `ProfileTab.jsx` was only updating the **local React state** but **NOT calling any API** to save the data to the database.

```javascript
// ❌ OLD CODE (BROKEN)
const handleSave = async () => {
  setProfileData({ ...editData })  // Only updates local state
  setIsEditing(false)
  await showAlert('Profile updated successfully!', 'success')
}
```

---

## ✅ **Solution Implemented**

### 1. **Backend: Created Update Profile API Endpoint**

**File:** `backend/src/controllers/authController.js`

Added new `updateProfile` function that:
- Updates the `users` table (fullName, phone, address)
- Updates farmer-specific data in `farmers` table (farmName, farmSize, farmType, bank details)
- Parses farm size correctly (e.g., "120 Acre" → 120 + "Acre")
- Supports customer and transport profile updates too

```javascript
export const updateProfile = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { fullName, phone, address, farmName, farmSize, farmType, 
            bankAccount, bankName, branch, city, postalCode } = req.body;

    // Update users table
    if (fullName || phone || address) {
      await db.query(
        `UPDATE users SET full_name = ?, phone = ?, address = ?, 
         updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        [fullName, phone, address, userId]
      );
    }

    // Update farmers table
    if (userType === "farmer") {
      // Parse farm size (e.g., "120 Acre" -> 120 and "Acre")
      const match = farmSize.match(/^([\d.]+)\s*(Acre|Perch)?$/i);
      
      await db.query(
        `UPDATE farmers SET farm_name = ?, farm_size = ?, 
         farm_size_unit = ?, farm_type = ?, bank_account = ?, 
         bank_name = ?, branch = ? WHERE user_id = ?`,
        [farmName, farmSizeValue, farmSizeUnit, farmType, 
         bankAccount, bankName, branch, userId]
      );
    }

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
```

---

### 2. **Backend: Added Route**

**File:** `backend/src/routes/authRoutes.js`

```javascript
import { updateProfile } from "../controllers/authController.js";

// PUT /api/auth/profile - Update user profile (protected route)
router.put("/profile", authenticateToken, updateProfile);
```

---

### 3. **Frontend: Added API Function**

**File:** `frontend/src/services/api.js`

```javascript
export const authAPI = {
  // ... other methods

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};
```

---

### 4. **Frontend: Updated ProfileTab Component**

**File:** `frontend/src/components/farmer-profile/ProfileTab.jsx`

```javascript
import { authAPI } from '@/services/api'

export default function ProfileTab({ userData, onProfileUpdate }) {
  const handleSave = async () => {
    try {
      // ✅ Call API to save to database
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

      if (response.success) {
        setProfileData({ ...editData })
        setIsEditing(false)
        
        // Reload user data from database
        if (onProfileUpdate) {
          onProfileUpdate()
        }
        
        await showAlert('Profile updated successfully!', 'success')
      }
    } catch (error) {
      await showAlert('Failed to update profile. Please try again.', 'error')
    }
  }
}
```

---

### 5. **Frontend: Updated Farmer Dashboard**

**File:** `frontend/src/app/farmer-dashboard/page.jsx`

```javascript
const handleProfileUpdate = async () => {
  try {
    const response = await authAPI.getCurrentUser()
    if (response.success) {
      setUserData(response.data)  // Reload fresh data from database
    }
  } catch (error) {
    console.error('Failed to reload user data:', error)
  }
}

// Pass callback to ProfileTab
<ProfileTab userData={userData} onProfileUpdate={handleProfileUpdate} />
```

---

## 🎯 **How It Works Now**

1. **User edits profile** → Changes stored in `editData` state
2. **User clicks "Save"** → `handleSave()` is called
3. **API call made** → `PUT /api/auth/profile` with updated data
4. **Backend updates database** → Updates `users` and `farmers` tables
5. **Success response** → Local state updated
6. **Callback triggered** → `onProfileUpdate()` reloads data from database
7. **Fresh data displayed** → User sees updated profile
8. **After refresh** → Data persists because it's in the database ✅

---

## ✅ **What's Fixed**

- ✅ Farm Name saves to database
- ✅ Farm Size saves to database (with unit: Acre/Perch)
- ✅ Farm Type saves to database
- ✅ Bank Account saves to database
- ✅ Bank Name saves to database
- ✅ Branch saves to database
- ✅ Personal info (Name, Phone, Address) saves to database
- ✅ Data persists after page refresh
- ✅ Data shows correctly in UI after save

---

## 🧪 **Testing**

1. Login as a farmer
2. Go to Profile tab
3. Click "Edit Profile"
4. Update farm details (name, size, type, bank info)
5. Click "Save Changes"
6. See success message
7. **Refresh the page** (F5)
8. ✅ All changes should still be there!

---

## 📝 **API Endpoint**

```
PUT /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "0762387047",
  "address": "No.123, Hettiya Rd, Gampola",
  "farmName": "Herath Farm",
  "farmSize": "120 Acre",
  "farmType": "Organic Mixed",
  "bankAccount": "1234567890",
  "bankName": "Bank of Ceylon",
  "branch": "Gampola"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

**Fixed on:** December 15, 2025

