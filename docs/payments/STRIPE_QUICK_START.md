# ⚡ Stripe Quick Start - 5 Minutes

## 🎯 What You Need to Do

1. ✅ Create Stripe account (2 min)
2. ✅ Copy 2 API keys (1 min)
3. ✅ Paste into .env files (1 min)
4. ✅ Restart servers (1 min)
5. ✅ Test payment (30 sec)

**Total: 5 minutes** ⏱️

---

## 📝 Step-by-Step

### 1️⃣ Create Account

**Go to:** https://dashboard.stripe.com/register

**Fill in:**
- Email: your-email@example.com
- Name: Your Name
- Country: Sri Lanka
- Password: (create one)

**Click:** "Create account"

**Verify email** → Check inbox → Click link

✅ **Done!** You now have a Stripe account!

---

### 2️⃣ Get API Keys

**After login:**

1. Click **"Developers"** (top right)
2. Click **"API keys"** (left sidebar)
3. You'll see:

```
Publishable key
pk_test_51abc123xyz...                [Copy]

Secret key
sk_test_••••••••••••••••              [Reveal test key]
```

4. **Copy the Publishable key**
5. **Click "Reveal test key"** → **Copy the Secret key**

✅ **Done!** You have both keys!

---

### 3️⃣ Configure Files

**File 1:** `frontend/.env.local`

Find:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

Replace with:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51abc123xyz...
```
*(Paste your actual Publishable key)*

**Save!**

---

**File 2:** `backend/.env`

Find:
```env
STRIPE_SECRET_KEY=your-stripe-secret-key
```

Replace with:
```env
STRIPE_SECRET_KEY=sk_test_51abc123xyz...
```
*(Paste your actual Secret key)*

**Save!**

---

### 4️⃣ Restart Servers

**Backend Terminal:**
```
Ctrl+C (stop)
npm start (restart)
```

**Frontend Terminal:**
```
Ctrl+C (stop)
npm run dev (restart)
```

✅ **Done!** Servers restarted!

---

### 5️⃣ Test Payment

1. **Go to:** http://localhost:3000
2. **Login** as customer
3. **Add products** to cart
4. **Click** "Proceed to Checkout"
5. **Fill** delivery info
6. **Select** "Credit/Debit Card"
7. **Enter test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
8. **Click** "Pay Rs. XXX"

✅ **Success!** Order created!

---

## 🎉 What You'll See

### Before Configuration:
```
❌ No card form appears
❌ Payment doesn't work
```

### After Configuration:
```
✅ Card input form appears
✅ Can enter card details
✅ Payment processes successfully
✅ Order created
✅ Redirected to Orders page
```

---

## 🧪 Test Cards

**Always works:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25 (any future date)
CVC: 123 (any 3 digits)
```

**Always fails (for testing errors):**
```
Card: 4000 0000 0000 0002
Expiry: 12/25
CVC: 123
```

---

## 🔍 Verify in Stripe

**After test payment:**

1. Go to: https://dashboard.stripe.com/test/payments
2. You'll see your payment!
3. Click it to see details

---

## ✅ Checklist

- [ ] Created Stripe account
- [ ] Copied Publishable key
- [ ] Copied Secret key
- [ ] Updated frontend/.env.local
- [ ] Updated backend/.env
- [ ] Restarted backend
- [ ] Restarted frontend
- [ ] Card form appears
- [ ] Test payment works
- [ ] Order created

---

## 🐛 Quick Fixes

**Card form doesn't appear?**
→ Check frontend/.env.local has correct key
→ Restart frontend

**Payment fails?**
→ Check backend/.env has correct key
→ Restart backend

**"Invalid API key"?**
→ Make sure you copied the FULL key
→ No extra spaces

---

## 📞 Need Help?

1. Check browser console (F12)
2. Check backend terminal
3. Verify keys are correct
4. Make sure servers restarted

---

## 🎯 Summary

**What you did:**
1. ✅ Installed Stripe packages
2. ✅ Created Stripe configuration
3. ✅ Updated checkout page
4. ✅ Updated order controller
5. ✅ Configured environment variables

**What you can do now:**
- ✅ Accept credit/debit card payments
- ✅ Process payments in Sri Lankan Rupees
- ✅ Automatic payment splitting to farmers
- ✅ Secure payment processing
- ✅ Test with Stripe test cards

**Time taken:** 5 minutes
**Difficulty:** Easy
**Cost:** FREE

---

## 🚀 You're Ready!

Your Stripe payment gateway is now fully integrated and ready to use!

**Start testing now!** 🎉

For detailed information, see: `STRIPE_SETUP_GUIDE.md`

