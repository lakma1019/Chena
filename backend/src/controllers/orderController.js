import { db } from "../config/db.js";
import stripe from "../config/stripe.js";

// ============================================
// CREATE ORDER - Customer creates order with payment
// ============================================
export const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { userId, userType } = req.user;
    const {
      cartItems,
      deliveryAddress,
      deliveryCity,
      deliveryPostalCode,
      paymentMethod,
      stripePaymentMethodId,
    } = req.body;

    console.log('📦 Creating order:', {
      userId,
      userType,
      paymentMethod,
      cartItemsCount: cartItems?.length,
      hasStripePaymentMethod: !!stripePaymentMethodId
    });

    // Validate user is a customer
    if (userType !== "customer") {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Only customers can create orders",
      });
    }

    // Validate required fields
    if (!cartItems || cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!deliveryAddress || !paymentMethod) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Delivery address and payment method are required",
      });
    }

    // Get customer_id from user_id
    const [customers] = await connection.query(
      "SELECT customer_id FROM customers WHERE user_id = ?",
      [userId]
    );

    if (customers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    const customerId = customers[0].customer_id;

    // Calculate order totals
    let subtotal = 0;
    const deliveryFee = 200.00; // Fixed delivery fee

    // Validate cart items and calculate subtotal
    for (const item of cartItems) {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1;
      subtotal += price * quantity;
    }

    const totalAmount = subtotal + deliveryFee;
    const platformFee = subtotal * 0.05; // 5% platform commission

    // Generate order number
    const orderNumber = `ORD${Date.now()}`;

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        order_number, customer_id, delivery_address, delivery_city, 
        delivery_postal_code, subtotal, delivery_fee, total_amount, 
        payment_method, payment_status, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customerId,
        deliveryAddress,
        deliveryCity || null,
        deliveryPostalCode || null,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod,
        (paymentMethod === 'Stripe' || paymentMethod === 'Online Payment') ? 'paid' : 'pending',
        'pending'
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items and track farmer totals
    const farmerTotals = {};

    for (const item of cartItems) {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1;
      const itemSubtotal = price * quantity;

      await connection.query(
        `INSERT INTO order_items (
          order_id, farmer_product_id, product_name, quantity, 
          weight_unit, unit_price, subtotal, farmer_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.farmerProductId,
          item.name,
          quantity,
          item.weight,
          price,
          itemSubtotal,
          item.farmerId
        ]
      );

      // Track farmer totals for payment splits
      if (!farmerTotals[item.farmerId]) {
        farmerTotals[item.farmerId] = 0;
      }
      farmerTotals[item.farmerId] += itemSubtotal;
    }

    // Create transaction record if online payment
    let stripePaymentIntentId = null;

    if (paymentMethod === 'Stripe' && stripePaymentMethodId) {
      // Check if Stripe is configured
      if (!stripe) {
        await connection.rollback();
        return res.status(500).json({
          success: false,
          message: "Stripe is not configured. Please contact administrator.",
        });
      }

      // Process Stripe payment
      try {
        // For testing: Use 'usd' if you selected US as country, or 'lkr' for Singapore/India
        // 1 USD ≈ 300 LKR (approximate conversion for testing)
        const currency = process.env.STRIPE_CURRENCY || 'lkr'; // Default: LKR
        const amount = currency === 'usd'
          ? Math.round((totalAmount / 300) * 100) // Convert LKR to USD cents
          : Math.round(totalAmount * 100); // LKR cents

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: currency,
          payment_method: stripePaymentMethodId,
          confirm: true,
          description: `Order ${orderNumber} - Chena Agricultural Platform`,
          metadata: {
            order_id: orderId.toString(),
            order_number: orderNumber,
            customer_id: customerId.toString(),
            original_amount_lkr: totalAmount.toString(),
          },
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/customer-dashboard?tab=orders`,
        });

        stripePaymentIntentId = paymentIntent.id;

        // Create transaction record
        const transactionNumber = `TXN${Date.now()}`;

        const [transactionResult] = await connection.query(
          `INSERT INTO transactions (
            transaction_number, order_id, customer_id, payment_gateway,
            gateway_transaction_id, total_amount, products_amount,
            delivery_fee, platform_fee, transaction_status,
            payment_method_type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            transactionNumber,
            orderId,
            customerId,
            'Stripe',
            paymentIntent.id,
            totalAmount,
            subtotal,
            deliveryFee,
            platformFee,
            'completed',
            'Credit/Debit Card'
        ]
      );

        const transactionId = transactionResult.insertId;

        // Create farmer payment splits
        for (const [farmerId, farmerSubtotal] of Object.entries(farmerTotals)) {
          const commission = farmerSubtotal * 0.05; // 5% commission
          const netAmount = farmerSubtotal - commission;

          await connection.query(
            `INSERT INTO farmer_transaction_splits (
              transaction_id, order_id, farmer_id, products_subtotal,
              platform_commission, farmer_net_amount, payout_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              transactionId,
              orderId,
              parseInt(farmerId),
              farmerSubtotal,
              commission,
              netAmount,
              'pending'
            ]
          );
        }
      } catch (stripeError) {
        await connection.rollback();
        console.error('Stripe payment error:', stripeError);
        return res.status(400).json({
          success: false,
          message: `Payment failed: ${stripeError.message}`,
        });
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId,
        orderNumber,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod,
        paymentStatus: (paymentMethod === 'Stripe' || paymentMethod === 'Online Payment') ? 'paid' : 'pending',
        stripePaymentIntentId,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// ============================================
// GET CUSTOMER ORDERS - Get all orders for logged-in customer
// ============================================
export const getCustomerOrders = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    // Validate user is a customer
    if (userType !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can view orders",
      });
    }

    // Get customer_id from user_id
    const [customers] = await db.query(
      "SELECT customer_id FROM customers WHERE user_id = ?",
      [userId]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    const customerId = customers[0].customer_id;

    // Get all orders for this customer
    const [orders] = await db.query(
      `SELECT
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
        o.cancelled_date
      FROM orders o
      WHERE o.customer_id = ?
      ORDER BY o.order_date DESC`,
      [customerId]
    );

    // Get order items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT
          oi.order_item_id,
          oi.product_name,
          oi.quantity,
          oi.weight_unit,
          oi.unit_price,
          oi.subtotal,
          f.farm_name,
          u.full_name as farmer_name
        FROM order_items oi
        JOIN farmers f ON oi.farmer_id = f.farmer_id
        JOIN users u ON f.user_id = u.user_id
        WHERE oi.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
};

// ============================================
// GET ORDER DETAILS - Get specific order details
// ============================================
export const getOrderDetails = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { orderId } = req.params;

    // Get customer_id from user_id
    const [customers] = await db.query(
      "SELECT customer_id FROM customers WHERE user_id = ?",
      [userId]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    const customerId = customers[0].customer_id;

    // Get order details
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE order_id = ? AND customer_id = ?`,
      [orderId, customerId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.query(
      `SELECT
        oi.*,
        f.farm_name,
        u.full_name as farmer_name
      FROM order_items oi
      JOIN farmers f ON oi.farmer_id = f.farmer_id
      JOIN users u ON f.user_id = u.user_id
      WHERE oi.order_id = ?`,
      [orderId]
    );

    order.items = items;

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching order details",
      error: error.message,
    });
  }
};

