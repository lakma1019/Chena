import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const checkProducts = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await connection.query(
      'SELECT product_name, category, image_url FROM product_catalog ORDER BY category, product_name'
    );
    
    console.log('\n📦 Products in database:\n');
    console.log('='.repeat(80));
    
    let currentCategory = '';
    rows.forEach(row => {
      if (row.category !== currentCategory) {
        currentCategory = row.category;
        console.log(`\n${currentCategory.toUpperCase()}`);
        console.log('-'.repeat(80));
      }
      console.log(`${row.product_name.padEnd(30)} -> ${row.image_url}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`\nTotal products: ${rows.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
};

checkProducts();

