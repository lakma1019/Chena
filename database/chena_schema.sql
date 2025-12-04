-- ============================================
-- CHENA DATABASE - AGRICULTURAL MARKETPLACE
-- MySQL Schema Implementation with Payment Gateway
-- ============================================
-- Create Database
CREATE DATABASE IF NOT EXISTS Chena;
USE Chena;
-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'farmer', 'customer', 'transport') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    nic VARCHAR(20) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_nic (nic)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 2. FARMER-SPECIFIC TABLES
-- ============================================
CREATE TABLE farmers (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    farm_name VARCHAR(255) NOT NULL,
    farm_size VARCHAR(50),
    farm_type VARCHAR(100),
    bank_account VARCHAR(50),
    bank_name VARCHAR(100),
    branch VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 3. CUSTOMER-SPECIFIC TABLES
-- ============================================
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 4. TRANSPORT PROVIDER TABLES
-- ============================================
CREATE TABLE transport_providers (
    transport_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE transport_vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    transport_id INT NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    is_vehicle_owner BOOLEAN DEFAULT TRUE,
    owner_nic VARCHAR(20),
    owner_phone VARCHAR(20),
    owner_address TEXT,
    price_per_km DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transport_id) REFERENCES transport_providers(transport_id) ON DELETE CASCADE,
    INDEX idx_transport_id (transport_id),
    INDEX idx_vehicle_number (vehicle_number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 5. PRODUCT CATALOG
-- ============================================
CREATE TABLE product_catalog (
    catalog_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category ENUM(
        'fruits',
        'low-country-vegetable',
        'up-country-vegetable'
    ) NOT NULL,
    standard_weight VARCHAR(50) NOT NULL,
    suggested_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_product_name (product_name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 6. FARMER INVENTORY
-- ============================================
CREATE TABLE farmer_products (
    farmer_product_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    catalog_id INT NOT NULL,
    quantity_available INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    weight_unit VARCHAR(50) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    FOREIGN KEY (catalog_id) REFERENCES product_catalog(catalog_id) ON DELETE CASCADE,
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_catalog_id (catalog_id),
    INDEX idx_status (status),
    INDEX idx_farmer_catalog (farmer_id, catalog_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 7. ORDERS & TRANSACTIONS
-- ============================================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100),
    delivery_postal_code VARCHAR(10),
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash on Delivery', 'Online Payment') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM(
        'pending',
        'processing',
        'ready',
        'shipped',
        'delivered',
        'cancelled'
    ) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    cancelled_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_order_number (order_number),
    INDEX idx_customer_id (customer_id),
    INDEX idx_order_status (order_status),
    INDEX idx_order_date (order_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    farmer_product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    weight_unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    farmer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_product_id) REFERENCES farmer_products(farmer_product_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_farmer_product_id (farmer_product_id),
    INDEX idx_farmer_id (farmer_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 8. PAYMENT GATEWAY TRANSACTIONS
-- ============================================
-- Main transaction table for payment gateway
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(100) UNIQUE NOT NULL,
    order_id INT UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    -- Payment Gateway Details
    payment_gateway VARCHAR(50) NOT NULL COMMENT 'e.g., PayHere, Stripe, PayPal',
    gateway_transaction_id VARCHAR(255) UNIQUE COMMENT 'Transaction ID from payment gateway',
    -- Transaction Amounts
    total_amount DECIMAL(10, 2) NOT NULL COMMENT 'Total amount paid by customer',
    products_amount DECIMAL(10, 2) NOT NULL COMMENT 'Total amount for products (to be split among farmers)',
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Delivery fee (goes to transport provider)',
    platform_fee DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Platform commission fee',
    -- Transaction Status
    transaction_status ENUM(
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded',
        'cancelled'
    ) DEFAULT 'pending',
    -- Payment Gateway Response
    gateway_response TEXT COMMENT 'JSON response from payment gateway',
    gateway_status_code VARCHAR(50),
    -- Timestamps
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    failed_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    -- Additional Info
    customer_ip VARCHAR(45),
    payment_method_type VARCHAR(50) COMMENT 'e.g., Credit Card, Debit Card, Bank Transfer',
    card_last_four VARCHAR(4) COMMENT 'Last 4 digits of card',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_transaction_number (transaction_number),
    INDEX idx_gateway_transaction_id (gateway_transaction_id),
    INDEX idx_order_id (order_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_transaction_status (transaction_status),
    INDEX idx_initiated_at (initiated_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Farmer payment splits from each transaction
CREATE TABLE farmer_transaction_splits (
    split_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    order_id INT NOT NULL,
    farmer_id INT NOT NULL,
    -- Amount Breakdown
    products_subtotal DECIMAL(10, 2) NOT NULL COMMENT 'Total amount for this farmer products in the order',
    platform_commission DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Platform commission deducted',
    farmer_net_amount DECIMAL(10, 2) NOT NULL COMMENT 'Net amount farmer receives after commission',
    -- Payout Status
    payout_status ENUM(
        'pending',
        'processing',
        'completed',
        'failed',
        'on_hold'
    ) DEFAULT 'pending',
    payout_method VARCHAR(50) COMMENT 'e.g., Bank Transfer, Mobile Money',
    payout_reference VARCHAR(255) COMMENT 'Bank transfer reference or payout ID',
    -- Timestamps
    payout_initiated_at TIMESTAMP NULL,
    payout_completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_order_id (order_id),
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_payout_status (payout_status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 9. DELIVERY MANAGEMENT
-- ============================================
CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_number VARCHAR(50) UNIQUE NOT NULL,
    order_id INT UNIQUE NOT NULL,
    transport_id INT,
    vehicle_id INT,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    distance_km DECIMAL(10, 2),
    delivery_fee DECIMAL(10, 2) NOT NULL,
    delivery_status ENUM(
        'pending',
        'assigned',
        'picked_up',
        'in_transit',
        'completed',
        'cancelled'
    ) DEFAULT 'pending',
    assigned_date TIMESTAMP NULL,
    pickup_date TIMESTAMP NULL,
    completed_date TIMESTAMP NULL,
    cancelled_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (transport_id) REFERENCES transport_providers(transport_id) ON DELETE
    SET NULL,
        FOREIGN KEY (vehicle_id) REFERENCES transport_vehicles(vehicle_id) ON DELETE
    SET NULL,
        INDEX idx_delivery_number (delivery_number),
        INDEX idx_order_id (order_id),
        INDEX idx_transport_id (transport_id),
        INDEX idx_delivery_status (delivery_status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 10. SHOPPING CART
-- ============================================
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    farmer_product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_product_id) REFERENCES farmer_products(farmer_product_id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_farmer_product_id (farmer_product_id),
    UNIQUE INDEX idx_customer_product (customer_id, farmer_product_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- 11. REVIEWS & RATINGS
-- ============================================
CREATE TABLE product_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    customer_id INT NOT NULL,
    farmer_product_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (
        rating BETWEEN 1 AND 5
    ),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_product_id) REFERENCES farmer_products(farmer_product_id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_farmer_product_id (farmer_product_id),
    INDEX idx_order_item_id (order_item_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================
-- Insert Admin User
INSERT INTO users (
        email,
        password_hash,
        user_type,
        full_name,
        phone,
        nic,
        address,
        is_verified,
        is_active
    )
VALUES (
        'admin@chena.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'admin',
        'System Administrator',
        '+94 11 234 5678',
        '197012345678',
        'Chena Head Office, Colombo 07',
        TRUE,
        TRUE
    );
-- Insert Sample Farmers
INSERT INTO users (
        email,
        password_hash,
        user_type,
        full_name,
        phone,
        nic,
        address,
        is_verified,
        is_active
    )
VALUES (
        'sunil@gmail.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'farmer',
        'Sunil Perera',
        '+94 77 123 4567',
        '197512345678',
        'No. 123, Main Street, Anuradhapura',
        TRUE,
        TRUE
    ),
    (
        'nimal@gmail.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'farmer',
        'Nimal Fernando',
        '+94 77 987 6543',
        '198012345679',
        'No. 456, Farm Road, Nuwara Eliya',
        TRUE,
        TRUE
    );
INSERT INTO farmers (
        user_id,
        farm_name,
        farm_size,
        farm_type,
        bank_account,
        bank_name,
        branch
    )
VALUES (
        2,
        'Sunil Organic Farm',
        '5 Acres',
        'Organic Vegetables',
        '1234567890',
        'Bank of Ceylon',
        'Anuradhapura'
    ),
    (
        3,
        'Nimal Fresh Produce',
        '3 Acres',
        'Mixed Farming',
        '9876543210',
        'Commercial Bank',
        'Nuwara Eliya'
    );
-- Insert Sample Customer
INSERT INTO users (
        email,
        password_hash,
        user_type,
        full_name,
        phone,
        nic,
        address,
        is_verified,
        is_active
    )
VALUES (
        'rasini@gmail.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'customer',
        'Rasini Perera',
        '+94 77 234 5678',
        '199512345678',
        'No. 45, Main Street, Colombo 07',
        TRUE,
        TRUE
    );
INSERT INTO customers (user_id, city, postal_code)
VALUES (4, 'Colombo', '00700');
-- Insert Sample Transport Provider
INSERT INTO users (
        email,
        password_hash,
        user_type,
        full_name,
        phone,
        nic,
        address,
        is_verified,
        is_active
    )
VALUES (
        'kamal@transport.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'transport',
        'Kamal Transport Services',
        '+94 77 345 6789',
        '198512345678',
        'No. 78, Galle Road, Colombo 03',
        TRUE,
        TRUE
    );
INSERT INTO transport_providers (user_id, city, postal_code)
VALUES (5, 'Colombo', '00300');
INSERT INTO transport_vehicles (
        transport_id,
        vehicle_type,
        vehicle_number,
        license_number,
        is_vehicle_owner,
        price_per_km,
        is_active
    )
VALUES (
        1,
        'Van',
        'CAB-1234',
        'B1234567',
        TRUE,
        50.00,
        TRUE
    );
-- Insert Product Catalog (Fruits)
INSERT INTO product_catalog (
        product_name,
        category,
        standard_weight,
        suggested_price,
        image_url
    )
VALUES (
        'Avocado',
        'fruits',
        '250g',
        150.00,
        '/images/list/fruits/avacado.png'
    ),
    (
        'Grapes Red',
        'fruits',
        '500g',
        350.00,
        '/images/list/fruits/grapes red.png'
    ),
    (
        'Mandarin',
        'fruits',
        '1kg',
        280.00,
        '/images/list/fruits/mandarin.png'
    ),
    (
        'Narang',
        'fruits',
        '1kg',
        200.00,
        '/images/list/fruits/narang.png'
    ),
    (
        'Papaya',
        'fruits',
        '1kg',
        180.00,
        '/images/list/fruits/papaya.png'
    ),
    (
        'Pineapple',
        'fruits',
        '1kg',
        220.00,
        '/images/list/fruits/pineapple.png'
    ),
    (
        'Pomegranate',
        'fruits',
        '500g',
        400.00,
        '/images/list/fruits/pomegranate.png'
    ),
    (
        'Rambutan',
        'fruits',
        '500g',
        250.00,
        '/images/list/fruits/rambutan.png'
    ),
    (
        'Watermelon',
        'fruits',
        '1kg',
        120.00,
        '/images/list/fruits/watermelon.png'
    ),
    (
        'Wood Apple',
        'fruits',
        '500g',
        150.00,
        '/images/list/fruits/wood apple.png'
    );
-- Insert Product Catalog (Low Country Vegetables)
INSERT INTO product_catalog (
        product_name,
        category,
        standard_weight,
        suggested_price,
        image_url
    )
VALUES (
        'Amberella',
        'low-country-vegetable',
        '500g',
        120.00,
        '/images/list/low country vegetable/amberella.png'
    ),
    (
        'Ash Plantain',
        'low-country-vegetable',
        '1kg',
        180.00,
        '/images/list/low country vegetable/ash plantain.png'
    ),
    (
        'Banana Blossom',
        'low-country-vegetable',
        '500g',
        100.00,
        '/images/list/low country vegetable/banana blossom.png'
    ),
    (
        'Beans',
        'low-country-vegetable',
        '500g',
        200.00,
        '/images/list/low country vegetable/beans.png'
    ),
    (
        'Bitter Gourd',
        'low-country-vegetable',
        '500g',
        150.00,
        '/images/list/low country vegetable/bitter gourd.png'
    ),
    (
        'Brinjal',
        'low-country-vegetable',
        '500g',
        120.00,
        '/images/list/low country vegetable/brinjal.png'
    ),
    (
        'Cabbage',
        'low-country-vegetable',
        '1kg',
        180.00,
        '/images/list/low country vegetable/cabbage.png'
    ),
    (
        'Capsicum',
        'low-country-vegetable',
        '500g',
        300.00,
        '/images/list/low country vegetable/capsicum.png'
    ),
    (
        'Cucumber',
        'low-country-vegetable',
        '500g',
        100.00,
        '/images/list/low country vegetable/cucumber.png'
    ),
    (
        'Drumstick',
        'low-country-vegetable',
        '500g',
        180.00,
        '/images/list/low country vegetable/drumstick.png'
    ),
    (
        'Green Chilli',
        'low-country-vegetable',
        '250g',
        150.00,
        '/images/list/low country vegetable/green chilli.png'
    ),
    (
        'Okra',
        'low-country-vegetable',
        '500g',
        200.00,
        '/images/list/low country vegetable/okra.png'
    ),
    (
        'Pumpkin',
        'low-country-vegetable',
        '1kg',
        120.00,
        '/images/list/low country vegetable/pumpkin.png'
    ),
    (
        'Ridge Gourd',
        'low-country-vegetable',
        '500g',
        140.00,
        '/images/list/low country vegetable/ridge gourd.png'
    ),
    (
        'Snake Gourd',
        'low-country-vegetable',
        '500g',
        130.00,
        '/images/list/low country vegetable/snake gourd.png'
    ),
    (
        'Tomato',
        'low-country-vegetable',
        '500g',
        180.00,
        '/images/list/low country vegetable/tomato.png'
    ),
    (
        'Winged Bean',
        'low-country-vegetable',
        '500g',
        220.00,
        '/images/list/low country vegetable/winged bean.png'
    );
-- Insert Product Catalog (Up Country Vegetables)
INSERT INTO product_catalog (
        product_name,
        category,
        standard_weight,
        suggested_price,
        image_url
    )
VALUES (
        'Baby Carrot',
        'up-country-vegetable',
        '500g',
        280.00,
        '/images/list/up country vegetable/baby carrot.png'
    ),
    (
        'Beetroot',
        'up-country-vegetable',
        '500g',
        200.00,
        '/images/list/up country vegetable/beetroot.png'
    ),
    (
        'Bell Pepper Green',
        'up-country-vegetable',
        '500g',
        320.00,
        '/images/list/up country vegetable/bell pepper green.png'
    ),
    (
        'Bell Pepper Red',
        'up-country-vegetable',
        '500g',
        380.00,
        '/images/list/up country vegetable/bell pepper red.png'
    ),
    (
        'Bell Pepper Yellow',
        'up-country-vegetable',
        '500g',
        380.00,
        '/images/list/up country vegetable/bell pepper yellow.png'
    ),
    (
        'Broccoli',
        'up-country-vegetable',
        '500g',
        350.00,
        '/images/list/up country vegetable/broccoli.png'
    ),
    (
        'Carrot',
        'up-country-vegetable',
        '500g',
        200.00,
        '/images/list/up country vegetable/carrot.png'
    ),
    (
        'Cauliflower',
        'up-country-vegetable',
        '1kg',
        280.00,
        '/images/list/up country vegetable/cauliflower.png'
    ),
    (
        'Celery',
        'up-country-vegetable',
        '500g',
        250.00,
        '/images/list/up country vegetable/celery.png'
    ),
    (
        'Chinese Cabbage',
        'up-country-vegetable',
        '500g',
        180.00,
        '/images/list/up country vegetable/chinese cabbage.png'
    ),
    (
        'Garlic',
        'up-country-vegetable',
        '250g',
        200.00,
        '/images/list/up country vegetable/garlic.png'
    ),
    (
        'Knol Khol',
        'up-country-vegetable',
        '500g',
        180.00,
        '/images/list/up country vegetable/knol khol.png'
    ),
    (
        'Leeks',
        'up-country-vegetable',
        '500g',
        220.00,
        '/images/list/up country vegetable/leaks.png'
    ),
    (
        'Radish Long',
        'up-country-vegetable',
        '500g',
        160.00,
        '/images/list/up country vegetable/radish long.png'
    );
-- Insert Sample Farmer Products (Inventory)
INSERT INTO farmer_products (
        farmer_id,
        catalog_id,
        quantity_available,
        price,
        weight_unit,
        status
    )
VALUES -- Farmer 1 (Sunil) products
    (1, 26, 50, 180.00, '500g', 'active'),
    -- Tomato
    (1, 5, 30, 180.00, '1kg', 'active'),
    -- Papaya
    (1, 35, 40, 200.00, '500g', 'active'),
    -- Carrot
    (1, 17, 25, 180.00, '1kg', 'active'),
    -- Cabbage
    -- Farmer 2 (Nimal) products
    (2, 1, 20, 150.00, '250g', 'active'),
    -- Avocado
    (2, 28, 35, 200.00, '500g', 'active'),
    -- Beetroot
    (2, 31, 30, 320.00, '500g', 'active');
-- Bell Pepper Green
-- ============================================
-- SAMPLE TRANSACTION WITH PAYMENT SPLITS
-- ============================================
-- Create a sample order with products from multiple farmers
INSERT INTO orders (
        order_number,
        customer_id,
        delivery_address,
        delivery_city,
        delivery_postal_code,
        subtotal,
        delivery_fee,
        total_amount,
        payment_method,
        payment_status,
        order_status
    )
VALUES (
        'ORD001',
        1,
        'No. 45, Main Street, Colombo 07',
        'Colombo',
        '00700',
        1010.00,
        -- Products total
        200.00,
        -- Delivery fee
        1210.00,
        -- Total amount
        'Online Payment',
        'paid',
        'processing'
    );
-- Insert order items from different farmers
INSERT INTO order_items (
        order_id,
        farmer_product_id,
        product_name,
        quantity,
        weight_unit,
        unit_price,
        subtotal,
        farmer_id
    )
VALUES -- Items from Farmer 1 (Sunil)
    (1, 1, 'Tomato', 2, '500g', 180.00, 360.00, 1),
    (1, 2, 'Papaya', 1, '1kg', 180.00, 180.00, 1),
    -- Items from Farmer 2 (Nimal)
    (1, 5, 'Avocado', 3, '250g', 150.00, 450.00, 2);
-- Create payment gateway transaction
INSERT INTO transactions (
        transaction_number,
        order_id,
        customer_id,
        payment_gateway,
        gateway_transaction_id,
        total_amount,
        products_amount,
        delivery_fee,
        platform_fee,
        transaction_status,
        gateway_response,
        gateway_status_code,
        completed_at,
        customer_ip,
        payment_method_type,
        card_last_four
    )
VALUES (
        'TXN20241204001',
        1,
        1,
        'PayHere',
        'PH_TXN_123456789',
        1210.00,
        1010.00,
        200.00,
        50.50,
        -- 5% platform commission
        'completed',
        '{"status": "success", "payment_id": "PH_TXN_123456789", "method": "VISA"}',
        '2',
        NOW(),
        '192.168.1.100',
        'Credit Card',
        '4532'
    );
-- Create farmer payment splits (automatic distribution)
-- Farmer 1 gets: Rs. 540.00 (Tomato 360 + Papaya 180)
-- Platform commission: 5% = Rs. 27.00
-- Net to Farmer 1: Rs. 513.00
INSERT INTO farmer_transaction_splits (
        transaction_id,
        order_id,
        farmer_id,
        products_subtotal,
        platform_commission,
        farmer_net_amount,
        payout_status
    )
VALUES (
        1,
        1,
        1,
        540.00,
        27.00,
        513.00,
        'pending'
    );
-- Farmer 2 gets: Rs. 450.00 (Avocado 450)
-- Platform commission: 5% = Rs. 22.50
-- Net to Farmer 2: Rs. 427.50
INSERT INTO farmer_transaction_splits (
        transaction_id,
        order_id,
        farmer_id,
        products_subtotal,
        platform_commission,
        farmer_net_amount,
        payout_status
    )
VALUES (
        1,
        1,
        2,
        450.00,
        22.50,
        427.50,
        'pending'
    );
-- Create delivery record
INSERT INTO deliveries (
        delivery_number,
        order_id,
        transport_id,
        vehicle_id,
        pickup_address,
        delivery_address,
        distance_km,
        delivery_fee,
        delivery_status
    )
VALUES (
        'DEL001',
        1,
        1,
        1,
        'Farm Collection Point, Anuradhapura',
        'No. 45, Main Street, Colombo 07',
        200.00,
        200.00,
        'assigned'
    );
-- ============================================
-- END OF SCHEMA AND SAMPLE DATA
-- ============================================