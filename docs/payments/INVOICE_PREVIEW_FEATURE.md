# 📄 Invoice Preview & Price Breakdown Feature

## ✨ What's New

### 1. **Detailed Price Breakdown in Order Cards**
Each order now shows a complete breakdown:
- ✅ Individual product prices
- ✅ Subtotal (sum of all products)
- ✅ Delivery fee
- ✅ **Total amount** (highlighted in blue)

### 2. **Invoice Preview Modal**
Before downloading, customers can preview the invoice:
- ✅ Professional invoice layout
- ✅ Complete order details
- ✅ Product table with quantities and prices
- ✅ Price breakdown section
- ✅ Download button in preview

---

## 🎨 Visual Layout

### Order Card (Enhanced)
```
┌─────────────────────────────────────────────────────┐
│  ORD1769218781398                    [PENDING]      │
│  Date: 1/24/2026                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Products:                                          │
│  ┌───────────────────────────────────────────────┐ │
│  │ Avocado (250g) x 1          Rs. 150.00       │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  Subtotal:                           Rs. 150.00    │
│  Delivery Fee:                       Rs. 200.00    │
│  ─────────────────────────────────────────────────  │
│  Total:                              Rs. 350.00    │
│                                                     │
│  Delivery Address: ABC                              │
│  Payment Method: Online Payment                     │
│  Payment Status: Paid                               │
│                                                     │
│  [👁 Preview Invoice] [⬇ Download] [❌ Cancel]     │
└─────────────────────────────────────────────────────┘
```

### Invoice Preview Modal
```
┌───────────────────────────────────────────────────────────┐
│  🌾 CHENA                                          [X]    │
│  Agricultural Marketplace                                 │
├───────────────────────────────────────────────────────────┤
│                                                           │
│                      INVOICE                              │
│                      ────────                             │
│                                                           │
│  Order Number: ORD1769218781398    Delivery Address:     │
│  Order Date: January 24, 2026      ABC                    │
│  Payment Method: Online Payment                           │
│  Payment Status: PAID              Order Status: pending  │
│                                                           │
│  ─────────────────────────────────────────────────────── │
│                                                           │
│  Order Items                                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Product    │ Quantity │ Unit Price │ Subtotal      │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Avocado    │    1     │ Rs. 150.00 │ Rs. 150.00   │ │
│  │ (250g)     │          │            │              │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Subtotal:                           Rs. 150.00     │ │
│  │ Delivery Fee:                       Rs. 200.00     │ │
│  │ ───────────────────────────────────────────────────│ │
│  │ TOTAL:                              Rs. 350.00     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  Thank you for your order! 🌾                             │
│  For any queries, contact us at support@chena.lk          │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  [Close]                          [⬇ Download Invoice]   │
└───────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### Files Modified
- ✅ `frontend/src/components/customer-profile/OrdersTab.jsx`

### New Features Added

#### 1. **State Management**
```javascript
const [previewOrder, setPreviewOrder] = useState(null)
```

#### 2. **Preview Handler**
```javascript
const handlePreviewInvoice = (order) => {
  setPreviewOrder(order)
}
```

#### 3. **Price Breakdown Display**
Shows in each order card:
- Product subtotals
- Delivery fee
- Total amount

#### 4. **Invoice Preview Modal**
- Full-screen overlay
- Professional invoice layout
- Detailed product table
- Price breakdown section
- Download button

---

## 💡 How It Works

### Step 1: View Orders
Customer goes to Orders tab and sees all orders with price breakdowns.

### Step 2: Preview Invoice
Click "👁 Preview Invoice" button to see full invoice.

### Step 3: Review Details
Modal shows:
- Order information
- Product details with prices
- Complete price breakdown
- Payment status

### Step 4: Download
Click "Download Invoice" in modal to save PDF.

---

## 📊 Price Breakdown Calculation

### Example Order:
```
Product: Avocado (250g) x 1
Unit Price: Rs. 150.00
─────────────────────────
Product Subtotal: Rs. 150.00

Delivery Fee: Rs. 200.00
─────────────────────────
TOTAL: Rs. 350.00
```

### Formula:
```
Subtotal = Sum of (Unit Price × Quantity) for all products
Total = Subtotal + Delivery Fee
```

---

## 🎯 User Benefits

1. **Transparency**: See exactly how the total is calculated
2. **Clarity**: Understand delivery fees separately
3. **Preview**: Review invoice before downloading
4. **Professional**: Clean, organized invoice layout
5. **Convenience**: Download directly from preview

---

## 🚀 Usage

### For Customers:

1. **Go to Customer Dashboard**
2. **Click "Orders" tab**
3. **See price breakdown** in each order card
4. **Click "Preview Invoice"** to see full details
5. **Click "Download Invoice"** to save PDF

### Price Breakdown Shows:
- ✅ Each product with quantity and price
- ✅ Subtotal of all products
- ✅ Delivery fee (Rs. 200.00)
- ✅ **Total amount** (Subtotal + Delivery)

---

## 📱 Responsive Design

- ✅ Works on desktop
- ✅ Works on tablet
- ✅ Works on mobile
- ✅ Modal scrolls on small screens
- ✅ Table adapts to screen size

---

## 🎨 Styling Features

### Order Card:
- Gray background for product section
- Border separators
- Bold total in blue
- Clear visual hierarchy

### Invoice Modal:
- Green header (brand color)
- Professional table layout
- Highlighted totals
- Clean typography
- Rounded corners

---

## ✅ Complete Feature List

- [x] Price breakdown in order cards
- [x] Subtotal calculation
- [x] Delivery fee display
- [x] Total amount highlighting
- [x] Preview invoice button
- [x] Full invoice modal
- [x] Product table in preview
- [x] Download from preview
- [x] Close modal functionality
- [x] Responsive design
- [x] Professional styling

---

## 🎉 Result

Customers now have **complete transparency** on their order costs:
- See how Rs. 350.00 is calculated
- Preview invoice before downloading
- Professional invoice layout
- Clear price breakdown

**Happy Shopping! 🛒**

