import { db } from "../config/db.js";

// ============================================
// ADD VEHICLE
// ============================================
/**
 * Adds a new vehicle for the transport provider
 * @route POST /api/transport/vehicles
 * @access Private - Transport provider only
 */
export const addVehicle = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const {
      vehicleType,
      vehicleNumber,
      licenseNumber,
      isVehicleOwner,
      ownerNic,
      ownerPhone,
      ownerAddress,
      pricePerKm
    } = req.body;

    // Validate user is a transport provider
    if (userType !== "transport") {
      return res.status(403).json({
        success: false,
        message: "Only transport providers can add vehicles",
      });
    }

    // Validate required fields
    if (!vehicleType || !vehicleNumber || !licenseNumber || !pricePerKm) {
      return res.status(400).json({
        success: false,
        message: "Vehicle type, number, license number, and price per km are required",
      });
    }

    // Get transport_id from user_id
    const [transportProviders] = await db.query(
      "SELECT transport_id FROM transport_providers WHERE user_id = ?",
      [userId]
    );

    if (transportProviders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transport provider profile not found",
      });
    }

    const transportId = transportProviders[0].transport_id;

    // Check if vehicle number already exists
    const [existingVehicles] = await db.query(
      "SELECT vehicle_id FROM transport_vehicles WHERE vehicle_number = ?",
      [vehicleNumber]
    );

    if (existingVehicles.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number already exists",
      });
    }

    // Insert vehicle
    const [result] = await db.query(
      `INSERT INTO transport_vehicles (
        transport_id,
        vehicle_type,
        vehicle_number,
        license_number,
        is_vehicle_owner,
        owner_nic,
        owner_phone,
        owner_address,
        price_per_km,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        transportId,
        vehicleType,
        vehicleNumber,
        licenseNumber,
        isVehicleOwner,
        ownerNic || null,
        ownerPhone || null,
        ownerAddress || null,
        pricePerKm
      ]
    );

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: {
        vehicleId: result.insertId,
        transportId,
        vehicleType,
        vehicleNumber,
        pricePerKm
      },
    });
  } catch (error) {
    console.error("Add vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding vehicle",
      error: error.message,
    });
  }
};

// ============================================
// GET TRANSPORT PROVIDER VEHICLES
// ============================================
/**
 * Retrieves all vehicles for the logged-in transport provider
 * @route GET /api/transport/vehicles
 * @access Private - Transport provider only
 */
export const getTransportVehicles = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    // Validate user is a transport provider
    if (userType !== "transport") {
      return res.status(403).json({
        success: false,
        message: "Only transport providers can access this resource",
      });
    }

    // Get transport_id from user_id
    const [transportProviders] = await db.query(
      "SELECT transport_id FROM transport_providers WHERE user_id = ?",
      [userId]
    );

    if (transportProviders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transport provider profile not found",
      });
    }

    const transportId = transportProviders[0].transport_id;

    // Get all vehicles for this transport provider
    const [vehicles] = await db.query(
      `SELECT
        vehicle_id,
        vehicle_type,
        vehicle_number,
        license_number,
        is_vehicle_owner,
        owner_nic,
        owner_phone,
        owner_address,
        price_per_km,
        is_active,
        created_at
      FROM transport_vehicles
      WHERE transport_id = ?
      ORDER BY created_at DESC`,
      [transportId]
    );

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching vehicles",
      error: error.message,
    });
  }
};

// ============================================
// GET TRANSPORT PROVIDER DELIVERIES
// ============================================
/**
 * Retrieves all deliveries assigned to the logged-in transport provider
 * @route GET /api/transport/deliveries
 * @access Private - Transport provider only
 */
export const getTransportDeliveries = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    console.log('=== GET TRANSPORT DELIVERIES ===');
    console.log('User ID:', userId);
    console.log('User Type:', userType);

    // Validate user is a transport provider
    if (userType !== "transport") {
      return res.status(403).json({
        success: false,
        message: "Only transport providers can access this resource",
      });
    }

    // Get transport_id from user_id
    const [transportProviders] = await db.query(
      "SELECT transport_id FROM transport_providers WHERE user_id = ?",
      [userId]
    );

    console.log('Transport providers found:', transportProviders);

    if (transportProviders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transport provider profile not found",
      });
    }

    const transportId = transportProviders[0].transport_id;
    console.log('Transport ID:', transportId);

    // Get all deliveries assigned to this transport provider
    const [deliveries] = await db.query(
      `SELECT
        d.delivery_id,
        d.delivery_number,
        d.order_id,
        d.pickup_address,
        d.delivery_address,
        d.distance_km,
        d.delivery_fee,
        d.delivery_status,
        d.special_notes,
        d.assigned_date,
        d.pickup_date,
        d.completed_date,
        o.order_number,
        o.order_date,
        o.total_amount as order_total,
        o.payment_method,
        o.payment_status,
        c.customer_id,
        u.full_name as customer_name,
        u.phone as customer_phone,
        u.address as customer_address,
        tv.vehicle_type,
        tv.vehicle_number,
        tv.price_per_km
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      LEFT JOIN transport_vehicles tv ON d.vehicle_id = tv.vehicle_id
      WHERE d.transport_id = ?
      ORDER BY
        CASE d.delivery_status
          WHEN 'assigned' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'picked_up' THEN 3
          WHEN 'in_transit' THEN 4
          WHEN 'delivered' THEN 5
          WHEN 'completed' THEN 6
          ELSE 7
        END,
        d.assigned_date DESC`,
      [transportId]
    );

    console.log(`Found ${deliveries.length} deliveries for transport_id ${transportId}`);

    // Get order items for each delivery
    for (const delivery of deliveries) {
      const [items] = await db.query(
        `SELECT
          oi.order_item_id,
          oi.product_name,
          oi.quantity,
          oi.weight_unit,
          oi.unit_price,
          oi.subtotal,
          f.farm_name,
          fu.full_name as farmer_name
        FROM order_items oi
        JOIN farmers f ON oi.farmer_id = f.farmer_id
        JOIN users fu ON f.user_id = fu.user_id
        WHERE oi.order_id = ?`,
        [delivery.order_id]
      );
      delivery.items = items;
    }

    console.log('Deliveries with items:', JSON.stringify(deliveries, null, 2));

    res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    console.error("Get transport deliveries error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while fetching deliveries",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE DELIVERY STATUS
// ============================================
/**
 * Updates the delivery status and special notes
 * Statuses: assigned -> in_progress -> delivered
 * @route PUT /api/transport/deliveries/:deliveryId/status
 * @access Private - Transport provider only
 */
export const updateDeliveryStatus = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { userId, userType } = req.user;
    const { deliveryId } = req.params;
    const { status, specialNotes } = req.body;

    // Validate user is a transport provider
    if (userType !== "transport") {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: "Only transport providers can update delivery status",
      });
    }

    // Validate status
    const validStatuses = ['assigned', 'picked_up', 'in_progress', 'in_transit', 'delivered', 'completed'];
    if (!validStatuses.includes(status)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
    }

    // Get transport_id from user_id
    const [transportProviders] = await connection.query(
      "SELECT transport_id FROM transport_providers WHERE user_id = ?",
      [userId]
    );

    if (transportProviders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Transport provider profile not found",
      });
    }

    const transportId = transportProviders[0].transport_id;

    // Verify that this delivery belongs to this transport provider
    const [deliveries] = await connection.query(
      "SELECT * FROM deliveries WHERE delivery_id = ? AND transport_id = ?",
      [deliveryId, transportId]
    );

    if (deliveries.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Delivery not found or not assigned to you",
      });
    }

    const delivery = deliveries[0];

    // Build update query dynamically based on status
    let updateQuery = "UPDATE deliveries SET delivery_status = ?, updated_at = CURRENT_TIMESTAMP";
    let updateParams = [status];

    // Update special notes if provided
    if (specialNotes !== undefined) {
      updateQuery += ", special_notes = ?";
      updateParams.push(specialNotes);
    }

    // Update timestamp fields based on status
    if (status === 'picked_up' && !delivery.pickup_date) {
      updateQuery += ", pickup_date = CURRENT_TIMESTAMP";
    }

    if (status === 'delivered' || status === 'completed') {
      updateQuery += ", completed_date = CURRENT_TIMESTAMP";

      // Also update order status to delivered
      await connection.query(
        "UPDATE orders SET order_status = 'delivered', updated_at = CURRENT_TIMESTAMP WHERE order_id = ?",
        [delivery.order_id]
      );
    }

    updateQuery += " WHERE delivery_id = ?";
    updateParams.push(deliveryId);

    // Execute update
    await connection.query(updateQuery, updateParams);

    // Get updated delivery details
    const [updatedDelivery] = await connection.query(
      `SELECT
        d.*,
        o.order_number,
        u.full_name as customer_name
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      WHERE d.delivery_id = ?`,
      [deliveryId]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      data: updatedDelivery[0],
    });
  } catch (error) {
    await connection.rollback();
    console.error("Update delivery status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating delivery status",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// ============================================
// GET DELIVERY DETAILS
// ============================================
/**
 * Retrieves detailed information about a specific delivery
 * @route GET /api/transport/deliveries/:deliveryId
 * @access Private - Transport provider only
 */
export const getDeliveryDetails = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { deliveryId } = req.params;

    // Validate user is a transport provider
    if (userType !== "transport") {
      return res.status(403).json({
        success: false,
        message: "Only transport providers can access this resource",
      });
    }

    // Get transport_id from user_id
    const [transportProviders] = await db.query(
      "SELECT transport_id FROM transport_providers WHERE user_id = ?",
      [userId]
    );

    if (transportProviders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transport provider profile not found",
      });
    }

    const transportId = transportProviders[0].transport_id;

    // Get delivery details
    const [deliveries] = await db.query(
      `SELECT
        d.*,
        o.order_number,
        o.order_date,
        o.total_amount as order_total,
        o.payment_method,
        o.payment_status,
        c.customer_id,
        u.full_name as customer_name,
        u.phone as customer_phone,
        u.address as customer_address,
        tv.vehicle_type,
        tv.vehicle_number,
        tv.price_per_km
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      LEFT JOIN transport_vehicles tv ON d.vehicle_id = tv.vehicle_id
      WHERE d.delivery_id = ? AND d.transport_id = ?`,
      [deliveryId, transportId]
    );

    if (deliveries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    const delivery = deliveries[0];

    // Get order items
    const [items] = await db.query(
      `SELECT
        oi.order_item_id,
        oi.product_name,
        oi.quantity,
        oi.weight_unit,
        oi.unit_price,
        oi.subtotal,
        f.farm_name,
        fu.full_name as farmer_name
      FROM order_items oi
      JOIN farmers f ON oi.farmer_id = f.farmer_id
      JOIN users fu ON f.user_id = fu.user_id
      WHERE oi.order_id = ?`,
      [delivery.order_id]
    );

    delivery.items = items;

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    console.error("Get delivery details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching delivery details",
      error: error.message,
    });
  }
};

