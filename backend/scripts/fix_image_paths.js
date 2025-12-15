import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const fixImagePaths = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔧 Fixing image paths in database...\n');

    // Fix Wood Apple
    await connection.query(
      "UPDATE product_catalog SET image_url = '/images/list/fruits/woodapple.png' WHERE product_name = 'Wood Apple'"
    );
    console.log('✅ Fixed: Wood Apple');

    // Fix Watermelon
    await connection.query(
      "UPDATE product_catalog SET image_url = '/images/list/fruits/water melon.png' WHERE product_name = 'Watermelon'"
    );
    console.log('✅ Fixed: Watermelon');

    // Fix Pumpkin
    await connection.query(
      "UPDATE product_catalog SET image_url = '/images/list/low country vegetable/pumkin.png' WHERE product_name = 'Pumpkin' AND category = 'low-country-vegetable'"
    );
    console.log('✅ Fixed: Pumpkin');

    // Fix Cauliflower
    await connection.query(
      "UPDATE product_catalog SET image_url = '/images/list/up country vegetable/cauli flower.png' WHERE product_name = 'Cauliflower'"
    );
    console.log('✅ Fixed: Cauliflower');

    // Add missing fruits
    const missingFruits = [
      ['Passion Fruit', 'fruits', '500g', 300.00, '/images/list/fruits/passion fruit.png'],
      ['Soursop', 'fruits', '1kg', 350.00, '/images/list/fruits/soursop.png'],
      ['Star Fruit', 'fruits', '500g', 200.00, '/images/list/fruits/star fruit.png']
    ];

    for (const [name, category, weight, price, image] of missingFruits) {
      const [existing] = await connection.query(
        'SELECT catalog_id FROM product_catalog WHERE product_name = ?',
        [name]
      );
      
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO product_catalog (product_name, category, standard_weight, suggested_price, image_url, is_active) VALUES (?, ?, ?, ?, ?, TRUE)',
          [name, category, weight, price, image]
        );
        console.log(`✅ Added: ${name}`);
      }
    }

    // Add missing low country vegetables
    const missingLowCountry = [
      ['Bird Eye Chilli', 'low-country-vegetable', '100g', 80.00, '/images/list/low country vegetable/bird eye chilli.png'],
      ['Ginger', 'low-country-vegetable', '250g', 150.00, '/images/list/low country vegetable/ginger.png'],
      ['Ladies Fingers', 'low-country-vegetable', '500g', 200.00, '/images/list/low country vegetable/ladies fingers.png'],
      ['Long Beans', 'low-country-vegetable', '500g', 180.00, '/images/list/low country vegetable/long beans.png'],
      ['Lotus Root', 'low-country-vegetable', '500g', 250.00, '/images/list/low country vegetable/lotus root.png'],
      ['Luffa Gourd', 'low-country-vegetable', '500g', 140.00, '/images/list/low country vegetable/luffa gourd.png'],
      ['Potato', 'low-country-vegetable', '1kg', 200.00, '/images/list/low country vegetable/potato.png'],
      ['Sarana', 'low-country-vegetable', '500g', 100.00, '/images/list/low country vegetable/sarana.png'],
      ['Sweet Potato', 'low-country-vegetable', '1kg', 150.00, '/images/list/low country vegetable/sweet potato.png'],
      ['Thalana Batu', 'low-country-vegetable', '500g', 120.00, '/images/list/low country vegetable/thalana batu.png']
    ];

    for (const [name, category, weight, price, image] of missingLowCountry) {
      const [existing] = await connection.query(
        'SELECT catalog_id FROM product_catalog WHERE product_name = ?',
        [name]
      );
      
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO product_catalog (product_name, category, standard_weight, suggested_price, image_url, is_active) VALUES (?, ?, ?, ?, ?, TRUE)',
          [name, category, weight, price, image]
        );
        console.log(`✅ Added: ${name}`);
      }
    }

    // Add missing up country vegetables
    const missingUpCountry = [
      ['Bok Choy', 'up-country-vegetable', '500g', 200.00, '/images/list/up country vegetable/bokchoy.png'],
      ['Cucumber Green', 'up-country-vegetable', '500g', 150.00, '/images/list/up country vegetable/cucumber green.png']
    ];

    for (const [name, category, weight, price, image] of missingUpCountry) {
      const [existing] = await connection.query(
        'SELECT catalog_id FROM product_catalog WHERE product_name = ?',
        [name]
      );
      
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO product_catalog (product_name, category, standard_weight, suggested_price, image_url, is_active) VALUES (?, ?, ?, ?, ?, TRUE)',
          [name, category, weight, price, image]
        );
        console.log(`✅ Added: ${name}`);
      }
    }

    console.log('\n✅ All image paths fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
  } finally {
    await connection.end();
  }
};

fixImagePaths();

