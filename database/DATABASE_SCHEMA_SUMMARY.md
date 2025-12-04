# Chena Database Schema Summary

## Complete Table Structure

---

## 1. USERS & AUTHENTICATION

### `users` (Core Authentication)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INT | PK, AUTO_INCREMENT | Unique user ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| user_type | ENUM | NOT NULL | admin, farmer, customer, transport |
| full_name | VARCHAR(255) | NOT NULL | Full name |
| phone | VARCHAR(20) | NOT NULL | Phone number |
| nic | VARCHAR(20) | UNIQUE, NOT NULL | National ID |
| address | TEXT | NOT NULL | Physical address |
| is_verified | BOOLEAN | DEFAULT FALSE | Verification status |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

---

## 2. FARMER TABLES

### `farmers` (Farmer Profiles)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| farmer_id | INT | PK, AUTO_INCREMENT | Unique farmer ID |
| user_id | INT | FK → users, UNIQUE | Reference to user |
| farm_name | VARCHAR(255) | NOT NULL | Farm name |
| farm_size | VARCHAR(50) | NULL | Farm size |
| farm_type | VARCHAR(100) | NULL | Type of farming |
| bank_account | VARCHAR(50) | NULL | Bank account |
| bank_name | VARCHAR(100) | NULL | Bank name |
| branch | VARCHAR(100) | NULL | Bank branch |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

### `farmer_products` (Farmer Inventory)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| farmer_product_id | INT | PK, AUTO_INCREMENT | Unique product ID |
| farmer_id | INT | FK → farmers | Farmer reference |
| catalog_id | INT | FK → product_catalog | Product reference |
| quantity_available | INT | NOT NULL, DEFAULT 0 | Stock quantity |
| price | DECIMAL(10,2) | NOT NULL | Selling price |
| weight_unit | VARCHAR(50) | NOT NULL | Weight unit |
| status | ENUM | DEFAULT 'active' | active, inactive |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

---

## 3. CUSTOMER TABLES

### `customers` (Customer Profiles)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| customer_id | INT | PK, AUTO_INCREMENT | Unique customer ID |
| user_id | INT | FK → users, UNIQUE | Reference to user |
| city | VARCHAR(100) | NULL | City |
| postal_code | VARCHAR(10) | NULL | Postal code |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

### `cart_items` (Shopping Cart)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| cart_item_id | INT | PK, AUTO_INCREMENT | Unique cart item ID |
| customer_id | INT | FK → customers | Customer reference |
| farmer_product_id | INT | FK → farmer_products | Product reference |
| quantity | INT | NOT NULL, DEFAULT 1 | Quantity |
| added_at | TIMESTAMP | AUTO | Added time |
| updated_at | TIMESTAMP | AUTO | Last update |

---

## 4. TRANSPORT PROVIDER TABLES

### `transport_providers` (Transport Profiles)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| transport_id | INT | PK, AUTO_INCREMENT | Unique transport ID |
| user_id | INT | FK → users, UNIQUE | Reference to user |
| city | VARCHAR(100) | NULL | Operating city |
| postal_code | VARCHAR(10) | NULL | Postal code |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

### `transport_vehicles` (Vehicle Details)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| vehicle_id | INT | PK, AUTO_INCREMENT | Unique vehicle ID |
| transport_id | INT | FK → transport_providers | Transport reference |
| vehicle_type | VARCHAR(100) | NOT NULL | Vehicle type |
| vehicle_number | VARCHAR(50) | UNIQUE, NOT NULL | Registration number |
| license_number | VARCHAR(50) | NOT NULL | License number |
| is_vehicle_owner | BOOLEAN | DEFAULT TRUE | Ownership status |
| owner_nic | VARCHAR(20) | NULL | Owner NIC if not provider |
| owner_phone | VARCHAR(20) | NULL | Owner phone |
| owner_address | TEXT | NULL | Owner address |
| price_per_km | DECIMAL(10,2) | NOT NULL | Price per km |
| is_active | BOOLEAN | DEFAULT TRUE | Vehicle status |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

---

## 5. PRODUCT CATALOG

### `product_catalog` (Master Product List)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| catalog_id | INT | PK, AUTO_INCREMENT | Unique catalog ID |
| product_name | VARCHAR(255) | NOT NULL | Product name |
| category | ENUM | NOT NULL | fruits, low-country-vegetable, up-country-vegetable |
| standard_weight | VARCHAR(50) | NOT NULL | Standard weight |
| suggested_price | DECIMAL(10,2) | NOT NULL | Suggested price |
| image_url | VARCHAR(500) | NULL | Image path |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

**Product Count:**
- Fruits: 10 products
- Low Country Vegetables: 17 products
- Up Country Vegetables: 14 products
- **Total: 41 products**

---

## 6. ORDERS & TRANSACTIONS

### `orders` (Customer Orders)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_id | INT | PK, AUTO_INCREMENT | Unique order ID |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | Order number (ORD001) |
| customer_id | INT | FK → customers | Customer reference |
| delivery_address | TEXT | NOT NULL | Delivery address |
| delivery_city | VARCHAR(100) | NULL | City |
| delivery_postal_code | VARCHAR(10) | NULL | Postal code |
| subtotal | DECIMAL(10,2) | NOT NULL | Products subtotal |
| delivery_fee | DECIMAL(10,2) | DEFAULT 0.00 | Delivery fee |
| total_amount | DECIMAL(10,2) | NOT NULL | Total amount |
| payment_method | ENUM | NOT NULL | Cash on Delivery, Online Payment |
| payment_status | ENUM | DEFAULT 'pending' | pending, paid, failed, refunded |
| order_status | ENUM | DEFAULT 'pending' | pending, processing, ready, shipped, delivered, cancelled |
| order_date | TIMESTAMP | AUTO | Order date |
| completed_date | TIMESTAMP | NULL | Completion date |
| cancelled_date | TIMESTAMP | NULL | Cancellation date |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

### `order_items` (Order Line Items)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_item_id | INT | PK, AUTO_INCREMENT | Unique item ID |
| order_id | INT | FK → orders | Order reference |
| farmer_product_id | INT | FK → farmer_products | Product reference |
| product_name | VARCHAR(255) | NOT NULL | Product name (snapshot) |
| quantity | INT | NOT NULL | Quantity |
| weight_unit | VARCHAR(50) | NOT NULL | Weight unit |
| unit_price | DECIMAL(10,2) | NOT NULL | Price per unit |
| subtotal | DECIMAL(10,2) | NOT NULL | Item subtotal |
| farmer_id | INT | FK → farmers | Farmer reference |
| created_at | TIMESTAMP | AUTO | Creation time |

---

## 7. PAYMENT GATEWAY & SPLITS

### `transactions` (Payment Gateway Transactions) ⭐ NEW
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| transaction_id | INT | PK, AUTO_INCREMENT | Unique transaction ID |
| transaction_number | VARCHAR(100) | UNIQUE, NOT NULL | Transaction number |
| order_id | INT | FK → orders, UNIQUE | Order reference |
| customer_id | INT | FK → customers | Customer reference |
| payment_gateway | VARCHAR(50) | NOT NULL | PayHere, Stripe, PayPal |
| gateway_transaction_id | VARCHAR(255) | UNIQUE | Gateway transaction ID |
| total_amount | DECIMAL(10,2) | NOT NULL | Total paid by customer |
| products_amount | DECIMAL(10,2) | NOT NULL | Amount for products |
| delivery_fee | DECIMAL(10,2) | DEFAULT 0.00 | Delivery fee |
| platform_fee | DECIMAL(10,2) | DEFAULT 0.00 | Platform commission |
| transaction_status | ENUM | DEFAULT 'pending' | pending, processing, completed, failed, refunded, cancelled |
| gateway_response | TEXT | NULL | JSON response |
| gateway_status_code | VARCHAR(50) | NULL | Status code |
| initiated_at | TIMESTAMP | AUTO | Initiation time |
| completed_at | TIMESTAMP | NULL | Completion time |
| failed_at | TIMESTAMP | NULL | Failure time |
| refunded_at | TIMESTAMP | NULL | Refund time |
| customer_ip | VARCHAR(45) | NULL | Customer IP |
| payment_method_type | VARCHAR(50) | NULL | Credit Card, Debit Card |
| card_last_four | VARCHAR(4) | NULL | Last 4 digits |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

### `farmer_transaction_splits` (Payment Distribution) ⭐ NEW
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| split_id | INT | PK, AUTO_INCREMENT | Unique split ID |
| transaction_id | INT | FK → transactions | Transaction reference |
| order_id | INT | FK → orders | Order reference |
| farmer_id | INT | FK → farmers | Farmer reference |
| products_subtotal | DECIMAL(10,2) | NOT NULL | Farmer's products total |
| platform_commission | DECIMAL(10,2) | DEFAULT 0.00 | Commission deducted |
| farmer_net_amount | DECIMAL(10,2) | NOT NULL | Net amount to farmer |
| payout_status | ENUM | DEFAULT 'pending' | pending, processing, completed, failed, on_hold |
| payout_method | VARCHAR(50) | NULL | Bank Transfer, etc. |
| payout_reference | VARCHAR(255) | NULL | Payout reference |
| payout_initiated_at | TIMESTAMP | NULL | Payout initiation |
| payout_completed_at | TIMESTAMP | NULL | Payout completion |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

---

## 8. DELIVERY MANAGEMENT

### `deliveries` (Delivery Tracking)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| delivery_id | INT | PK, AUTO_INCREMENT | Unique delivery ID |
| delivery_number | VARCHAR(50) | UNIQUE, NOT NULL | Delivery number |
| order_id | INT | FK → orders, UNIQUE | Order reference |
| transport_id | INT | FK → transport_providers | Transport reference |
| vehicle_id | INT | FK → transport_vehicles | Vehicle reference |
| pickup_address | TEXT | NOT NULL | Pickup address |
| delivery_address | TEXT | NOT NULL | Delivery address |
| distance_km | DECIMAL(10,2) | NULL | Distance in km |
| delivery_fee | DECIMAL(10,2) | NOT NULL | Delivery fee |
| delivery_status | ENUM | DEFAULT 'pending' | pending, assigned, picked_up, in_transit, completed, cancelled |
| assigned_date | TIMESTAMP | NULL | Assignment date |
| pickup_date | TIMESTAMP | NULL | Pickup date |
| completed_date | TIMESTAMP | NULL | Completion date |
| cancelled_date | TIMESTAMP | NULL | Cancellation date |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

---

## 9. REVIEWS & RATINGS

### `product_reviews` (Product Reviews)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| review_id | INT | PK, AUTO_INCREMENT | Unique review ID |
| order_item_id | INT | FK → order_items | Order item reference |
| customer_id | INT | FK → customers | Customer reference |
| farmer_product_id | INT | FK → farmer_products | Product reference |
| rating | TINYINT | NOT NULL, 1-5 | Rating (1-5 stars) |
| review_text | TEXT | NULL | Review text |
| created_at | TIMESTAMP | AUTO | Creation time |
| updated_at | TIMESTAMP | AUTO | Last update |

---

## Total Tables: 14

✅ Complete schema with payment gateway integration  
✅ Automatic payment splitting among farmers  
✅ Full audit trail with timestamps  
✅ Comprehensive indexing for performance  
✅ Foreign key constraints for data integrity

