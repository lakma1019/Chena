-- Fix image paths to match actual filenames in frontend/public/images/list

-- FRUITS
UPDATE product_catalog SET image_url = '/images/list/fruits/woodapple.png' WHERE product_name = 'Wood Apple';
UPDATE product_catalog SET image_url = '/images/list/fruits/water melon.png' WHERE product_name = 'Watermelon';

-- Add missing fruits
INSERT INTO product_catalog (product_name, category, standard_weight, suggested_price, image_url, is_active)
VALUES 
    ('Passion Fruit', 'fruits', '500g', 300.00, '/images/list/fruits/passion fruit.png', TRUE),
    ('Soursop', 'fruits', '1kg', 350.00, '/images/list/fruits/soursop.png', TRUE),
    ('Star Fruit', 'fruits', '500g', 200.00, '/images/list/fruits/star fruit.png', TRUE)
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url);

-- LOW COUNTRY VEGETABLES
-- Remove products that don't have images
DELETE FROM product_catalog WHERE product_name IN ('Brinjal', 'Capsicum', 'Green Chilli', 'Okra', 'Ridge Gourd', 'Snake Gourd', 'Winged Bean') AND category = 'low-country-vegetable';

-- Add missing low country vegetables
INSERT INTO product_catalog (product_name, category, standard_weight, suggested_price, image_url, is_active)
VALUES 
    ('Bird Eye Chilli', 'low-country-vegetable', '100g', 80.00, '/images/list/low country vegetable/bird eye chilli.png', TRUE),
    ('Broccoli', 'low-country-vegetable', '500g', 300.00, '/images/list/low country vegetable/broccoli.png', TRUE),
    ('Ginger', 'low-country-vegetable', '250g', 150.00, '/images/list/low country vegetable/ginger.png', TRUE),
    ('Ladies Fingers', 'low-country-vegetable', '500g', 200.00, '/images/list/low country vegetable/ladies fingers.png', TRUE),
    ('Long Beans', 'low-country-vegetable', '500g', 180.00, '/images/list/low country vegetable/long beans.png', TRUE),
    ('Lotus Root', 'low-country-vegetable', '500g', 250.00, '/images/list/low country vegetable/lotus root.png', TRUE),
    ('Luffa Gourd', 'low-country-vegetable', '500g', 140.00, '/images/list/low country vegetable/luffa gourd.png', TRUE),
    ('Potato', 'low-country-vegetable', '1kg', 200.00, '/images/list/low country vegetable/potato.png', TRUE),
    ('Sarana', 'low-country-vegetable', '500g', 100.00, '/images/list/low country vegetable/sarana.png', TRUE),
    ('Sweet Potato', 'low-country-vegetable', '1kg', 150.00, '/images/list/low country vegetable/sweet potato.png', TRUE),
    ('Thalana Batu', 'low-country-vegetable', '500g', 120.00, '/images/list/low country vegetable/thalana batu.png', TRUE)
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url);

-- Fix pumpkin spelling
UPDATE product_catalog SET image_url = '/images/list/low country vegetable/pumkin.png' WHERE product_name = 'Pumpkin' AND category = 'low-country-vegetable';

-- UP COUNTRY VEGETABLES
-- Remove products that don't have images
DELETE FROM product_catalog WHERE product_name IN ('Chinese Cabbage', 'Garlic', 'Knol Khol') AND category = 'up-country-vegetable';

-- Add missing up country vegetables
INSERT INTO product_catalog (product_name, category, standard_weight, suggested_price, image_url, is_active)
VALUES 
    ('Bok Choy', 'up-country-vegetable', '500g', 200.00, '/images/list/up country vegetable/bokchoy.png', TRUE),
    ('Cabbage', 'up-country-vegetable', '1kg', 180.00, '/images/list/up country vegetable/cabbage.png', TRUE),
    ('Cucumber Green', 'up-country-vegetable', '500g', 150.00, '/images/list/up country vegetable/cucumber green.png', TRUE)
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url);

-- Fix cauliflower spelling
UPDATE product_catalog SET image_url = '/images/list/up country vegetable/cauli flower.png' WHERE product_name = 'Cauliflower';

