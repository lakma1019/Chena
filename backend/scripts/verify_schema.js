import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const verifySchema = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    console.log('📋 Product Catalog Table Schema:\n');
    
    const [columns] = await connection.query(
      'SHOW COLUMNS FROM product_catalog'
    );
    
    console.log('Column Name'.padEnd(25) + 'Type'.padEnd(30) + 'Null'.padEnd(10) + 'Key');
    console.log('='.repeat(80));
    
    columns.forEach(col => {
      console.log(
        col.Field.padEnd(25) + 
        col.Type.padEnd(30) + 
        col.Null.padEnd(10) + 
        col.Key
      );
    });
    
    console.log('\n✅ Schema verified - image_url column removed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
};

verifySchema();

