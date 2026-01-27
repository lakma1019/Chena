import express from "express";
import {
  getFarmerOrders,
  getFarmerAnalytics,
  getAvailableTransportProviders,
  assignTransportToOrder,
} from "../controllers/farmerOrderController.js";
import { authenticateToken, authorizeUserType } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// FARMER ORDER ROUTES - Authentication required
// All routes require farmer authentication
// ============================================

// Apply authentication and authorization middleware to all routes
router.use(authenticateToken);
router.use(authorizeUserType(["farmer"]));

/**
 * GET /api/farmer/analytics
 * Get comprehensive sales analytics and reports for the farmer
 * Returns statistics, sales trends, product performance, and customer distribution
 */
router.get("/analytics", getFarmerAnalytics);

/**
 * GET /api/farmer/orders
 * Get all orders containing the farmer's products
 * Returns orders with customer details and delivery status
 */
router.get("/orders", getFarmerOrders);

/**
 * GET /api/farmer/transport-providers
 * Get all available transport providers with their vehicles and pricing
 * Used when farmer wants to assign transport to an order
 */
router.get("/transport-providers", getAvailableTransportProviders);

/**
 * POST /api/farmer/orders/:orderId/assign-transport
 * Assign a transport provider and vehicle to an order
 * Body: { transportId, vehicleId }
 * Creates or updates delivery record
 */
router.post("/orders/:orderId/assign-transport", assignTransportToOrder);

export default router;

