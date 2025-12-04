# Payment Gateway & Transaction Flow Documentation

## Overview
The Chena database includes a comprehensive payment gateway integration system that automatically splits payments among multiple farmers when a customer places an order containing products from different farmers.

---

## Database Tables for Payment Processing

### 1. **`transactions`** - Main Payment Gateway Table
Stores all payment gateway transactions from customers.

**Key Fields:**
- `transaction_number`: Unique transaction identifier (e.g., TXN20241204001)
- `gateway_transaction_id`: Transaction ID from payment gateway (PayHere, Stripe, etc.)
- `total_amount`: Total amount paid by customer (products + delivery + fees)
- `products_amount`: Amount for products only (to be split among farmers)
- `delivery_fee`: Delivery fee (goes to transport provider)
- `platform_fee`: Platform commission
- `transaction_status`: pending, processing, completed, failed, refunded, cancelled

### 2. **`farmer_transaction_splits`** - Automatic Payment Distribution
Automatically calculates and tracks how much each farmer receives from a transaction.

**Key Fields:**
- `products_subtotal`: Total amount for this farmer's products in the order
- `platform_commission`: Platform commission deducted (e.g., 5%)
- `farmer_net_amount`: Net amount farmer receives after commission
- `payout_status`: pending, processing, completed, failed, on_hold

---

## Payment Flow Example

### Scenario:
Customer orders:
- **2x Tomato** (Rs. 180 each) from **Farmer 1** = Rs. 360
- **1x Papaya** (Rs. 180) from **Farmer 1** = Rs. 180
- **3x Avocado** (Rs. 150 each) from **Farmer 2** = Rs. 450
- **Delivery Fee** = Rs. 200

**Total Order: Rs. 1,210**

---

## Step-by-Step Transaction Process

### Step 1: Customer Checkout
```sql
-- Order is created
INSERT INTO orders (order_number, customer_id, subtotal, delivery_fee, total_amount, payment_method)
VALUES ('ORD001', 1, 1010.00, 200.00, 1210.00, 'Online Payment');

-- Order items are recorded
INSERT INTO order_items (order_id, farmer_product_id, product_name, quantity, unit_price, subtotal, farmer_id)
VALUES 
(1, 1, 'Tomato', 2, 180.00, 360.00, 1),
(1, 2, 'Papaya', 1, 180.00, 180.00, 1),
(1, 5, 'Avocado', 3, 150.00, 450.00, 2);
```

### Step 2: Payment Gateway Transaction
```sql
-- Transaction record created when customer pays
INSERT INTO transactions (
    transaction_number, order_id, customer_id,
    payment_gateway, gateway_transaction_id,
    total_amount, products_amount, delivery_fee, platform_fee,
    transaction_status
) VALUES (
    'TXN20241204001', 1, 1,
    'PayHere', 'PH_TXN_123456789',
    1210.00, 1010.00, 200.00, 50.50,
    'completed'
);
```

### Step 3: Automatic Payment Split Calculation
The system automatically calculates each farmer's share:

**Farmer 1 (Sunil):**
- Products Total: Rs. 540.00 (Tomato 360 + Papaya 180)
- Platform Commission (5%): Rs. 27.00
- **Net Amount: Rs. 513.00**

**Farmer 2 (Nimal):**
- Products Total: Rs. 450.00 (Avocado 450)
- Platform Commission (5%): Rs. 22.50
- **Net Amount: Rs. 427.50**

```sql
-- Farmer 1 split
INSERT INTO farmer_transaction_splits (
    transaction_id, order_id, farmer_id,
    products_subtotal, platform_commission, farmer_net_amount,
    payout_status
) VALUES (1, 1, 1, 540.00, 27.00, 513.00, 'pending');

-- Farmer 2 split
INSERT INTO farmer_transaction_splits (
    transaction_id, order_id, farmer_id,
    products_subtotal, platform_commission, farmer_net_amount,
    payout_status
) VALUES (1, 1, 2, 450.00, 22.50, 427.50, 'pending');
```

---

## Money Distribution Breakdown

| Component | Amount (Rs.) | Recipient |
|-----------|--------------|-----------|
| Farmer 1 Products | 540.00 | - |
| Platform Commission (5%) | -27.00 | Platform |
| **Farmer 1 Net** | **513.00** | **Farmer 1** |
| | | |
| Farmer 2 Products | 450.00 | - |
| Platform Commission (5%) | -22.50 | Platform |
| **Farmer 2 Net** | **427.50** | **Farmer 2** |
| | | |
| Delivery Fee | 200.00 | Transport Provider |
| **Total Platform Fee** | **49.50** | **Platform** |
| | | |
| **TOTAL** | **1,210.00** | **Customer Paid** |

---

## SQL Queries for Payment Management

### Get Transaction Details with Farmer Splits
```sql
SELECT 
    t.transaction_number,
    t.total_amount,
    t.payment_gateway,
    t.transaction_status,
    f.farm_name,
    fts.products_subtotal,
    fts.platform_commission,
    fts.farmer_net_amount,
    fts.payout_status
FROM transactions t
JOIN farmer_transaction_splits fts ON t.transaction_id = fts.transaction_id
JOIN farmers f ON fts.farmer_id = f.farmer_id
WHERE t.transaction_number = 'TXN20241204001';
```

### Get Pending Payouts for a Farmer
```sql
SELECT 
    fts.split_id,
    t.transaction_number,
    o.order_number,
    fts.products_subtotal,
    fts.platform_commission,
    fts.farmer_net_amount,
    fts.payout_status,
    t.completed_at
FROM farmer_transaction_splits fts
JOIN transactions t ON fts.transaction_id = t.transaction_id
JOIN orders o ON fts.order_id = o.order_id
JOIN farmers f ON fts.farmer_id = f.farmer_id
WHERE f.farmer_id = 1 
AND fts.payout_status = 'pending'
ORDER BY t.completed_at DESC;
```

### Calculate Total Earnings for a Farmer
```sql
SELECT 
    f.farm_name,
    COUNT(fts.split_id) as total_transactions,
    SUM(fts.products_subtotal) as gross_earnings,
    SUM(fts.platform_commission) as total_commission,
    SUM(fts.farmer_net_amount) as net_earnings
FROM farmer_transaction_splits fts
JOIN farmers f ON fts.farmer_id = f.farmer_id
WHERE f.farmer_id = 1
AND fts.payout_status = 'completed';
```

---

## Payment Gateway Integration Points

### Supported Payment Gateways
- **PayHere** (Sri Lanka)
- **Stripe**
- **PayPal**
- Others can be added

### Integration Fields
- `payment_gateway`: Name of the gateway
- `gateway_transaction_id`: Unique ID from gateway
- `gateway_response`: Full JSON response from gateway
- `gateway_status_code`: Status code from gateway
- `payment_method_type`: Credit Card, Debit Card, Bank Transfer
- `card_last_four`: Last 4 digits of card (for reference)

---

## Payout Management

### Mark Payout as Completed
```sql
UPDATE farmer_transaction_splits
SET payout_status = 'completed',
    payout_method = 'Bank Transfer',
    payout_reference = 'BT20241204001',
    payout_completed_at = NOW()
WHERE split_id = 1;
```

---

## Security & Audit Trail

All tables include:
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp
- Transaction history is immutable (no deletions)
- All payment amounts are stored with 2 decimal precision
- Foreign key constraints ensure data integrity

---

## Notes

1. **Platform Commission**: Currently set at 5%, can be configured per transaction
2. **Delivery Fee**: Goes to transport provider, not split among farmers
3. **Automatic Calculation**: Payment splits are calculated automatically based on order items
4. **Payout Tracking**: Each farmer's payout is tracked separately with status
5. **Refund Support**: Transaction status includes 'refunded' for handling refunds

