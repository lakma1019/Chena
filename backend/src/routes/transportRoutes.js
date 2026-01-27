import express from "express";
import {
  getTransportDeliveries,
  updateDeliveryStatus,
  getDeliveryDetails,
  addVehicle,
  getTransportVehicles,
} from "../controllers/transportController.js";
import { authenticateToken, authorizeUserType } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// TRANSPORT PROVIDER ROUTES - Authentication required
// All routes require transport provider authentication
// ============================================

// Apply authentication and authorization middleware to all routes
router.use(authenticateToken);
router.use(authorizeUserType(["transport"]));

/**
 * POST /api/transport/vehicles
 * Add a new vehicle for the transport provider
 * Body: { vehicleType, vehicleNumber, licenseNumber, isVehicleOwner, ownerNic, ownerPhone, ownerAddress, pricePerKm }
 */
router.post("/vehicles", addVehicle);

/**
 * GET /api/transport/vehicles
 * Get all vehicles for the transport provider
 * Returns list of vehicles with details
 */
router.get("/vehicles", getTransportVehicles);

/**
 * GET /api/transport/deliveries
 * Get all deliveries assigned to the transport provider
 * Returns deliveries with order details, customer info, and items
 */
router.get("/deliveries", getTransportDeliveries);

/**
 * GET /api/transport/deliveries/:deliveryId
 * Get detailed information about a specific delivery
 * Returns full delivery details including order items
 */
router.get("/deliveries/:deliveryId", getDeliveryDetails);

/**
 * PUT /api/transport/deliveries/:deliveryId/status
 * Update delivery status and add special notes
 * Body: { status, specialNotes }
 * Valid statuses: assigned, picked_up, in_progress, in_transit, delivered, completed
 */
router.put("/deliveries/:deliveryId/status", updateDeliveryStatus);

export default router;

