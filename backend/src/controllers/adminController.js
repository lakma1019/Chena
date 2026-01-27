import { db } from "../config/db.js";

// ============================================
// DASHBOARD STATISTICS
// ============================================
export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const [userStats] = await db.query(`
      SELECT 
        COUNT(CASE WHEN user_type = 'farmer' THEN 1 END) as total_farmers,
        COUNT(CASE WHEN user_type = 'customer' THEN 1 END) as total_customers,
        COUNT(CASE WHEN user_type = 'transport' THEN 1 END) as total_transport,
        COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as total_admins,
        COUNT(*) as total_users
      FROM users
    `);

    const [productStats] = await db.query(`
      SELECT COUNT(*) as total_products FROM farmer_products
    `);

    const [orderStats] = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(total_amount) as total_revenue
      FROM orders
    `);

    const [recentOrders] = await db.query(`
      SELECT 
        o.order_id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        u.full_name as customer_name,
        u.email as customer_email
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        users: userStats[0],
        products: productStats[0],
        orders: orderStats[0],
        recentOrders: recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================
export const getAllUsers = async (req, res) => {
  try {
    const { userType, status, search } = req.query;

    let query = `
      SELECT
        u.user_id,
        u.email,
        u.user_type,
        u.full_name,
        u.phone,
        u.nic,
        u.address,
        u.is_verified,
        u.is_active,
        u.created_at,
        f.farm_name,
        f.farm_size,
        f.farm_size_unit,
        f.farm_type,
        f.bank_account,
        f.bank_name,
        f.branch,
        c.city as customer_city,
        c.postal_code as customer_postal_code,
        tp.city as transport_city,
        tp.postal_code as transport_postal_code
      FROM users u
      LEFT JOIN farmers f ON u.user_id = f.user_id
      LEFT JOIN customers c ON u.user_id = c.user_id
      LEFT JOIN transport_providers tp ON u.user_id = tp.user_id
      WHERE 1=1
    `;

    const params = [];

    if (userType && userType !== 'all') {
      query += ` AND u.user_type = ?`;
      params.push(userType);
    }

    if (status === 'active') {
      query += ` AND u.is_active = TRUE`;
    } else if (status === 'inactive') {
      query += ` AND u.is_active = FALSE`;
    }

    if (search) {
      query += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY u.created_at DESC`;

    const [users] = await db.query(query, params);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// ============================================
// UPDATE USER STATUS
// ============================================
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    await db.query(
      `UPDATE users SET is_active = ? WHERE user_id = ?`,
      [isActive, userId]
    );

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// ============================================
// DELETE USER
// ============================================
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const [user] = await db.query(`SELECT * FROM users WHERE user_id = ?`, [userId]);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin users
    if (user[0].user_type === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Delete user (cascade will handle related records)
    await db.query(`DELETE FROM users WHERE user_id = ?`, [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// ============================================
// GET ALL PRODUCTS (ADMIN VIEW)
// ============================================
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        fp.farmer_product_id,
        fp.quantity_available,
        fp.price,
        fp.weight_unit,
        fp.status,
        fp.created_at,
        pc.product_name,
        pc.category,
        pc.image_url,
        u.full_name as farmer_name,
        u.email as farmer_email,
        f.farm_name
      FROM farmer_products fp
      JOIN product_catalog pc ON fp.catalog_id = pc.catalog_id
      JOIN farmers f ON fp.farmer_id = f.farmer_id
      JOIN users u ON f.user_id = u.user_id
      ORDER BY fp.created_at DESC
    `);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// ============================================
// GET ALL ORDERS (ADMIN VIEW)
// ============================================
export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT
        o.order_id,
        o.order_number,
        o.total_amount,
        o.status,
        o.payment_method,
        o.created_at,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        c.city as customer_city
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
      JOIN customers c ON u.user_id = c.user_id
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ` AND o.status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (o.order_number LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY o.created_at DESC`;

    const [orders] = await db.query(query, params);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// ============================================
// UPDATE ORDER STATUS
// ============================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    await db.query(
      `UPDATE orders SET status = ? WHERE order_id = ?`,
      [status, orderId]
    );

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// ============================================
// UPDATE USER PROFILE (ADMIN)
// ============================================
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      fullName,
      phone,
      address,
      // Farmer specific
      farmName,
      farmSize,
      farmType,
      bankAccount,
      bankName,
      branch,
      // Customer specific
      city,
      postalCode,
    } = req.body;

    console.log("=== ADMIN UPDATE USER PROFILE REQUEST ===");
    console.log("Target User ID:", userId);
    console.log("Request Body:", req.body);

    // Get user type
    const [users] = await db.query(
      "SELECT user_type FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userType = users[0].user_type;

    // Update users table
    const userUpdates = [];
    const userValues = [];

    if (fullName !== undefined && fullName !== null && fullName !== '') {
      userUpdates.push("full_name = ?");
      userValues.push(fullName);
    }
    if (phone !== undefined && phone !== null && phone !== '') {
      userUpdates.push("phone = ?");
      userValues.push(phone);
    }
    if (address !== undefined && address !== null && address !== '') {
      userUpdates.push("address = ?");
      userValues.push(address);
    }

    if (userUpdates.length > 0) {
      userValues.push(userId);
      const userQuery = `UPDATE users SET ${userUpdates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`;
      console.log("User update query:", userQuery, userValues);
      await db.query(userQuery, userValues);
    }

    // Update user-type specific tables
    if (userType === "farmer") {
      // Check if farmer record exists
      const [existingFarmer] = await db.query(
        "SELECT farmer_id FROM farmers WHERE user_id = ?",
        [userId]
      );

      // Parse farm size if provided
      let farmSizeValue = null;
      let farmSizeUnit = "Acre";

      if (farmSize !== undefined && farmSize !== null && farmSize !== '') {
        const match = farmSize.match(/^([\d.]+)\s*(Acre|Perch)?$/i);
        if (match) {
          farmSizeValue = parseFloat(match[1]);
          farmSizeUnit = match[2] ? match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase() : "Acre";
        }
      }

      if (existingFarmer.length === 0) {
        // Create farmer record if it doesn't exist
        await db.query(
          `INSERT INTO farmers (user_id, farm_name, farm_size, farm_size_unit, farm_type, bank_account, bank_name, branch)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            farmName || "My Farm",
            farmSizeValue,
            farmSizeUnit,
            farmType || null,
            bankAccount || null,
            bankName || null,
            branch || null
          ]
        );
      } else {
        // Update existing farmer record
        const farmerUpdates = [];
        const farmerValues = [];

        if (farmName !== undefined && farmName !== null && farmName !== '') {
          farmerUpdates.push("farm_name = ?");
          farmerValues.push(farmName);
        }

        if (farmSizeValue !== null) {
          farmerUpdates.push("farm_size = ?");
          farmerValues.push(farmSizeValue);
          farmerUpdates.push("farm_size_unit = ?");
          farmerValues.push(farmSizeUnit);
        }

        if (farmType !== undefined && farmType !== null && farmType !== '') {
          farmerUpdates.push("farm_type = ?");
          farmerValues.push(farmType);
        }

        if (bankAccount !== undefined && bankAccount !== null && bankAccount !== '') {
          farmerUpdates.push("bank_account = ?");
          farmerValues.push(bankAccount);
        }

        if (bankName !== undefined && bankName !== null && bankName !== '') {
          farmerUpdates.push("bank_name = ?");
          farmerValues.push(bankName);
        }

        if (branch !== undefined && branch !== null && branch !== '') {
          farmerUpdates.push("branch = ?");
          farmerValues.push(branch);
        }

        if (farmerUpdates.length > 0) {
          farmerValues.push(userId);
          const farmerQuery = `UPDATE farmers SET ${farmerUpdates.join(", ")} WHERE user_id = ?`;
          console.log("Farmer update query:", farmerQuery, farmerValues);
          await db.query(farmerQuery, farmerValues);
        }
      }
    } else if (userType === "customer") {
      const customerUpdates = [];
      const customerValues = [];

      if (city !== undefined && city !== null && city !== '') {
        customerUpdates.push("city = ?");
        customerValues.push(city);
      }

      if (postalCode !== undefined && postalCode !== null && postalCode !== '') {
        customerUpdates.push("postal_code = ?");
        customerValues.push(postalCode);
      }

      if (customerUpdates.length > 0) {
        customerValues.push(userId);
        await db.query(
          `UPDATE customers SET ${customerUpdates.join(", ")} WHERE user_id = ?`,
          customerValues
        );
      }
    } else if (userType === "transport") {
      const transportUpdates = [];
      const transportValues = [];

      if (city !== undefined && city !== null && city !== '') {
        transportUpdates.push("city = ?");
        transportValues.push(city);
      }

      if (postalCode !== undefined && postalCode !== null && postalCode !== '') {
        transportUpdates.push("postal_code = ?");
        transportValues.push(postalCode);
      }

      if (transportUpdates.length > 0) {
        transportValues.push(userId);
        await db.query(
          `UPDATE transport_providers SET ${transportUpdates.join(", ")} WHERE user_id = ?`,
          transportValues
        );
      }
    }

    console.log("=== USER PROFILE UPDATED SUCCESSFULLY (ADMIN) ===");
    console.log("User ID:", userId);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};

