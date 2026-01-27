import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const getAdminStats = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'Chena'
  });

  try {
    // Get user stats
    const [userStats] = await connection.query(`
      SELECT 
        COUNT(CASE WHEN user_type = 'farmer' THEN 1 END) as total_farmers,
        COUNT(CASE WHEN user_type = 'customer' THEN 1 END) as total_customers,
        COUNT(CASE WHEN user_type = 'transport' THEN 1 END) as total_transport,
        COUNT(*) as total_users
      FROM users
    `);

    // Get product stats
    const [productStats] = await connection.query(`
      SELECT COUNT(*) as total_products FROM farmer_products
    `);

    // Get order stats
    const [orderStats] = await connection.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
    `);

    // Get recent orders
    const [recentOrders] = await connection.query(`
      SELECT 
        o.order_id,
        o.order_number,
        u.full_name as customer_name,
        o.total_amount,
        o.order_status as status,
        o.order_date as created_at
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
      ORDER BY o.order_date DESC
      LIMIT 5
    `);

    console.log('=== DATABASE STATS ===');
    console.log(JSON.stringify({
      users: userStats[0],
      products: productStats[0],
      orders: orderStats[0],
      recentOrders: recentOrders
    }, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
};

getAdminStats();

