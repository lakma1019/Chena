import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const removeMissingImages = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    console.log('🗑️  Removing products without matching image files...\n');

    // Products that don't have matching images in the filesystem
    const productsToRemove = [
      'Rambutan',  // No image file
      'Brinjal',   // No image file (low country)
      'Cabbage',   // Duplicate - exists in up country
      'Capsicum',  // No image file
      'Green Chilli', // No image file
      'Okra',      // No image file
      'Ridge Gourd', // No image file
      'Snake Gourd', // No image file
      'Winged Bean', // No image file
      'Chinese Cabbage', // No image file
      'Garlic',    // No image file (up country - exists in low country as ginger)
      'Knol Khol'  // No image file
    ];

    for (const productName of productsToRemove) {
      const result = await connection.query(
        'DELETE FROM product_catalog WHERE product_name = ?',
        [productName]
      );
      console.log(`✅ Removed: ${productName}`);
    }

    console.log('\n✅ Cleanup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
};

removeMissingImages();

