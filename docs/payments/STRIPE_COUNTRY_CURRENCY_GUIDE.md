# 🌍 Stripe Country & Currency Setup Guide

## ❓ Problem: Sri Lanka Not Listed

Stripe doesn't support Sri Lanka directly yet. But **you can still process Sri Lankan Rupees!**

---

## ✅ Solution: Choose the Right Country

### **Option 1: Singapore** ⭐ RECOMMENDED

**Why Singapore?**
- ✅ **Supports LKR (Sri Lankan Rupees)** - You can charge in LKR!
- ✅ Easy setup
- ✅ No verification needed for test mode
- ✅ Commonly used by South Asian businesses
- ✅ Works perfectly for your use case

**How to set up:**
1. On Stripe registration, select **"Singapore"**
2. Fill in your details (use real email)
3. Complete registration
4. In `backend/.env`, keep: `STRIPE_CURRENCY=lkr`
5. **Done!** You can process LKR payments

**Configuration:**
```env
# backend/.env
STRIPE_CURRENCY=lkr
```

**Result:**
- Customers see: Rs. 1,190.00
- Stripe charges: LKR 1,190.00
- No conversion needed! ✅

---

### **Option 2: India**

**Why India?**
- ✅ Also supports LKR
- ✅ Closer region
- ✅ Works well

**How to set up:**
1. Select **"India"**
2. Complete registration
3. In `backend/.env`, keep: `STRIPE_CURRENCY=lkr`

**Configuration:**
```env
# backend/.env
STRIPE_CURRENCY=lkr
```

---

### **Option 3: United States** (For Testing Only)

**Why US?**
- ✅ Works immediately
- ✅ Best for quick testing
- ⚠️ Doesn't support LKR directly
- ⚠️ Need to convert to USD

**How to set up:**
1. Select **"United States"**
2. Complete registration
3. In `backend/.env`, change to: `STRIPE_CURRENCY=usd`

**Configuration:**
```env
# backend/.env
STRIPE_CURRENCY=usd
```

**What happens:**
- Customers still see: Rs. 1,190.00 (in your UI)
- Stripe charges: $3.97 USD (converted at ~300 LKR/USD)
- Automatic conversion in backend ✅

---

## 🎯 Recommended Setup

### **For Your Project: Use Singapore**

1. **Go to:** https://dashboard.stripe.com/register
2. **Select Country:** Singapore
3. **Fill in:**
   - Email: your-email@example.com
   - Full name: Your Name
   - Password: (create one)
4. **Click:** "Create account"
5. **Verify email**

**Then configure:**

```env
# backend/.env
STRIPE_SECRET_KEY=sk_test_51abc123xyz...
STRIPE_PUBLISHABLE_KEY=pk_test_51abc123xyz...
STRIPE_CURRENCY=lkr
```

**That's it!** You can now process payments in Sri Lankan Rupees! 🎉

---

## 💰 How Currency Works

### **With Singapore/India (LKR):**

**Customer sees:**
```
Total: Rs. 1,190.00
```

**Stripe processes:**
```
Amount: LKR 1,190.00
Currency: LKR
```

**Database stores:**
```
total_amount: 1190.00
currency: LKR
```

**✅ Perfect! No conversion needed!**

---

### **With United States (USD):**

**Customer sees:**
```
Total: Rs. 1,190.00
```

**Stripe processes:**
```
Amount: $3.97 USD
Currency: USD
(Converted: 1190 LKR ÷ 300 = 3.97 USD)
```

**Database stores:**
```
total_amount: 1190.00 (original LKR)
metadata: { original_amount_lkr: "1190.00" }
```

**✅ Works, but with conversion**

---

## 🔧 Configuration Files

### **backend/.env**

```env
# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Currency Options:
# - Use 'lkr' if you selected Singapore or India
# - Use 'usd' if you selected United States
STRIPE_CURRENCY=lkr
```

### **No frontend changes needed!**

The frontend always shows Rs. (Rupees) to customers. The currency conversion happens automatically in the backend.

---

## 📊 Comparison Table

| Country | Supports LKR? | Setup Difficulty | Recommended? |
|---------|---------------|------------------|--------------|
| **Singapore** | ✅ Yes | Easy | ⭐ **YES** |
| **India** | ✅ Yes | Easy | ✅ Yes |
| **United States** | ❌ No (USD only) | Easy | ⚠️ Testing only |
| **Sri Lanka** | ❌ Not available | N/A | ❌ No |

---

## 🧪 Testing

### **With LKR (Singapore/India):**

**Test card:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

**Result:**
```
✅ Payment successful
✅ Amount: LKR 1,190.00
✅ Order created
```

---

### **With USD (United States):**

**Test card:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

**Result:**
```
✅ Payment successful
✅ Amount: $3.97 USD (converted from Rs. 1,190)
✅ Order created
```

---

## ❓ FAQ

### **Q: Can I change country later?**
**A:** For test mode, you can create a new account with a different country. For production, you'll need to verify your business location.

### **Q: Will customers see USD or LKR?**
**A:** Customers always see **Rs. (Rupees)** in your UI. The currency used by Stripe is separate.

### **Q: Is the conversion rate accurate?**
**A:** For testing with USD, we use ~300 LKR/USD. For production, use real-time rates or stick with LKR.

### **Q: Which is best for production?**
**A:** **Singapore with LKR** - No conversion, direct LKR processing.

### **Q: Can I test both?**
**A:** Yes! Create two Stripe accounts (different emails) and test both.

---

## ✅ Step-by-Step: Singapore Setup

1. **Go to:** https://dashboard.stripe.com/register

2. **Select:**
   ```
   Country: Singapore
   ```

3. **Fill in:**
   ```
   Email: your-email@example.com
   Full name: Your Name
   Password: ••••••••
   ```

4. **Click:** "Create account"

5. **Verify email** (check inbox)

6. **Get API keys:**
   - Click "Developers" → "API keys"
   - Copy Publishable key
   - Copy Secret key

7. **Configure backend/.env:**
   ```env
   STRIPE_SECRET_KEY=sk_test_51abc123xyz...
   STRIPE_PUBLISHABLE_KEY=pk_test_51abc123xyz...
   STRIPE_CURRENCY=lkr
   ```

8. **Configure frontend/.env.local:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51abc123xyz...
   ```

9. **Restart servers**

10. **Test with:**
    ```
    Card: 4242 4242 4242 4242
    Expiry: 12/25
    CVC: 123
    ```

11. **Success!** 🎉

---

## 🎯 Summary

**Best Choice:** **Singapore + LKR**

**Why?**
- ✅ Direct LKR support
- ✅ No currency conversion
- ✅ Easy setup
- ✅ Perfect for your use case

**Configuration:**
```env
STRIPE_CURRENCY=lkr
```

**Result:**
- Customers pay in Rs.
- Stripe processes in LKR
- No conversion needed
- Everything works perfectly!

---

## 🚀 Next Steps

1. ✅ Select **Singapore** on Stripe registration
2. ✅ Complete account creation
3. ✅ Get API keys
4. ✅ Set `STRIPE_CURRENCY=lkr` in backend/.env
5. ✅ Test payment
6. ✅ Celebrate! 🎉

---

**You're all set! Choose Singapore and you can process Sri Lankan Rupees directly!** 💰

