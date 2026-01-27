import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testFarmerAnalytics() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Get a farmer ID to test with
    const [farmers] = await connection.query('SELECT farmer_id, user_id FROM farmers LIMIT 1');
    
    if (farmers.length === 0) {
      console.log('No farmers found in database');
      return;
    }

    const farmerId = farmers[0].farmer_id;
    console.log(`Testing analytics for farmer_id: ${farmerId}`);
    console.log('='.repeat(50));

    // 1. Get overall statistics
    const [stats] = await connection.query(
      `SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        COALESCE(SUM(oi.subtotal), 0) as total_revenue,
        COALESCE(AVG(oi.subtotal), 0) as avg_order_value
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE oi.farmer_id = ? 
      AND o.order_status IN ('delivered')
      AND o.payment_status = 'paid'`,
      [farmerId]
    );

    console.log('\n📊 STATISTICS:');
    console.log(JSON.stringify(stats[0], null, 2));

    // 2. Get sales trend
    const [salesTrend] = await connection.query(
      `SELECT 
        DATE(o.order_date) as date,
        COALESCE(SUM(oi.subtotal), 0) as sales
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE oi.farmer_id = ? 
      AND o.order_status IN ('delivered')
      AND o.payment_status = 'paid'
      AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(o.order_date)
      ORDER BY date ASC`,
      [farmerId]
    );

    console.log('\n📈 SALES TREND (Last 30 days):');
    console.log(JSON.stringify(salesTrend, null, 2));

    // 3. Get product performance
    const [productPerformance] = await connection.query(
      `SELECT 
        oi.product_name as product,
        SUM(oi.quantity) as quantity,
        COALESCE(SUM(oi.subtotal), 0) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE oi.farmer_id = ? 
      AND o.order_status IN ('delivered')
      AND o.payment_status = 'paid'
      GROUP BY oi.product_name
      ORDER BY revenue DESC
      LIMIT 10`,
      [farmerId]
    );

    console.log('\n🏆 PRODUCT PERFORMANCE:');
    console.log(JSON.stringify(productPerformance, null, 2));

    // 4. Get all orders for this farmer (regardless of status)
    const [allOrders] = await connection.query(
      `SELECT 
        o.order_id,
        o.order_number,
        o.order_status,
        o.payment_status,
        SUM(oi.subtotal) as farmer_total
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE oi.farmer_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC`,
      [farmerId]
    );

    console.log('\n📦 ALL ORDERS FOR THIS FARMER:');
    console.log(JSON.stringify(allOrders, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

testFarmerAnalytics();

