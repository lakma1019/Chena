# 🚀 Payment Gateway - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 2: Login as Customer
1. Go to `http://localhost:3000`
2. Click "Login" → "Customer Login"
3. Use your customer credentials

### Step 3: Add Products to Cart
1. Go to Customer Dashboard
2. Click "View Products" tab
3. Click "Add to Cart" on any products
4. View cart (should show items)

### Step 4: Checkout
1. Click "Proceed to Checkout" button
2. You'll be redirected to `/checkout` page

### Step 5: Fill Delivery Info
```
Delivery Address: 123 Main Street, Colombo
City: Colombo
Postal Code: 10100
```

### Step 6: Choose Payment Method

#### Option A: Card Payment (Recommended for Testing)
1. Select "💳 Credit/Debit Card"
2. Enter test card:
   ```
   Card Number:  4532 1488 0343 6467
   Name:         JOHN DOE
   Expiry:       12/25
   CVV:          123
   ```
3. Click "Pay Rs. {amount}"
4. Wait 2 seconds
5. ✅ Order created!

#### Option B: Stripe Payment
1. Select "🔷 Stripe Payment"
2. Enter in Stripe form:
   ```
   Card:   4242 4242 4242 4242
   Expiry: 12/25
   CVV:    123
   ```
3. Click "Pay Rs. {amount}"
4. ✅ Order created!

#### Option C: Cash on Delivery
1. Select "💵 Cash on Delivery"
2. Click "Place Order (Cash on Delivery)"
3. ✅ Order created!

### Step 7: View Order
1. Automatically redirected to Orders tab
2. See your new order
3. Download invoice if needed

---

## 🎯 Quick Test Scenarios

### Scenario 1: Successful Card Payment
```
1. Add products to cart
2. Go to checkout
3. Fill delivery info
4. Select Card Payment
5. Use: 4532 1488 0343 6467 | JOHN DOE | 12/25 | 123
6. Click Pay
7. ✅ Success!
```

### Scenario 2: Successful Stripe Payment
```
1. Add products to cart
2. Go to checkout
3. Fill delivery info
4. Select Stripe Payment
5. Use: 4242 4242 4242 4242 | 12/25 | 123
6. Click Pay
7. ✅ Success!
```

### Scenario 3: Cash on Delivery
```
1. Add products to cart
2. Go to checkout
3. Fill delivery info
4. Select Cash on Delivery
5. Click Place Order
6. ✅ Success!
```

### Scenario 4: Invalid Card
```
1. Select Card Payment
2. Enter: 1234 5678 9012 3456
3. Click Pay
4. ❌ Error: Invalid card number
```

### Scenario 5: Missing Delivery Info
```
1. Don't fill delivery info
2. Try to pay
3. ⚠️ Warning: Fill delivery info first
```

---

## 💳 Test Cards Cheat Sheet

### Copy-Paste Ready

**Visa:**
```
4532 1488 0343 6467
JOHN DOE
12/25
123
```

**Mastercard:**
```
5425 2334 3010 9903
JANE SMITH
12/26
456
```

**Amex:**
```
3782 822463 10005
TEST USER
12/25
1234
```

**Stripe:**
```
4242424242424242
12/25
123
```

---

## 🔍 Verify Payment

### Check Database
```sql
-- View latest order
SELECT * FROM orders ORDER BY order_date DESC LIMIT 1;

-- View transaction
SELECT * FROM transactions ORDER BY transaction_date DESC LIMIT 1;

-- View farmer splits
SELECT * FROM farmer_transaction_splits ORDER BY split_id DESC LIMIT 5;
```

### Check Frontend
1. Go to Orders tab
2. See order with status "pending"
3. Payment status: "paid" (Card/Stripe) or "pending" (COD)
4. Download invoice

---

## 🎨 What You'll See

### Checkout Page
```
┌─────────────────────────────────────────┐
│  Checkout                               │
├─────────────────────────────────────────┤
│                                         │
│  Delivery Information                   │
│  [Address field]                        │
│  [City] [Postal Code]                   │
│                                         │
│  Payment Method                         │
│  ○ 💳 Credit/Debit Card                │
│  ○ 🔷 Stripe Payment                   │
│  ● 💵 Cash on Delivery                 │
│                                         │
│  [Payment Form Here]                    │
│                                         │
└─────────────────────────────────────────┘
```

### Success Message
```
┌─────────────────────────────────────────┐
│  ✅ Order placed successfully!          │
│  Order Number: ORD1737734567890         │
└─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Issue: Payment button disabled
**Solution:** Fill in all delivery information first

### Issue: "Invalid card number"
**Solution:** Use test cards from the list above

### Issue: Stripe not loading
**Solution:** Check if NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set

### Issue: Order not created
**Solution:** Check backend console for errors

### Issue: Cart not clearing
**Solution:** Check browser console, refresh page

---

## 📱 Mobile Testing

Works on mobile too! Just:
1. Open `http://localhost:3000` on mobile
2. Follow same steps
3. Touch-friendly interface

---

## ✅ Checklist

Before testing, make sure:
- [ ] Backend is running (port 5000)
- [ ] Frontend is running (port 3000)
- [ ] Database is connected
- [ ] Logged in as customer
- [ ] Products in cart
- [ ] Delivery info filled

---

## 🎉 Success Indicators

You'll know it worked when:
- ✅ Success message appears
- ✅ Redirected to Orders tab
- ✅ Order appears in list
- ✅ Cart is empty
- ✅ Can download invoice

---

## 📚 More Information

- **Full Guide**: `COMPLETE_PAYMENT_GATEWAY_GUIDE.md`
- **Test Cards**: `TEST_CARDS_REFERENCE.md`
- **Features**: `PAYMENT_GATEWAY_FEATURES.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`

---

## 🚀 Ready to Go!

Your payment gateway is **fully functional** and ready to use!

**Start testing now with:**
- Card: `4532 1488 0343 6467`
- Name: `JOHN DOE`
- Expiry: `12/25`
- CVV: `123`

**Happy Testing! 🎉**

