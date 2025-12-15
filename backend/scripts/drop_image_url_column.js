import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dropImageUrlColumn = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    console.log('🗑️  Dropping image_url column from product_catalog table...\n');

    // Check if column exists
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM product_catalog LIKE 'image_url'"
    );

    if (columns.length > 0) {
      // Drop the column
      await connection.query(
        'ALTER TABLE product_catalog DROP COLUMN image_url'
      );
      console.log('✅ Successfully dropped image_url column');
      console.log('ℹ️  Image paths will now be generated dynamically based on product name and category');
    } else {
      console.log('ℹ️  Column image_url does not exist (already removed)');
    }

  } catch (error) {
    console.error('❌ Error dropping column:', error);
  } finally {
    await connection.end();
  }
};

dropImageUrlColumn();

