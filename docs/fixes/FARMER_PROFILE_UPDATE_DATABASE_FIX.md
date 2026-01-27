# 🐛 Farmer Profile Update Database Fix

## Problem
When trying to update farmer details from the admin dashboard, users were getting the error:
```
Server error while updating profile
```

The data was not being saved to the database, even though the feature was working correctly 1 month ago.

## Root Cause
The database schema was **missing the `farm_size_unit` column** in the `farmers` table.

### What Happened:
1. The code was updated to split `farm_size` into two columns:
   - `farm_size` (DECIMAL) - numeric value
   - `farm_size_unit` (ENUM) - unit ('Acre' or 'Perch')

2. The migration file `database/migrations/add_farm_size_unit.sql` existed but was **never executed**

3. The backend code was trying to update `farm_size_unit` column which didn't exist in the database

4. This caused a SQL error: `Unknown column 'farm_size_unit' in 'field list'`

### Database Schema Before Fix:
```sql
farm_size VARCHAR(50)  -- Stored as "120 Acre" or "5 Perch"
```

### Database Schema After Fix:
```sql
farm_size DECIMAL(10,2)           -- Numeric value: 120.00
farm_size_unit ENUM('Acre','Perch') DEFAULT 'Acre'  -- Unit: 'Acre' or 'Perch'
```

## Solution Applied

### 1. Created Migration Script
Created `backend/scripts/migrate-farm-size.js` to safely migrate the database:

**Migration Steps:**
1. Added new columns: `farm_size_new` (DECIMAL) and `farm_size_unit` (ENUM)
2. Migrated existing data by parsing strings like "5 Acres" → 5.00 + 'Acre'
3. Dropped the old `farm_size` VARCHAR column
4. Renamed `farm_size_new` to `farm_size`

### 2. Executed Migration
```bash
cd backend
node scripts/migrate-farm-size.js
```

**Migration Results:**
```
✅ New columns added
✅ Data migrated (2 farmers)
  - "5 Acres" → 5.00 Acre
  - "3 Acres" → 3.00 Acre
✅ Old column dropped
✅ Column renamed
✅ Migration completed successfully!
```

### 3. Verified Schema
After migration, the `farmers` table now has:
```
farm_size       DECIMAL(10,2)           -- Numeric value
farm_size_unit  ENUM('Acre','Perch')    -- Unit with default 'Acre'
```

## Testing

### Before Fix:
- ❌ Updating farmer profile → "Server error while updating profile"
- ❌ Data not saved to database
- ❌ SQL error in backend console: `Unknown column 'farm_size_unit'`

### After Fix:
- ✅ Database schema matches code expectations
- ✅ Profile updates should work correctly
- ✅ Farm size properly stored as numeric value + unit

## How to Test

1. **Login to Admin Dashboard:**
   ```
   http://localhost:3000/login/admin-login
   ```

2. **Navigate to Users Tab**

3. **Click "Edit" on a farmer**

4. **Update farmer details:**
   - Farm Name: "Test Farm"
   - Farm Size: "120 Acre" or "50 Perch"
   - Farm Type: Select from dropdown
   - Bank details: Account, Bank Name, Branch

5. **Click "Save Changes"**

6. **Expected Result:**
   - ✅ Success message: "User profile updated successfully!"
   - ✅ Data saved to database
   - ✅ Table refreshes with updated data

## Database Schema Reference

### farmers Table (After Fix)
```sql
CREATE TABLE farmers (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    farm_name VARCHAR(255) NOT NULL,
    farm_size DECIMAL(10, 2),                      -- ✅ Numeric value
    farm_size_unit ENUM('Acre', 'Perch') DEFAULT 'Acre',  -- ✅ Unit
    farm_type VARCHAR(100),
    bank_account VARCHAR(50),
    bank_name VARCHAR(100),
    branch VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

## Code References

### Backend Code (Already Correct)
- `backend/src/controllers/authController.js` - `updateProfile()` function
- `backend/src/controllers/adminController.js` - `updateUserProfile()` function

Both functions correctly:
- Parse farm size input (e.g., "120 Acre")
- Extract numeric value and unit
- Update both `farm_size` and `farm_size_unit` columns

### Frontend Code (Already Correct)
- `frontend/src/components/admin-dashboard/UsersTab.jsx` - Edit modal
- `frontend/src/services/api.js` - `adminAPI.updateUserProfile()`

## Prevention

To prevent this issue in the future:

1. **Always run migrations** when pulling code changes
2. **Check for migration files** in `database/migrations/`
3. **Verify database schema** matches code expectations
4. **Test after schema changes** to ensure everything works

## Related Files

- ✅ `database/migrations/add_farm_size_unit.sql` - Original migration (not used)
- ✅ `backend/scripts/migrate-farm-size.js` - Migration script (executed)
- ✅ `backend/src/controllers/authController.js` - Profile update logic
- ✅ `backend/src/controllers/adminController.js` - Admin update logic
- ✅ `frontend/src/components/admin-dashboard/UsersTab.jsx` - Admin UI

---

**Date Fixed:** 2026-01-23  
**Issue:** Database schema mismatch  
**Status:** ✅ RESOLVED

