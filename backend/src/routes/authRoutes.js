import express from "express";
import { signup, login, resetPassword, getCurrentUser, refreshToken } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/signup - Register new user
router.post("/signup", signup);

// POST /api/auth/login - Login user
router.post("/login", login);

// POST /api/auth/reset-password - Reset password
router.post("/reset-password", resetPassword);

// GET /api/auth/me - Get current logged in user (protected route)
router.get("/me", authenticateToken, getCurrentUser);

// POST /api/auth/refresh - Refresh access token
router.post("/refresh", refreshToken);

export default router;

