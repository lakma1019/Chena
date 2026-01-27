import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  updateUserProfile,
  deleteUser,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";
import { authenticateToken, authorizeUserType } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin user type
router.use(authenticateToken);
router.use(authorizeUserType(["admin"]));

// ============================================
// DASHBOARD ROUTES
// ============================================

// GET /api/admin/dashboard/stats - Get dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// GET /api/admin/users - Get all users with filters
router.get("/users", getAllUsers);

// PUT /api/admin/users/:userId/status - Update user status (activate/deactivate)
router.put("/users/:userId/status", updateUserStatus);

// PUT /api/admin/users/:userId/profile - Update user profile
router.put("/users/:userId/profile", updateUserProfile);

// DELETE /api/admin/users/:userId - Delete user
router.delete("/users/:userId", deleteUser);

// ============================================
// PRODUCT MANAGEMENT ROUTES
// ============================================

// GET /api/admin/products - Get all products
router.get("/products", getAllProducts);

// ============================================
// ORDER MANAGEMENT ROUTES
// ============================================

// GET /api/admin/orders - Get all orders with filters
router.get("/orders", getAllOrders);

// PUT /api/admin/orders/:orderId/status - Update order status
router.put("/orders/:orderId/status", updateOrderStatus);

export default router;

