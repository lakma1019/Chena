import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getOrderDetails,
} from "../controllers/orderController.js";
import { getAvailableTransportProviders } from "../controllers/farmerOrderController.js";
import { authenticateToken, authorizeUserType } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// CUSTOMER ROUTES - Authentication required
// ============================================

// POST /api/orders - Create new order
router.post("/", authenticateToken, authorizeUserType(["customer"]), createOrder);

// GET /api/orders - Get all orders for logged-in customer
router.get("/", authenticateToken, authorizeUserType(["customer"]), getCustomerOrders);

// GET /api/orders/:orderId - Get specific order details
router.get("/:orderId", authenticateToken, authorizeUserType(["customer"]), getOrderDetails);

// GET /api/orders/transport-providers/available - Get all available transport providers for customer checkout
router.get("/transport-providers/available", authenticateToken, authorizeUserType(["customer"]), getAvailableTransportProviders);

export default router;

