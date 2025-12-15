# 🚀 Quick Start Guide - Checkout & PayPal Integration

## ⚡ Get Started in 5 Minutes

### **Step 1: Get PayPal Sandbox Credentials**

1. Go to https://developer.paypal.com/
2. Sign in or create a free developer account
3. Go to **Dashboard** → **Apps & Credentials**
4. Under **Sandbox**, click **Create App**
5. Copy your **Client ID** and **Secret**

### **Step 2: Configure Environment Variables**

**Backend** - Edit `backend/.env`:
```env
PAYPAL_CLIENT_ID=your-actual-sandbox-client-id-here
PAYPAL_CLIENT_SECRET=your-actual-sandbox-secret-here
PAYPAL_MODE=sandbox
```

**Frontend** - Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-actual-sandbox-client-id-here
```

### **Step 3: Start the Application**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### **Step 4: Test the Checkout**

1. **Login as Customer:**
   - Email: `rasini@gmail.com`
   - Password: `password` (default from sample data)

2. **Add Products to Cart:**
   - Go to "View Products" tab
   - Click on any product
   - Select a farmer
   - Add to cart

3. **Checkout:**
   - Go to "Cart" tab
   - Click "Proceed to Checkout"
   - Enter delivery address
   - Choose payment method

4. **Pay with PayPal:**
   - Click the PayPal button
   - Login with PayPal sandbox test account
   - Complete payment

5. **View Order:**
   - You'll be redirected to Orders tab
   - See your order with all details

---

## 🧪 PayPal Sandbox Testing

### **Option 1: Use PayPal Test Account**

1. In PayPal Developer Dashboard, go to **Sandbox** → **Accounts**
2. Find a **Personal** account (buyer account)
3. Click **View/Edit Account**
4. Use these credentials to login during checkout

### **Option 2: Use Test Credit Card**

When PayPal checkout opens, you can also use:
- **Card Number:** 4111 1111 1111 1111 (Visa)
- **Expiry:** Any future date
- **CVV:** Any 3 digits

---

## 📋 What You Can Test

### ✅ **Checkout Flow**
- Add multiple products from different farmers
- Enter delivery information
- See order summary with totals

### ✅ **PayPal Payment**
- Complete payment with PayPal sandbox
- See payment confirmation
- Order status changes to "paid"

### ✅ **Cash on Delivery**
- Select "Cash on Delivery" option
- Place order without payment
- Order status shows "pending"

### ✅ **Order Management**
- View all orders in Orders tab
- Filter by status
- See order details
- View payment status

### ✅ **Payment Splitting**
- Check database `farmer_transaction_splits` table
- See automatic payment distribution
- Platform commission calculated (5%)

---

## 🗄️ Database Verification

After placing an order, check these tables:

```sql
-- View the order
SELECT * FROM orders ORDER BY order_id DESC LIMIT 1;

-- View order items
SELECT * FROM order_items WHERE order_id = [your_order_id];

-- View transaction (if paid online)
SELECT * FROM transactions WHERE order_id = [your_order_id];

-- View payment splits
SELECT * FROM farmer_transaction_splits WHERE order_id = [your_order_id];
```

---

## 🎯 Expected Results

### **After Successful Checkout:**

1. **Order Created:**
   - New record in `orders` table
   - Status: "pending"
   - Payment status: "paid" (PayPal) or "pending" (COD)

2. **Order Items Saved:**
   - All cart items in `order_items` table
   - Linked to respective farmers

3. **Transaction Recorded** (PayPal only):
   - Transaction in `transactions` table
   - PayPal order ID stored
   - Status: "completed"

4. **Payment Split** (PayPal only):
   - Splits in `farmer_transaction_splits` table
   - Each farmer's amount calculated
   - 5% commission deducted
   - Payout status: "pending"

5. **Cart Cleared:**
   - localStorage cart is empty
   - Cart count shows 0

6. **Order Visible:**
   - Order appears in Orders tab
   - All details displayed correctly

---

## 🐛 Troubleshooting

### **PayPal Button Not Showing?**
- Check if `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set in `frontend/.env.local`
- Restart frontend server after changing .env
- Check browser console for errors

### **Payment Not Processing?**
- Verify PayPal credentials are correct
- Check if PayPal mode is "sandbox"
- Ensure backend is running

### **Order Not Created?**
- Check backend console for errors
- Verify JWT token is valid
- Check if customer is logged in

### **Database Errors?**
- Ensure database schema is up to date
- Check if all tables exist
- Verify foreign key constraints

---

## 📞 Support

If you encounter issues:

1. **Check Backend Logs:** Look for error messages in backend terminal
2. **Check Frontend Console:** Open browser DevTools → Console
3. **Verify Database:** Check if tables and data exist
4. **Review Documentation:** See `CHECKOUT_PAYPAL_IMPLEMENTATION.md`

---

## ✅ Success Checklist

- [ ] PayPal credentials configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Customer logged in
- [ ] Products added to cart
- [ ] Checkout page loads
- [ ] PayPal button appears
- [ ] Payment completes successfully
- [ ] Order appears in Orders tab
- [ ] Database records created

---

## 🎉 You're All Set!

Your checkout system with PayPal integration is ready to use. Start testing and enjoy the seamless payment experience!

For detailed documentation, see: `CHECKOUT_PAYPAL_IMPLEMENTATION.md`

