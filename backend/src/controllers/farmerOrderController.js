import { db } from "../config/db.js";

// ============================================
// GET FARMER ANALYTICS - Get sales reports and analytics for farmer
// ============================================
/**
 * Retrieves comprehensive sales analytics for the logged-in farmer
 * @route GET /api/farmer/analytics
 * @access Private - Farmer only
 */
export const getFarmerAnalytics = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    // Validate user is a farmer
    if (userType !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can access this resource",
      });
    }

    // Get farmer_id from user_id
    const [farmers] = await db.query(
      "SELECT farmer_id FROM farmers WHERE user_id = ?",
      [userId]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    const farmerId = farmers[0].farmer_id;

    // 1. Get overall statistics (completed/delivered orders only)
    const [stats] = await db.query(
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

    // 2. Get sales trend by date (last 30 days)
    const [salesTrend] = await db.query(
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

    // 3. Get product performance
    const [productPerformance] = await db.query(
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

    // 4. Get customer distribution (revenue by customer)
    const [customerDistribution] = await db.query(
      `SELECT
        u.full_name as name,
        COALESCE(SUM(oi.subtotal), 0) as value
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      WHERE oi.farmer_id = ?
      AND o.order_status IN ('delivered')
      AND o.payment_status = 'paid'
      GROUP BY c.customer_id, u.full_name
      ORDER BY value DESC
      LIMIT 5`,
      [farmerId]
    );

    // 5. Get past orders history
    const [pastOrders] = await db.query(
      `SELECT
        o.order_id as id,
        o.order_number,
        u.full_name as customerName,
        o.order_date as orderDate,
        o.completed_date as completedDate,
        o.payment_method as paymentMethod,
        GROUP_CONCAT(oi.product_name SEPARATOR ', ') as products,
        SUM(oi.subtotal) as totalAmount
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      WHERE oi.farmer_id = ?
      AND o.order_status IN ('delivered')
      AND o.payment_status = 'paid'
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
      LIMIT 20`,
      [farmerId]
    );

    // Format dates for sales trend
    const formattedSalesTrend = salesTrend.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: parseFloat(item.sales)
    }));

    // Format product performance
    const formattedProductPerformance = productPerformance.map(item => ({
      product: item.product,
      quantity: parseInt(item.quantity),
      revenue: parseFloat(item.revenue)
    }));

    // Format customer distribution
    const formattedCustomerDistribution = customerDistribution.map(item => ({
      name: item.name,
      value: parseFloat(item.value)
    }));

    // Format past orders
    const formattedPastOrders = pastOrders.map(order => ({
      id: order.order_number,
      customerName: order.customerName,
      products: order.products ? order.products.split(', ').map(p => ({ name: p })) : [],
      orderDate: order.orderDate,
      completedDate: order.completedDate,
      paymentMethod: order.paymentMethod,
      totalAmount: parseFloat(order.totalAmount)
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue: parseFloat(stats[0].total_revenue),
          totalOrders: parseInt(stats[0].total_orders),
          averageOrderValue: parseFloat(stats[0].avg_order_value)
        },
        salesTrend: formattedSalesTrend,
        productPerformance: formattedProductPerformance,
        customerDistribution: formattedCustomerDistribution,
        pastOrders: formattedPastOrders
      }
    });
  } catch (error) {
    console.error("Get farmer analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching analytics",
      error: error.message,
    });
  }
};

// ============================================
// GET FARMER ORDERS - Get all orders containing farmer's products
// ============================================
/**
 * Retrieves all orders that contain products from the logged-in farmer
 * @route GET /api/farmer/orders
 * @access Private - Farmer only
 */
export const getFarmerOrders = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    // Validate user is a farmer
    if (userType !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can access this resource",
      });
    }

    // Get farmer_id from user_id
    const [farmers] = await db.query(
      "SELECT farmer_id FROM farmers WHERE user_id = ?",
      [userId]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    const farmerId = farmers[0].farmer_id;

    // Get all orders that contain this farmer's products
    const [orders] = await db.query(
      `SELECT DISTINCT
        o.order_id,
        o.order_number,
        o.delivery_address,
        o.delivery_city,
        o.delivery_postal_code,
        o.subtotal,
        o.delivery_fee,
        o.total_amount,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.order_date,
        o.completed_date,
        c.customer_id,
        u.full_name as customer_name,
        u.phone as customer_phone,
        u.address as customer_address,
        d.delivery_id,
        d.delivery_status,
        d.transport_id,
        d.special_notes as delivery_notes
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      LEFT JOIN deliveries d ON o.order_id = d.order_id
      WHERE oi.farmer_id = ?
      ORDER BY o.order_date DESC`,
      [farmerId]
    );

    // Get order items for each order (only this farmer's products)
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT
          oi.order_item_id,
          oi.product_name,
          oi.quantity,
          oi.weight_unit,
          oi.unit_price,
          oi.subtotal
        FROM order_items oi
        WHERE oi.order_id = ? AND oi.farmer_id = ?`,
        [order.order_id, farmerId]
      );
      order.items = items;
      
      // Calculate farmer's portion of the order
      order.farmer_subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get farmer orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
};

// ============================================
// GET AVAILABLE TRANSPORT PROVIDERS
// ============================================
/**
 * Retrieves all active transport providers with their vehicles and pricing
 * @route GET /api/farmer/transport-providers OR GET /api/orders/transport-providers/available
 * @access Private - Farmer or Customer
 */
export const getAvailableTransportProviders = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    // Validate user is a farmer or customer
    if (userType !== "farmer" && userType !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers and customers can access this resource",
      });
    }

    // Get all active transport providers with their vehicles
    const [transportProviders] = await db.query(
      `SELECT
        tp.transport_id,
        u.full_name as provider_name,
        u.phone as provider_phone,
        u.address as provider_address,
        tp.city,
        tp.postal_code
      FROM transport_providers tp
      JOIN users u ON tp.user_id = u.user_id
      WHERE u.is_active = TRUE
      ORDER BY u.full_name ASC`
    );

    // Get vehicles for each transport provider
    for (const provider of transportProviders) {
      const [vehicles] = await db.query(
        `SELECT
          vehicle_id,
          vehicle_type,
          vehicle_number,
          price_per_km,
          is_active
        FROM transport_vehicles
        WHERE transport_id = ? AND is_active = TRUE
        ORDER BY price_per_km ASC`,
        [provider.transport_id]
      );
      provider.vehicles = vehicles;
    }

    res.status(200).json({
      success: true,
      data: transportProviders,
    });
  } catch (error) {
    console.error("Get transport providers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching transport providers",
      error: error.message,
    });
  }
};

// ============================================
// ASSIGN TRANSPORT PROVIDER TO ORDER
// ============================================
/**
 * Assigns a transport provider and vehicle to an order's delivery
 * Creates delivery record if it doesn't exist
 * @route POST /api/farmer/orders/:orderId/assign-transport
 * @access Private - Farmer only
 */
export const assignTransportToOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { userId, userType } = req.user;
    const { orderId } = req.params;
    const { transportId, vehicleId } = req.body;

    // Validate user is a farmer
    if (userType !== "farmer") {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Only farmers can assign transport providers",
      });
    }

    // Validate required fields
    if (!transportId || !vehicleId) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Transport provider and vehicle are required",
      });
    }

    // Get farmer_id from user_id
    const [farmers] = await connection.query(
      "SELECT farmer_id FROM farmers WHERE user_id = ?",
      [userId]
    );

    if (farmers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    const farmerId = farmers[0].farmer_id;

    // Verify that this order contains the farmer's products
    const [orderItems] = await connection.query(
      "SELECT COUNT(*) as count FROM order_items WHERE order_id = ? AND farmer_id = ?",
      [orderId, farmerId]
    );

    if (orderItems[0].count === 0) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "You can only assign transport to orders containing your products",
      });
    }

    // Get order details
    const [orders] = await connection.query(
      `SELECT o.*, c.user_id as customer_user_id
       FROM orders o
       JOIN customers c ON o.customer_id = c.customer_id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    // Get vehicle details for pricing
    const [vehicles] = await connection.query(
      "SELECT * FROM transport_vehicles WHERE vehicle_id = ? AND transport_id = ? AND is_active = TRUE",
      [vehicleId, transportId]
    );

    if (vehicles.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Vehicle not found or not active",
      });
    }

    const vehicle = vehicles[0];

    // Get farmer's address for pickup
    const [farmerDetails] = await connection.query(
      `SELECT u.address as pickup_address
       FROM farmers f
       JOIN users u ON f.user_id = u.user_id
       WHERE f.farmer_id = ?`,
      [farmerId]
    );

    const pickupAddress = farmerDetails[0].pickup_address;

    // Check if delivery record already exists
    const [existingDelivery] = await connection.query(
      "SELECT delivery_id FROM deliveries WHERE order_id = ?",
      [orderId]
    );

    let deliveryId;

    if (existingDelivery.length > 0) {
      // Update existing delivery
      deliveryId = existingDelivery[0].delivery_id;

      await connection.query(
        `UPDATE deliveries
         SET transport_id = ?,
             vehicle_id = ?,
             pickup_address = ?,
             delivery_status = 'assigned',
             assigned_date = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE delivery_id = ?`,
        [transportId, vehicleId, pickupAddress, deliveryId]
      );
    } else {
      // Create new delivery record
      const deliveryNumber = `DEL${Date.now()}`;

      const [deliveryResult] = await connection.query(
        `INSERT INTO deliveries (
          delivery_number,
          order_id,
          transport_id,
          vehicle_id,
          pickup_address,
          delivery_address,
          delivery_fee,
          delivery_status,
          assigned_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'assigned', CURRENT_TIMESTAMP)`,
        [
          deliveryNumber,
          orderId,
          transportId,
          vehicleId,
          pickupAddress,
          order.delivery_address,
          order.delivery_fee || 0,
        ]
      );

      deliveryId = deliveryResult.insertId;
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Transport provider assigned successfully",
      data: {
        deliveryId,
        orderId,
        transportId,
        vehicleId,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Assign transport error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while assigning transport provider",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

