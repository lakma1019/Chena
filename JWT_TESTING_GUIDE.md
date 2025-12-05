# 🧪 JWT Authentication Testing Guide

## 🚀 Quick Start

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```
✅ Backend should be running on http://localhost:5000

### Step 2: Start Frontend Server
```bash
cd frontend
npm run dev
```
✅ Frontend should be running on http://localhost:3000

---

## 🔍 Test Scenarios

### **Test 1: Login with JWT Tokens**

1. Go to http://localhost:3000/login/farmer-login
2. Login with test credentials:
   - Email: `sunil@gmail.com`
   - Password: `password`
3. Open Browser DevTools → Application → Local Storage
4. ✅ **Verify you see:**
   - `accessToken` - Long JWT string
   - `refreshToken` - Long JWT string
   - `userData` - User information
   - `userType` - "farmer"

5. ✅ **Verify you're redirected to:** `/farmer-dashboard`

---

### **Test 2: Dashboard Fetches User Data from Backend**

1. After logging in, you should see farmer dashboard
2. Open Browser DevTools → Console
3. ✅ **Verify:** No errors in console
4. ✅ **Verify:** Top right shows your email and first letter of name
5. Open DevTools → Network tab
6. Refresh the page
7. ✅ **Verify:** You see a request to `/api/auth/me`
8. Click on that request → Headers
9. ✅ **Verify:** Request has `Authorization: Bearer <token>` header

---

### **Test 3: Protected Route Access**

**Test with Postman or curl:**

```bash
# Get access token from localStorage first
# Then make request:

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

✅ **Expected Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "sunil@gmail.com",
    "userType": "farmer",
    "fullName": "Sunil Perera",
    ...
  }
}
```

**Without token:**
```bash
curl -X GET http://localhost:5000/api/auth/me
```

✅ **Expected Response:**
```json
{
  "success": false,
  "message": "Access token is required"
}
```

---

### **Test 4: Token Expiration (Manual Test)**

1. Login to any dashboard
2. Open DevTools → Application → Local Storage
3. Copy the `accessToken` value
4. Go to https://jwt.io
5. Paste the token in the "Encoded" section
6. ✅ **Verify payload contains:**
   ```json
   {
     "userId": 1,
     "email": "sunil@gmail.com",
     "userType": "farmer",
     "fullName": "Sunil Perera",
     "iat": 1234567890,
     "exp": 1234654290
   }
   ```
7. ✅ **Verify:** `exp` (expiration) is 24 hours from `iat` (issued at)

---

### **Test 5: Logout Functionality**

1. Login to any dashboard
2. Click "Logout" button
3. Open DevTools → Application → Local Storage
4. ✅ **Verify:** All tokens are cleared:
   - `accessToken` - GONE
   - `refreshToken` - GONE
   - `userData` - GONE
   - `userType` - GONE
5. ✅ **Verify:** Redirected to login page

---

### **Test 6: Direct Dashboard Access (Not Logged In)**

1. Make sure you're logged out
2. Try to access: http://localhost:3000/farmer-dashboard
3. ✅ **Verify:** Immediately redirected to `/login/farmer-login`
4. Try: http://localhost:3000/customer-dashboard
5. ✅ **Verify:** Redirected to `/login/customer-login`

---

### **Test 7: Wrong User Type Access**

1. Login as **Customer**
2. After login, manually change URL to: http://localhost:3000/farmer-dashboard
3. ✅ **Verify:** Redirected back to customer login (wrong user type)

---

### **Test 8: Signup with JWT**

1. Go to farmer login page
2. Click "Sign Up" tab
3. Fill in all fields:
   ```
   Full Name: Test Farmer
   Email: testfarmer@example.com
   Phone: +94771234567
   NIC: 199512345678
   Address: Test Address
   Password: Test@123
   Confirm Password: Test@123
   ```
4. Click "Sign Up"
5. ✅ **Verify:** Success message appears
6. Now login with these credentials
7. Open DevTools → Local Storage
8. ✅ **Verify:** JWT tokens are stored

---

### **Test 9: Add to Cart (Customer Authentication)**

1. Logout if logged in
2. Go to: http://localhost:3000/products
3. Try to add any product to cart
4. ✅ **Verify:** Redirected to customer login page
5. Login as customer
6. Go back to products page
7. Add product to cart
8. ✅ **Verify:** Product added successfully (no redirect)

---

### **Test 10: Refresh Token (Advanced)**

**This test requires modifying token expiration temporarily:**

1. Edit `backend/.env`:
   ```env
   JWT_EXPIRES_IN=10s  # Change to 10 seconds for testing
   ```
2. Restart backend server
3. Login to any dashboard
4. Wait 15 seconds
5. Try to navigate or make any action
6. ✅ **Verify:** Token auto-refreshes (check Network tab)
7. ✅ **Verify:** You're NOT logged out
8. **Don't forget to change back to `24h` after testing!**

---

### **Test 11: Multiple User Types**

1. Open 3 different browser windows (or incognito)
2. Window 1: Login as Farmer
3. Window 2: Login as Customer
4. Window 3: Login as Transport
5. ✅ **Verify:** Each has different dashboard
6. ✅ **Verify:** Each has different JWT token (check localStorage)
7. ✅ **Verify:** Each shows correct user email

---

### **Test 12: Backend Knows Current User**

**Create a test endpoint to verify:**

Add to `backend/src/routes/authRoutes.js`:
```javascript
router.get("/test-user", authenticateToken, (req, res) => {
  res.json({
    message: "Backend knows you!",
    currentUser: req.user
  });
});
```

**Test it:**
```bash
# Login first, get token from localStorage
curl -X GET http://localhost:5000/api/auth/test-user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

✅ **Expected Response:**
```json
{
  "message": "Backend knows you!",
  "currentUser": {
    "userId": 1,
    "email": "sunil@gmail.com",
    "userType": "farmer",
    "fullName": "Sunil Perera"
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid token" error
**Solution:** 
- Token might be expired
- Logout and login again
- Check if JWT_SECRET matches in backend

### Issue: Dashboard shows "Loading..." forever
**Solution:**
- Check backend is running
- Check browser console for errors
- Verify `/api/auth/me` endpoint is working

### Issue: Redirected to login immediately after login
**Solution:**
- Check userType in localStorage matches dashboard
- Verify token is being stored correctly
- Check browser console for errors

### Issue: Token not included in requests
**Solution:**
- Check `tokenManager.getAccessToken()` returns token
- Verify `Authorization` header in Network tab
- Make sure using `apiRequest()` function

---

## ✅ Success Checklist

After testing, verify:

- [ ] Login stores JWT tokens in localStorage
- [ ] Dashboard fetches user data from backend using token
- [ ] Protected routes require authentication
- [ ] Logout clears all tokens
- [ ] Direct dashboard access redirects to login
- [ ] Wrong user type cannot access other dashboards
- [ ] Signup creates account and returns tokens
- [ ] Add to cart requires customer login
- [ ] Backend receives and verifies JWT on every request
- [ ] Backend knows current user from token (req.user)

---

## 🎉 All Tests Passing?

**Congratulations!** Your JWT authentication system is working perfectly!

You now have:
- ✅ Secure token-based authentication
- ✅ Backend automatically knows current user
- ✅ Protected routes and dashboards
- ✅ Automatic token refresh
- ✅ Production-ready security

**Next:** Start building features that use `req.user.userId` in backend!

