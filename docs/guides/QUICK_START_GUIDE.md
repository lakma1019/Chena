# 🚀 Quick Start Guide - Chena Agricultural Platform

## Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js 18+ installed
- ✅ MySQL Server running
- ✅ Database "Chena" created and schema loaded
- ✅ Backend dependencies installed (`npm install` in backend folder)
- ✅ Frontend dependencies installed (`npm install` in frontend folder)

---

## Step 1: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MySQL Database
🚀 Backend running on port 5000
```

**Backend is now running at:** http://localhost:5000

---

## Step 2: Start Frontend Server

Open a NEW terminal and run:

```bash
cd frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
```

**Frontend is now running at:** http://localhost:3000

---

## Step 3: Test the System

### Option A: Login with Existing Account

1. Open browser: http://localhost:3000
2. Click on "Login" in navigation
3. Choose user type (Farmer/Customer/Transport)
4. Use test credentials:
   - **Farmer**: sunil@gmail.com / password
   - **Customer**: rasini@gmail.com / password
   - **Transport**: kamal@transport.com / password
5. Click "Sign In"
6. ✅ You should be redirected to dashboard!

### Option B: Create New Account

1. Go to any login page
2. Click "Sign Up" tab
3. Fill in all required fields
4. Click "Sign Up"
5. ✅ Account created in database!
6. Now login with your new credentials

### Option C: Reset Password

1. Go to any login page
2. Click "Forgot Password?"
3. Enter email and NIC
4. Enter new password
5. Click "Reset Password"
6. ✅ Password updated in database!
7. Login with new password

---

## 🎯 What's Working Now

### ✅ Backend Features
- User registration (signup) for all user types
- User authentication (login) with database validation
- Password reset functionality
- Password hashing with bcrypt
- CORS enabled for frontend communication
- RESTful API endpoints

### ✅ Frontend Features
- Farmer login & signup pages
- Customer login & signup pages
- Transport provider login & signup pages
- Password reset pages for all user types
- API integration with backend
- Form validation
- Error handling
- Success/error messages

### ✅ Database Integration
- All user data saved to "Chena" database
- Users table for authentication
- Farmers table for farmer profiles
- Customers table for customer profiles
- Transport_providers table for transport profiles
- Automatic user type table population

---

## 📁 Project Structure

```
Chena/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # Database connection
│   │   ├── controllers/
│   │   │   └── authController.js        # Auth logic
│   │   ├── routes/
│   │   │   └── authRoutes.js            # Auth endpoints
│   │   └── server.js                    # Main server file
│   ├── .env                             # Database credentials
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   │   ├── farmer-login/
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── reset-password/page.jsx
│   │   │   │   ├── customer-login/
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── reset-password/page.jsx
│   │   │   │   └── transport-login/
│   │   │   │       ├── page.jsx
│   │   │   │       └── reset-password/page.jsx
│   │   ├── components/
│   │   │   ├── SignIn.jsx               # Login/Signup component
│   │   │   └── ResetPassword.jsx        # Password reset component
│   │   └── services/
│   │       └── api.js                   # API service layer
│   ├── .env.local                       # API URL config
│   └── package.json
│
└── database/
    └── chena_schema.sql                 # Database schema
```

---

## 🔧 Configuration Files

### Backend `.env`
```
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=Chena
PORT=5000
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Solution**: 
- Check if MySQL is running
- Verify database "Chena" exists
- Check .env file has correct credentials

### Issue: Frontend can't connect to backend
**Solution**:
- Make sure backend is running on port 5000
- Check .env.local has correct API URL
- Verify CORS is enabled in backend

### Issue: "Email already registered"
**Solution**:
- Use a different email address
- Or login with existing credentials

### Issue: Login fails with correct credentials
**Solution**:
- Make sure you selected correct user type
- Check if account exists in database
- Verify password is correct

---

## 📊 API Endpoints

All endpoints are prefixed with `/api/auth`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/reset-password` | Reset password |

---

## 🎉 You're All Set!

Your Chena Agricultural Platform is now fully connected:
- ✅ Frontend communicates with Backend
- ✅ Backend connects to Database
- ✅ Authentication system is working
- ✅ All user types supported
- ✅ Password reset functionality available

Start building more features on top of this foundation! 🚀

