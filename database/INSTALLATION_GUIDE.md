# Chena Database Installation Guide

## Prerequisites

- MySQL Server 5.7+ or MySQL 8.0+
- MySQL Client or MySQL Workbench
- Database user with CREATE DATABASE privileges

---

## Installation Steps

### Option 1: Command Line Installation

#### Step 1: Login to MySQL
```bash
mysql -u root -p
```

#### Step 2: Run the Schema File
```bash
mysql -u root -p < chena_schema.sql
```

#### Step 3: Verify Installation
```bash
mysql -u root -p
```

```sql
USE Chena;
SHOW TABLES;
```

You should see 14 tables:
- users
- farmers
- customers
- transport_providers
- transport_vehicles
- product_catalog
- farmer_products
- orders
- order_items
- transactions
- farmer_transaction_splits
- deliveries
- cart_items
- product_reviews

---

### Option 2: MySQL Workbench Installation

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **File → Open SQL Script**
4. Select `chena_schema.sql`
5. Click the **Execute** button (⚡ icon)
6. Wait for completion
7. Refresh the Schemas panel to see the new `Chena` database

---

## Verify Sample Data

### Check Users
```sql
USE Chena;
SELECT user_id, email, user_type, full_name FROM users;
```

Expected output:
```
+----------+----------------------+-----------+-------------------------+
| user_id  | email                | user_type | full_name               |
+----------+----------------------+-----------+-------------------------+
| 1        | admin@chena.com      | admin     | System Administrator    |
| 2        | sunil@gmail.com      | farmer    | Sunil Perera            |
| 3        | nimal@gmail.com      | farmer    | Nimal Fernando          |
| 4        | rasini@gmail.com     | customer  | Rasini Perera           |
| 5        | kamal@transport.com  | transport | Kamal Transport Services|
+----------+----------------------+-----------+-------------------------+
```

### Check Products
```sql
SELECT COUNT(*) as total_products FROM product_catalog;
```

Expected: **41 products**

### Check Sample Transaction
```sql
SELECT 
    t.transaction_number,
    t.total_amount,
    t.payment_gateway,
    t.transaction_status
FROM transactions t;
```

Expected output:
```
+------------------+--------------+-----------------+--------------------+
| transaction_number| total_amount | payment_gateway | transaction_status |
+------------------+--------------+-----------------+--------------------+
| TXN20241204001   | 1210.00      | PayHere         | completed          |
+------------------+--------------+-----------------+--------------------+
```

### Check Payment Splits
```sql
SELECT 
    f.farm_name,
    fts.products_subtotal,
    fts.platform_commission,
    fts.farmer_net_amount,
    fts.payout_status
FROM farmer_transaction_splits fts
JOIN farmers f ON fts.farmer_id = f.farmer_id;
```

Expected output:
```
+---------------------+-------------------+---------------------+--------------------+---------------+
| farm_name           | products_subtotal | platform_commission | farmer_net_amount  | payout_status |
+---------------------+-------------------+---------------------+--------------------+---------------+
| Sunil Organic Farm  | 540.00            | 27.00               | 513.00             | pending       |
| Nimal Fresh Produce | 450.00            | 22.50               | 427.50             | pending       |
+---------------------+-------------------+---------------------+--------------------+---------------+
```

---

## Test Login Credentials

All passwords are hashed. The plain text password for all sample users is: **`password`**

| User Type | Email | Password | Purpose |
|-----------|-------|----------|---------|
| Admin | admin@chena.com | password | System administration |
| Farmer | sunil@gmail.com | password | Farmer 1 (Sunil Organic Farm) |
| Farmer | nimal@gmail.com | password | Farmer 2 (Nimal Fresh Produce) |
| Customer | rasini@gmail.com | password | Sample customer |
| Transport | kamal@transport.com | password | Transport provider |

**Note:** The password hash in the database is a bcrypt hash. You'll need to implement proper password hashing in your backend (e.g., using bcrypt, argon2, etc.)

---

## Troubleshooting

### Error: "Database already exists"
```sql
DROP DATABASE IF EXISTS Chena;
```
Then re-run the schema file.

### Error: "Access denied"
Make sure your MySQL user has CREATE DATABASE privileges:
```sql
GRANT ALL PRIVILEGES ON *.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Foreign key constraint fails"
This usually means the schema file was partially executed. Drop the database and start fresh:
```sql
DROP DATABASE IF EXISTS Chena;
```

---

## Next Steps

1. ✅ Database installed successfully
2. ✅ Sample data verified
3. 📖 Read `README.md` for database overview
4. 📖 Read `PAYMENT_TRANSACTION_FLOW.md` for payment integration
5. 📖 Read `DATABASE_SCHEMA_SUMMARY.md` for complete schema reference
6. 🔧 Configure your backend to connect to the database
7. 🔧 Implement authentication using the users table
8. 🔧 Integrate payment gateway (PayHere, Stripe, etc.)
9. 🔧 Build APIs for your Next.js frontend

---

## Database Connection String Examples

### Node.js (mysql2)
```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'Chena'
});
```

### Python (pymysql)
```python
import pymysql

connection = pymysql.connect(
    host='localhost',
    user='your_username',
    password='your_password',
    database='Chena'
)
```

### PHP (PDO)
```php
$pdo = new PDO(
    'mysql:host=localhost;dbname=Chena',
    'your_username',
    'your_password'
);
```

---

## Support

If you encounter any issues during installation, please check:
1. MySQL server is running
2. You have proper permissions
3. The schema file is complete and not corrupted
4. MySQL version is 5.7 or higher

