# 🐛 Profile Update Error Fix - "Server error while updating profile"

## Problem
When trying to save farmer profile details, users were getting the error:
```
Server error while updating profile
```

## Root Causes Identified

### 1. **Missing Farmer Record**
Some users might not have a record in the `farmers` table (if signup failed or was incomplete).

### 2. **Farm Name Required Field**
The `farm_name` field in the `farmers` table is `NOT NULL`, so when creating a new farmer record, we must provide a value.

### 3. **Farm Size Parsing Issues**
The farm size parsing regex might not handle all input formats correctly.

### 4. **Case Sensitivity for ENUM**
The `farm_size_unit` field is an ENUM('Acre', 'Perch') and requires exact case matching.

---

## ✅ Solutions Implemented

### 1. **Check if Farmer Record Exists**
Before updating, the code now checks if a farmer record exists for the user:

```javascript
const [existingFarmer] = await db.query(
  "SELECT farmer_id FROM farmers WHERE user_id = ?",
  [userId]
);
```

### 2. **Create Farmer Record if Missing**
If no farmer record exists, create one with default values:

```javascript
if (existingFarmer.length === 0) {
  await db.query(
    `INSERT INTO farmers (user_id, farm_name, farm_size, farm_size_unit, farm_type, bank_account, bank_name, branch)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      farmName || "My Farm", // Default value for NOT NULL field
      farmSizeValue,
      farmSizeUnit,
      farmType || null,
      bankAccount || null,
      bankName || null,
      branch || null
    ]
  );
}
```

### 3. **Improved Farm Size Parsing**
Enhanced regex to handle multiple formats:

```javascript
const match = farmSize.match(/^([\d.]+)\s*(Acre|Perch)?$/i);

if (match) {
  farmSizeValue = parseFloat(match[1]);
  // Ensure proper case: 'Acre' or 'Perch'
  farmSizeUnit = match[2] 
    ? match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase() 
    : 'Acre';
} else {
  // Fallback: try to parse as just a number
  const numericValue = parseFloat(farmSize);
  if (!isNaN(numericValue)) {
    farmSizeValue = numericValue;
    farmSizeUnit = 'Acre'; // Default to Acre
  }
}
```

### 4. **Better Error Logging**
Added console.log statements to help debug issues:

```javascript
console.log("Update profile request:", { userId, userType, body: req.body });
console.log("Farm size parsing:", { farmSize, match });
console.log("Farmer update query:", farmerQuery, farmerValues);
```

### 5. **Null/Empty Value Handling**
Only update fields that have actual values:

```javascript
if (farmName !== undefined && farmName !== null && farmName !== '') {
  farmerUpdates.push("farm_name = ?");
  farmerValues.push(farmName);
}
```

---

## 🧪 Testing Steps

1. **Login as a farmer**
2. **Go to Profile tab**
3. **Click "Edit Profile"**
4. **Fill in the following:**
   - Farm Name: "Test Farm"
   - Farm Size: "120 Acre"
   - Farm Type: "Organic Mixed"
   - Bank Name: "Sampath Bank"
   - Branch: "Matara"
   - Account Number: "1234567890"
5. **Click "Save Changes"**
6. **Expected Result:** ✅ "Profile updated successfully!" message
7. **Refresh the page** (F5)
8. **Expected Result:** ✅ All data is still there

---

## 📝 Supported Farm Size Formats

The system now handles these formats:

| Input | Parsed As | Stored As |
|-------|-----------|-----------|
| "120 Acre" | 120, 'Acre' | farm_size=120.00, farm_size_unit='Acre' |
| "120 acre" | 120, 'Acre' | farm_size=120.00, farm_size_unit='Acre' |
| "120 Perch" | 120, 'Perch' | farm_size=120.00, farm_size_unit='Perch' |
| "120" | 120, 'Acre' | farm_size=120.00, farm_size_unit='Acre' (default) |
| "5.5 Acre" | 5.5, 'Acre' | farm_size=5.50, farm_size_unit='Acre' |

---

## 🔧 Files Modified

1. **backend/src/controllers/authController.js**
   - Added farmer record existence check
   - Added INSERT logic for missing farmer records
   - Improved farm size parsing
   - Added better error logging
   - Added null/empty value handling

---

## 🚀 Deployment

The backend server will automatically reload with nodemon when you save the file.

If you need to manually restart:
```bash
cd backend
npm run dev
```

---

## 📊 Database Schema Reference

```sql
CREATE TABLE farmers (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    farm_name VARCHAR(255) NOT NULL,              -- ⚠️ NOT NULL
    farm_size DECIMAL(10, 2),                      -- Nullable
    farm_size_unit ENUM('Acre', 'Perch') DEFAULT 'Acre',  -- ⚠️ Case sensitive
    farm_type VARCHAR(100),                        -- Nullable
    bank_account VARCHAR(50),                      -- Nullable
    bank_name VARCHAR(100),                        -- Nullable
    branch VARCHAR(100),                           -- Nullable
    ...
);
```

---

## ✅ What's Fixed

- ✅ Handles users without farmer records
- ✅ Creates farmer record if missing
- ✅ Proper farm_name default value
- ✅ Improved farm size parsing
- ✅ Correct ENUM case handling
- ✅ Better error logging
- ✅ Null/empty value handling
- ✅ All profile fields save correctly

---

**Fixed on:** December 15, 2025
**Issue:** "Server error while updating profile"
**Status:** ✅ RESOLVED

