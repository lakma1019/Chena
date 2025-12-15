# 🎉 Stripe Payment Gateway Setup Guide

## ✅ Why Stripe is Better for You

- ✅ **Easier to sign up** - No account creation issues
- ✅ **Works immediately** - Test mode available instantly
- ✅ **Better testing** - Simple test card numbers
- ✅ **More popular** - Used by millions of businesses
- ✅ **Better documentation** - Easier to understand
- ✅ **Supports Sri Lankan Rupees (LKR)** - No currency conversion needed!

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Create Stripe Account** (2 minutes)

1. **Go to:** https://dashboard.stripe.com/register
2. **Fill in:**
   - Email address
   - Full name
   - Country: **Sri Lanka** (or your country)
   - Password
3. **Click "Create account"**
4. **Verify your email** (check inbox)

**That's it!** You now have a Stripe account with test mode enabled!

---

### **Step 2: Get Your API Keys** (1 minute)

1. **After login, you'll see the Dashboard**
2. **Click "Developers"** (top right menu)
3. **Click "API keys"** (left sidebar)
4. **You'll see two keys:**
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

**Copy both keys!**

---

### **Step 3: Configure Frontend** (1 minute)

1. **Open:** `frontend/.env.local`

2. **Find this line:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

3. **Replace with your Publishable Key:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51abc123xyz...
   ```

4. **Save the file**

---

### **Step 4: Configure Backend** (1 minute)

1. **Open:** `backend/.env`

2. **Find these lines:**
   ```env
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

3. **Replace with your keys:**
   ```env
   STRIPE_SECRET_KEY=sk_test_51abc123xyz...
   STRIPE_PUBLISHABLE_KEY=pk_test_51abc123xyz...
   ```

4. **Save the file**

---

### **Step 5: Restart Servers** (IMPORTANT!)

**Backend:**
```bash
# Stop: Ctrl+C
# Start:
cd backend
npm start
```

**Frontend:**
```bash
# Stop: Ctrl+C
# Start:
cd frontend
npm run dev
```

---

## 🧪 Test Your Integration

### **Step 1: Go to Checkout**

1. Open http://localhost:3000
2. Login as customer
3. Add products to cart
4. Click "Proceed to Checkout"
5. Fill in delivery information

### **Step 2: You Should See:**

```
┌─────────────────────────────────────┐
│  Payment Method                     │
├─────────────────────────────────────┤
│  ● 💳 Credit/Debit Card             │
│    Pay securely with Stripe         │
│                                     │
│  ○ 💵 Cash on Delivery              │
│    Pay when you receive your order  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Card Details                       │
├─────────────────────────────────────┤
│  Card number: [              ]      │
│  MM / YY     CVC                    │
│  [    ]      [   ]                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Pay Rs. 1190.00                    │
└─────────────────────────────────────┘

🔒 Secure payment powered by Stripe
Test card: 4242 4242 4242 4242
```

### **Step 3: Test Payment**

**Use these test card details:**

| Field | Value |
|-------|-------|
| **Card Number** | `4242 4242 4242 4242` |
| **Expiry Date** | Any future date (e.g., `12/25`) |
| **CVC** | Any 3 digits (e.g., `123`) |
| **ZIP Code** | Any 5 digits (e.g., `12345`) |

**Click "Pay Rs. XXX"**

### **Step 4: Success!**

You should see:
- ✅ "Order placed successfully!"
- ✅ Order number displayed
- ✅ Redirected to Orders page
- ✅ Order visible in Orders tab

---

## 🎯 Test Card Numbers

Stripe provides many test cards for different scenarios:

### **Successful Payments:**

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Visa - Always succeeds |
| `5555 5555 5555 4444` | Mastercard - Always succeeds |
| `3782 822463 10005` | American Express - Always succeeds |

### **Failed Payments (for testing errors):**

| Card Number | Description |
|-------------|-------------|
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |

**For all cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 💰 Currency Support

Your app now uses **Sri Lankan Rupees (LKR)** directly!

- No conversion needed
- Customers see prices in Rs.
- Stripe processes in LKR
- No currency confusion

---

## 🔍 Verify Payment in Stripe Dashboard

After making a test payment:

1. **Go to:** https://dashboard.stripe.com/test/payments
2. **You'll see your test payment**
3. **Click on it to see details:**
   - Amount: Rs. 1,190.00 (or your order total)
   - Status: Succeeded
   - Description: Order ORD123... - Chena Agricultural Platform
   - Customer details
   - Order metadata

---

## 📊 What Happens Behind the Scenes

### **Payment Flow:**

1. **Customer enters card details** → Stripe validates
2. **Click "Pay"** → Stripe creates Payment Method
3. **Frontend sends to backend** → Payment Method ID
4. **Backend creates Payment Intent** → Charges the card
5. **Stripe processes payment** → Returns success/failure
6. **Backend creates order** → Saves to database
7. **Payment splits calculated** → Farmers get their share
8. **Customer sees success** → Order confirmed

### **Database Records Created:**

1. **orders** table → Order details
2. **order_items** table → Products ordered
3. **transactions** table → Payment record with Stripe ID
4. **farmer_transaction_splits** table → Payment distribution

---

## 🎨 What You'll See

### **Checkout Page:**

- ✅ Clean card input form
- ✅ Real-time validation
- ✅ Secure Stripe elements
- ✅ Professional design
- ✅ Error messages
- ✅ Loading states

### **Payment Form Features:**

- 🔒 **Secure** - Card details never touch your server
- ✅ **Validated** - Real-time card validation
- 💳 **Smart** - Detects card type automatically
- 🎨 **Styled** - Matches your design
- 📱 **Responsive** - Works on mobile

---

## 🐛 Troubleshooting

### **Problem: Card form doesn't appear**

**Solution:**
1. Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `frontend/.env.local`
2. Make sure it starts with `pk_test_`
3. Restart frontend server
4. Clear browser cache (Ctrl+Shift+Delete)

### **Problem: "Payment failed" error**

**Solution:**
1. Check `STRIPE_SECRET_KEY` in `backend/.env`
2. Make sure it starts with `sk_test_`
3. Restart backend server
4. Check backend console for errors

### **Problem: "Invalid API key"**

**Solution:**
1. Make sure you copied the FULL key (very long string)
2. No extra spaces before/after the key
3. Using TEST keys (not live keys)

---

## ✅ Verification Checklist

- [ ] Created Stripe account
- [ ] Got Publishable Key (pk_test_...)
- [ ] Got Secret Key (sk_test_...)
- [ ] Updated `frontend/.env.local`
- [ ] Updated `backend/.env`
- [ ] Restarted backend server
- [ ] Restarted frontend server
- [ ] Card form appears on checkout
- [ ] Can enter card details
- [ ] Test payment succeeds
- [ ] Order created successfully
- [ ] Payment visible in Stripe Dashboard

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ **Card form appears** - Clean, professional input fields
2. ✅ **Card validation works** - Shows card type icon
3. ✅ **Payment processes** - Loading state shows
4. ✅ **Order created** - Success message appears
5. ✅ **Stripe Dashboard** - Payment visible
6. ✅ **Database** - Order and transaction saved

---

## 🚀 Next Steps

### **For Testing:**
- Try different test cards
- Test error scenarios
- Check Stripe Dashboard
- Verify database records

### **For Production (Later):**
1. Complete Stripe account verification
2. Get Live API keys
3. Replace test keys with live keys
4. Test with real (small) amounts
5. Go live!

---

## 📞 Support

### **Stripe Resources:**
- **Dashboard:** https://dashboard.stripe.com/
- **Documentation:** https://stripe.com/docs
- **Test Cards:** https://stripe.com/docs/testing
- **Support:** https://support.stripe.com/

### **Your Implementation:**
- Check browser console (F12) for errors
- Check backend terminal for errors
- Verify all environment variables
- Make sure servers are restarted

---

## 💡 Advantages Over PayPal

| Feature | Stripe | PayPal |
|---------|--------|--------|
| **Sign Up** | ✅ Easy | ❌ Can fail |
| **Test Mode** | ✅ Instant | ⚠️ Requires sandbox |
| **Test Cards** | ✅ Simple | ⚠️ Complex |
| **Currency** | ✅ LKR supported | ⚠️ USD conversion |
| **Setup Time** | ✅ 5 minutes | ⚠️ 15+ minutes |
| **Documentation** | ✅ Excellent | ⚠️ Complex |

---

**Estimated Setup Time:** 5 minutes
**Difficulty:** Very Easy
**Cost:** FREE (Test mode)

**You're all set! Start testing your Stripe integration now!** 🎉

