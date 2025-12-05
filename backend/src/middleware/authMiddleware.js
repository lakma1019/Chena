import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to verify JWT token and authenticate user
 * Extracts token from Authorization header and verifies it
 * Adds user data to req.user for use in route handlers
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Add user data to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
      fullName: decoded.fullName,
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message || 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to verify user type
 * Use after authenticateToken middleware
 * @param {Array} allowedTypes - Array of allowed user types (e.g., ['farmer', 'admin'])
 */
export const authorizeUserType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Verifies token if present, but doesn't require it
 * Useful for routes that work differently for logged-in vs anonymous users
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        userType: decoded.userType,
        fullName: decoded.fullName,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user data
    next();
  }
};

