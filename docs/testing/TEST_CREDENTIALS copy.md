# 🔑 Test Credentials for Chena System

## Existing Database Users

These users are already in the database (from the schema file):

### 👨‍🌾 Farmer Accounts

**Farmer 1 - Sunil Perera**
- **Email**: sunil@gmail.com
- **Password**: password
- **User Type**: Farmer
- **Farm**: Sunil Organic Farm
- **Location**: Anuradhapura

**Farmer 2 - Nimal Fernando**
- **Email**: nimal@gmail.com
- **Password**: password
- **User Type**: Farmer
- **Farm**: Nimal Fresh Produce
- **Location**: Nuwara Eliya

### 🛒 Customer Account

**Customer - Rasini Silva**
- **Email**: rasini@gmail.com
- **Password**: password
- **User Type**: Customer
- **Location**: Colombo

### 🚚 Transport Provider Account

**Transport - Kamal Transport**
- **Email**: kamal@transport.com
- **Password**: password
- **User Type**: Transport
- **Vehicle**: Van (CAB-1234)
- **Location**: Colombo

### 👤 Admin Account

**System Administrator**
- **Email**: admin@chena.com
- **Password**: password
- **User Type**: Admin

---

## 🧪 How to Test

### Test 1: Login with Existing Account

1. Go to http://localhost:3000
2. Navigate to Login page for your user type:
   - Farmer: `/login/farmer-login`
   - Customer: `/login/customer-login`
   - Transport: `/login/transport-login`
3. Use credentials above
4. Click "Sign In"
5. You should be redirected to the dashboard

### Test 2: Create New Account (Signup)

1. Go to any login page
2. Click "Sign Up" tab
3. Fill in the form with NEW details:
   ```
   Full Name: Test User
   Email: testuser@example.com
   Phone: +94771234567
   NIC: 199512345678
   Address: 123 Test Street, Colombo
   Password: Test@123
   Confirm Password: Test@123
   ```
4. Accept terms and click "Sign Up"
5. You should see success message
6. Now login with these credentials

### Test 3: Reset Password

1. Go to any login page
2. Click "Forgot Password?" link
3. Enter:
   - Email: sunil@gmail.com
   - NIC: 197512345678
   - New Password: newpassword123
   - Confirm Password: newpassword123
4. Click "Reset Password"
5. You should see success message
6. Now login with new password

---

## 📋 Important Notes

### Password Hashing
- All passwords in the database are hashed using bcrypt
- The default password "password" is already hashed in the database
- When you create new accounts, passwords are automatically hashed

### NIC Numbers (for testing)
Use these NIC formats for testing:
- Old format: 9 digits + V (e.g., 123456789V)
- New format: 12 digits (e.g., 199012345678)

### User Types
Make sure to select the correct user type when logging in:
- `farmer` - For farmers
- `customer` - For customers
- `transport` - For transport providers

### Database Name
All data is stored in the **Chena** database as requested.

---

## 🔍 Verify in Database

You can check if signup worked by running this SQL query:

```sql
USE Chena;

-- Check all users
SELECT user_id, email, user_type, full_name, phone, nic, is_active 
FROM users 
ORDER BY created_at DESC;

-- Check farmers
SELECT f.*, u.full_name, u.email 
FROM farmers f 
JOIN users u ON f.user_id = u.user_id;

-- Check customers
SELECT c.*, u.full_name, u.email 
FROM customers c 
JOIN users u ON c.user_id = u.user_id;

-- Check transport providers
SELECT t.*, u.full_name, u.email 
FROM transport_providers t 
JOIN users u ON t.user_id = u.user_id;
```

---

## ⚠️ Troubleshooting

### "Email already registered"
- This email is already in the database
- Try a different email address

### "NIC already registered"
- This NIC is already in the database
- Try a different NIC number

### "Invalid email or password"
- Check if you're using the correct user type
- Verify email and password are correct
- Make sure account is active in database

### Backend not responding
- Make sure backend server is running on port 5000
- Check backend terminal for errors
- Verify database connection is working

### Frontend not connecting
- Make sure frontend is running on port 3000
- Check `.env.local` has correct API URL
- Open browser console to see any errors

---

## 🎯 Success Indicators

✅ **Signup Success**: Alert message "Registration successful!"
✅ **Login Success**: Redirected to dashboard page
✅ **Password Reset Success**: Alert message "Password reset successfully!"
✅ **Data in Database**: New records in `users` and user-type tables

---

## 📞 Support

If you encounter any issues:
1. Check backend terminal for error messages
2. Check browser console for frontend errors
3. Verify database connection in backend
4. Make sure all required fields are filled
5. Ensure passwords meet minimum requirements (6+ characters)

