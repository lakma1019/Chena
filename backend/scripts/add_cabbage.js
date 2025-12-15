import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const addCabbage = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    // Check if Cabbage already exists in up-country
    const [existing] = await connection.query(
      "SELECT catalog_id FROM product_catalog WHERE product_name = 'Cabbage' AND category = 'up-country-vegetable'"
    );

    if (existing.length === 0) {
      await connection.query(
        "INSERT INTO product_catalog (product_name, category, standard_weight, suggested_price, image_url, is_active) VALUES ('Cabbage', 'up-country-vegetable', '1kg', 180.00, '/images/list/up country vegetable/cabbage.png', TRUE)"
      );
      console.log('✅ Added Cabbage to up-country vegetables');
    } else {
      console.log('ℹ️  Cabbage already exists in up-country vegetables');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
};

addCabbage();

