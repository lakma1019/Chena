# Fix Admin Login Issue

## Problem

The admin password hash in the database uses PHP's bcrypt format (`$2y$`), but Node.js bcrypt expects `$2a$` or `$2b$` format.

## Solution

Run the admin creation script to update/create the admin user with the correct password hash.

## Steps to Fix

### Option 1: Run the Script (Recommended)

1. **Open a terminal in the backend folder:**

   ```bash
   cd backend
   ```

2. **Run the admin creation script:**

   ```bash
   node scripts/create-admin.js
   ```

3. **You should see:**

   ```
   ✅ Admin user already exists!
   📧 Email: admin@gmail.com
   👤 Name: System Administrator
   🔒 Updating password...
   ✅ Password updated successfully!

   🔐 Admin Credentials:
      Email: admin@gmail.com
      Password: admin@123
      User Type: admin
   ```

4. **Now try logging in again** at `http://localhost:3000/login/admin-login`

---

### Option 2: Manual Database Update

If the script doesn't work, you can manually update the password in your MySQL database:

1. **Open MySQL Workbench or your MySQL client**

2. **Run this query to generate a new password hash:**

   ```javascript
   // In Node.js console or create a temp file:
   import bcrypt from "bcrypt";
   const hash = await bcrypt.hash("password", 10);
   console.log(hash);
   ```

3. **Or use this pre-generated hash:**

   ```
   $2b$10$K7L1OJ45/4Y2nX6K0LrQiOeWrAcb5rHgsV5.3/iLEJxjckcMf.1S2
   ```

4. **Update the admin user in MySQL:**

   ```sql
   UPDATE users
   SET password_hash = '$2b$10$K7L1OJ45/4Y2nX6K0LrQiOeWrAcb5rHgsV5.3/iLEJxjckcMf.1S2'
   WHERE email = 'admin@chena.com' AND user_type = 'admin';
   ```

5. **Verify the update:**
   ```sql
   SELECT email, user_type, password_hash FROM users WHERE email = 'admin@chena.com';
   ```

---

### Option 3: Create New Admin User

If the admin user doesn't exist at all:

1. **Run this SQL in your MySQL database:**
   ```sql
   INSERT INTO users (
       email,
       password_hash,
       user_type,
       full_name,
       phone,
       nic,
       address,
       is_verified,
       is_active
   ) VALUES (
       'admin@chena.com',
       '$2b$10$K7L1OJ45/4Y2nX6K0LrQiOeWrAcb5rHgsV5.3/iLEJxjckcMf.1S2',
       'admin',
       'System Administrator',
       '+94 11 234 5678',
       '197012345678',
       'Chena Head Office, Colombo 07',
       TRUE,
       TRUE
   );
   ```

---

## After Fixing

**Admin Login Credentials:**

- **Email:** `admin@gmail.com`
- **Password:** `admin@123`
- **Login URL:** `http://localhost:3000/login/admin-login`

---

## Troubleshooting

### If login still fails:

1. **Check if backend is running:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Check backend console for errors**

3. **Verify database connection** in `backend/.env`:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=Chena
   ```

4. **Test the API directly** using Postman or curl:

   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@gmail.com",
       "password": "admin@123",
       "userType": "admin"
     }'
   ```

5. **Check browser console** for any JavaScript errors

---

## Success!

Once fixed, you should be able to:

1. Login at `/login/admin-login`
2. Access the admin dashboard at `/admin-dashboard`
3. Manage users, products, and orders

---

**Note:** The password `password` is for development/testing only. Change it to a strong password in production!
