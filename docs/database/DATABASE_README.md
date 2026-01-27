# Chena Database - Agricultural Marketplace Platform

## Database Overview

**Database Name:** `Chena`  
**Database Type:** MySQL  
**Purpose:** Agricultural marketplace connecting farmers, customers, and transport providers

---

## Quick Start

### 1. Create Database
```bash
mysql -u root -p < chena_schema.sql
```

### 2. Verify Installation
```sql
USE Chena;
SHOW TABLES;
```

You should see 11 tables created.

---

## Database Structure

### Core Tables (11 Total)

1. **`users`** - Core authentication for all user types (admin, farmer, customer, transport)
2. **`farmers`** - Extended farmer profile information
3. **`customers`** - Extended customer profile information
4. **`transport_providers`** - Transport provider profiles
5. **`transport_vehicles`** - Vehicle and delivery details
6. **`product_catalog`** - Master product catalog (fruits & vegetables)
7. **`farmer_products`** - Farmer inventory (products they're selling)
8. **`orders`** - Customer orders
9. **`order_items`** - Individual items in each order
10. **`transactions`** - Payment gateway transactions
11. **`farmer_transaction_splits`** - Automatic payment distribution to farmers
12. **`deliveries`** - Delivery tracking and management
13. **`cart_items`** - Shopping cart items
14. **`product_reviews`** - Product reviews and ratings

---

## Key Features

### ✅ Multi-User System
- **Admin**: System administration
- **Farmer**: Sell products, manage inventory, view earnings
- **Customer**: Browse products, place orders, make payments
- **Transport Provider**: Manage deliveries, track earnings

### ✅ Payment Gateway Integration
- Supports multiple payment gateways (PayHere, Stripe, PayPal)
- Automatic payment splitting among multiple farmers
- Platform commission tracking
- Payout management for farmers

### ✅ Product Management
- 41 products in catalog (10 fruits, 17 low-country vegetables, 14 up-country vegetables)
- Farmers set their own prices
- Inventory tracking
- Product status (active/inactive)

### ✅ Order Management
- Multi-farmer orders (one order can have products from multiple farmers)
- Order status tracking (pending → processing → ready → shipped → delivered)
- Payment status tracking
- Order history

### ✅ Delivery Management
- Delivery assignment to transport providers
- Distance and fee calculation
- Delivery status tracking
- Pickup and delivery address management

---

## Sample Data Included

### Users
- **Admin**: admin@chena.com / password
- **Farmer 1**: sunil@gmail.com / password (Sunil Organic Farm)
- **Farmer 2**: nimal@gmail.com / password (Nimal Fresh Produce)
- **Customer**: rasini@gmail.com / password
- **Transport**: kamal@transport.com / password

### Sample Transaction
- Order ORD001 with products from 2 farmers
- Payment via PayHere gateway
- Automatic payment split calculated
- Delivery assigned

---

## Important Relationships

```
users (1) ──→ (1) farmers/customers/transport_providers
farmers (1) ──→ (many) farmer_products
product_catalog (1) ──→ (many) farmer_products
customers (1) ──→ (many) orders
orders (1) ──→ (many) order_items
orders (1) ──→ (1) transactions
transactions (1) ──→ (many) farmer_transaction_splits
orders (1) ──→ (1) deliveries
```

---

## Payment Transaction Flow

### Example: Customer pays Rs. 1,210 for order with products from 2 farmers

**Order Breakdown:**
- Farmer 1 products: Rs. 540
- Farmer 2 products: Rs. 450
- Delivery fee: Rs. 200
- **Total: Rs. 1,210**

**Automatic Distribution:**
- Farmer 1 receives: Rs. 513 (after 5% commission)
- Farmer 2 receives: Rs. 427.50 (after 5% commission)
- Platform commission: Rs. 49.50
- Transport provider: Rs. 200

See `PAYMENT_TRANSACTION_FLOW.md` for detailed documentation.

---

## Useful Queries

### Get All Active Products
```sql
SELECT 
    pc.product_name,
    pc.category,
    fp.price,
    fp.quantity_available,
    f.farm_name
FROM farmer_products fp
JOIN product_catalog pc ON fp.catalog_id = pc.catalog_id
JOIN farmers f ON fp.farmer_id = f.farmer_id
WHERE fp.status = 'active'
ORDER BY pc.category, pc.product_name;
```

### Get Order Details with Items
```sql
SELECT 
    o.order_number,
    o.order_date,
    o.total_amount,
    oi.product_name,
    oi.quantity,
    oi.unit_price,
    f.farm_name
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN farmers f ON oi.farmer_id = f.farmer_id
WHERE o.order_number = 'ORD001';
```

### Get Farmer Earnings Summary
```sql
SELECT 
    f.farm_name,
    COUNT(DISTINCT fts.transaction_id) as total_orders,
    SUM(fts.products_subtotal) as gross_earnings,
    SUM(fts.platform_commission) as commission_paid,
    SUM(fts.farmer_net_amount) as net_earnings
FROM farmer_transaction_splits fts
JOIN farmers f ON fts.farmer_id = f.farmer_id
GROUP BY f.farmer_id;
```

---

## Database Indexes

All tables include proper indexes for:
- Primary keys (AUTO_INCREMENT)
- Foreign keys
- Frequently queried columns (email, order_number, transaction_number, etc.)
- Composite indexes for complex queries

---

## Data Integrity

- **Foreign Key Constraints**: Ensure referential integrity
- **Cascade Deletes**: Automatic cleanup of related records
- **Check Constraints**: Validate data (e.g., rating between 1-5)
- **Unique Constraints**: Prevent duplicates (email, NIC, vehicle number, etc.)
- **NOT NULL Constraints**: Ensure required fields are populated

---

## Timestamps & Audit Trail

All tables include:
- `created_at`: Record creation timestamp
- `updated_at`: Automatically updated on modification

---

## Next Steps

1. ✅ Import the schema: `mysql -u root -p < chena_schema.sql`
2. ✅ Review sample data and test queries
3. ✅ Read `PAYMENT_TRANSACTION_FLOW.md` for payment integration
4. ✅ Integrate with your backend API
5. ✅ Configure payment gateway credentials
6. ✅ Set up automated payout system for farmers

---

## Support

For questions or issues with the database schema, please refer to:
- `chena_schema.sql` - Complete database schema
- `PAYMENT_TRANSACTION_FLOW.md` - Payment system documentation

