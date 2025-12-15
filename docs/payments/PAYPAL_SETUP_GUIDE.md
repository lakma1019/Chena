# 🔧 PayPal Payment Gateway Setup Guide

## ⚠️ Current Issue

Your checkout page has PayPal integration code, but it's not connecting to PayPal because the credentials are not configured. You need to:

1. Get PayPal Sandbox credentials (free)
2. Configure them in your environment files
3. Restart your servers

---

## 📋 Step-by-Step Setup

### **Step 1: Create PayPal Developer Account** (5 minutes)

1. **Go to PayPal Developer Portal:**
   - Visit: https://developer.paypal.com/
   - Click **"Log in to Dashboard"** (top right)

2. **Sign Up or Login:**
   - If you have a PayPal account, use it to login
   - If not, create a new account (it's FREE)

3. **Access Dashboard:**
   - After login, you'll be in the Developer Dashboard

---

### **Step 2: Create a Sandbox App** (3 minutes)

1. **Navigate to Apps & Credentials:**
   - In the dashboard, click **"Apps & Credentials"** tab
   - Make sure you're on the **"Sandbox"** tab (not Live)

2. **Create App:**
   - Click **"Create App"** button
   - Enter App Name: `Chena Agricultural Platform`
   - Click **"Create App"**

3. **Get Your Credentials:**
   - You'll see your app details page
   - Copy the **"Client ID"** (starts with `A...`)
   - Click **"Show"** next to Secret and copy the **"Secret"**

**Example:**
```
Client ID: AZabc123xyz789...
Secret: EFgh456uvw012...
```

---

### **Step 3: Configure Frontend** (1 minute)

1. **Open:** `frontend/.env.local`

2. **Replace this line:**
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
   ```

3. **With your actual Client ID:**
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=AZabc123xyz789...
   ```
   *(Use your actual Client ID from Step 2)*

4. **Save the file**

---

### **Step 4: Configure Backend** (1 minute)

1. **Open:** `backend/.env`

2. **Replace these lines:**
   ```env
   PAYPAL_CLIENT_ID=your-sandbox-client-id
   PAYPAL_CLIENT_SECRET=your-sandbox-client-secret
   PAYPAL_MODE=sandbox
   ```

3. **With your actual credentials:**
   ```env
   PAYPAL_CLIENT_ID=AZabc123xyz789...
   PAYPAL_CLIENT_SECRET=EFgh456uvw012...
   PAYPAL_MODE=sandbox
   ```
   *(Use your actual credentials from Step 2)*

4. **Save the file**

---

### **Step 5: Restart Your Servers** (IMPORTANT!)

Environment variables are only loaded when servers start, so you MUST restart:

**Terminal 1 - Stop and Restart Backend:**
```bash
# Press Ctrl+C to stop the backend
# Then restart:
cd backend
npm start
```

**Terminal 2 - Stop and Restart Frontend:**
```bash
# Press Ctrl+C to stop the frontend
# Then restart:
cd frontend
npm run dev
```

---

### **Step 6: Test PayPal Payment** (2 minutes)

1. **Login as Customer:**
   - Go to http://localhost:3000
   - Login with customer credentials

2. **Add Products to Cart:**
   - Browse products
   - Add items to cart

3. **Go to Checkout:**
   - Click "Proceed to Checkout"
   - Fill in delivery address
   - Select "Online Payment (PayPal)"

4. **You Should Now See:**
   - **Real PayPal buttons** (blue/gold PayPal buttons)
   - NOT just a UI button

5. **Click PayPal Button:**
   - A PayPal popup/redirect will open
   - This is the REAL PayPal payment gateway

---

### **Step 7: Complete Test Payment**

1. **Get Sandbox Test Account:**
   - Go back to PayPal Developer Dashboard
   - Click **"Sandbox"** → **"Accounts"**
   - You'll see test accounts (Personal and Business)
   - Click on a **"Personal"** account
   - Click **"View/Edit Account"**
   - Copy the **Email** and **Password**

2. **Use Test Account to Pay:**
   - In the PayPal popup, login with the test account
   - Complete the payment
   - You'll be redirected back to your site

3. **Order Created:**
   - Order will be created in your database
   - You'll see success message
   - Redirected to Orders page

---

## 🎯 What You'll See After Setup

### **Before Configuration:**
- ❌ Only UI buttons that don't work
- ❌ No PayPal popup
- ❌ Payment doesn't process

### **After Configuration:**
- ✅ Real PayPal buttons appear
- ✅ PayPal popup/redirect opens
- ✅ Can login with test account
- ✅ Payment processes successfully
- ✅ Order created in database

---

## 🧪 PayPal Sandbox Test Accounts

PayPal automatically creates test accounts for you:

### **Personal Account (Buyer):**
- Use this to make test payments
- Has fake money in it
- Email: `sb-xxxxx@personal.example.com`
- Password: (shown in dashboard)

### **Business Account (Seller):**
- Your app is linked to this
- Receives test payments
- Email: `sb-yyyyy@business.example.com`

---

## 💡 Important Notes

1. **Sandbox vs Live:**
   - Sandbox = Testing (fake money)
   - Live = Real payments (real money)
   - Always test in Sandbox first!

2. **Currency Conversion:**
   - Your app uses Rs. (Rupees)
   - PayPal uses USD
   - Current conversion: Rs. / 100 = USD (approximate)
   - You can adjust this in the code later

3. **No Real Money:**
   - Sandbox uses fake money
   - You can't lose real money testing
   - Safe to test as much as you want

4. **Restart Required:**
   - ALWAYS restart servers after changing .env files
   - Environment variables don't update automatically

---

## 🐛 Troubleshooting

### **Problem: PayPal buttons don't appear**

**Solution:**
1. Check if `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set correctly
2. Make sure you restarted the frontend server
3. Check browser console for errors (F12 → Console)
4. Verify Client ID starts with "A" and is very long

### **Problem: "Invalid client ID" error**

**Solution:**
1. Double-check you copied the entire Client ID
2. Make sure there are no extra spaces
3. Verify you're using the Sandbox Client ID (not Live)

### **Problem: Payment popup doesn't open**

**Solution:**
1. Check if popup blocker is enabled
2. Try a different browser
3. Check browser console for errors

### **Problem: "Order creation failed"**

**Solution:**
1. Check backend is running
2. Verify backend .env has PayPal credentials
3. Check backend console for errors

---

## ✅ Verification Checklist

- [ ] Created PayPal Developer account
- [ ] Created Sandbox app
- [ ] Copied Client ID
- [ ] Copied Secret
- [ ] Updated `frontend/.env.local`
- [ ] Updated `backend/.env`
- [ ] Restarted backend server
- [ ] Restarted frontend server
- [ ] PayPal buttons appear on checkout page
- [ ] Can click PayPal button
- [ ] PayPal popup opens
- [ ] Can complete test payment

---

## 🎉 Success!

Once you complete these steps, you'll have a fully functional PayPal payment gateway integrated with your Chena platform!

**Need Help?**
- Check the browser console (F12)
- Check backend terminal for errors
- Verify all credentials are correct
- Make sure servers are restarted

