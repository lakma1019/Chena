import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateTokens, verifyToken } from "../utils/jwt.js";

// ============================================
// SIGNUP - Register new user
// ============================================
export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      fullName,
      phone,
      nic,
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
      // Transport specific (city and postalCode already covered)
    } = req.body;

    // Validate required fields
    if (!email || !password || !userType || !fullName || !phone || !nic || !address) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate user type
    const validUserTypes = ["farmer", "customer", "transport"];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type. Must be farmer, customer, or transport",
      });
    }

    // Check if email already exists
    const [existingEmail] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if NIC already exists
    const [existingNIC] = await db.query(
      "SELECT user_id FROM users WHERE nic = ?",
      [nic]
    );

    if (existingNIC.length > 0) {
      return res.status(409).json({
        success: false,
        message: "NIC already registered",
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert into users table
    const [userResult] = await db.query(
      `INSERT INTO users (email, password_hash, user_type, full_name, phone, nic, address, is_verified, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, TRUE)`,
      [email, passwordHash, userType, fullName, phone, nic, address]
    );

    const userId = userResult.insertId;

    // Insert into specific user type table
    if (userType === "farmer") {
      await db.query(
        `INSERT INTO farmers (user_id, farm_name, farm_size, farm_type, bank_account, bank_name, branch)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, farmName || "", farmSize || null, farmType || null, bankAccount || null, bankName || null, branch || null]
      );
    } else if (userType === "customer") {
      await db.query(
        `INSERT INTO customers (user_id, city, postal_code)
         VALUES (?, ?, ?)`,
        [userId, city || null, postalCode || null]
      );
    } else if (userType === "transport") {
      await db.query(
        `INSERT INTO transport_providers (user_id, city, postal_code)
         VALUES (?, ?, ?)`,
        [userId, city || null, postalCode || null]
      );
    }

    // Generate JWT tokens
    const tokens = generateTokens({
      user_id: userId,
      email,
      user_type: userType,
      full_name: fullName,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId,
        email,
        userType,
        fullName,
      },
      ...tokens,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// ============================================
// LOGIN - Authenticate user
// ============================================
export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and user type are required",
      });
    }

    // Get user from database
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND user_type = ?",
      [email, userType]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Get additional user details based on user type
    let additionalData = {};

    if (userType === "farmer") {
      const [farmers] = await db.query(
        "SELECT * FROM farmers WHERE user_id = ?",
        [user.user_id]
      );
      if (farmers.length > 0) {
        additionalData = farmers[0];
      }
    } else if (userType === "customer") {
      const [customers] = await db.query(
        "SELECT * FROM customers WHERE user_id = ?",
        [user.user_id]
      );
      if (customers.length > 0) {
        additionalData = customers[0];
      }
    } else if (userType === "transport") {
      const [transports] = await db.query(
        "SELECT * FROM transport_providers WHERE user_id = ?",
        [user.user_id]
      );
      if (transports.length > 0) {
        additionalData = transports[0];
      }
    }

    // Generate JWT tokens
    const tokens = generateTokens(user);

    // Return user data (excluding password hash) with JWT tokens
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.user_id,
        email: user.email,
        userType: user.user_type,
        fullName: user.full_name,
        phone: user.phone,
        nic: user.nic,
        address: user.address,
        isVerified: user.is_verified,
        ...additionalData,
      },
      ...tokens,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// ============================================
// RESET PASSWORD - Update user password
// ============================================
export const resetPassword = async (req, res) => {
  try {
    const { email, nic, newPassword, userType } = req.body;

    // Validate required fields
    if (!email || !nic || !newPassword || !userType) {
      return res.status(400).json({
        success: false,
        message: "Email, NIC, new password, and user type are required",
      });
    }

    // Validate password strength (minimum 6 characters)
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user by email, NIC, and user type
    const [users] = await db.query(
      "SELECT user_id FROM users WHERE email = ? AND nic = ? AND user_type = ?",
      [email, nic, userType]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with the provided email and NIC",
      });
    }

    const userId = users[0].user_id;

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.query(
      "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
      [passwordHash, userId]
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
      error: error.message,
    });
  }
};

// ============================================
// GET CURRENT USER - Get logged in user data
// ============================================
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const { userId, userType } = req.user;

    // Get user from database
    const [users] = await db.query(
      "SELECT user_id, email, user_type, full_name, phone, nic, address, is_verified, is_active FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // Get additional user details based on user type
    let additionalData = {};

    if (userType === "farmer") {
      const [farmers] = await db.query(
        "SELECT * FROM farmers WHERE user_id = ?",
        [userId]
      );
      if (farmers.length > 0) {
        additionalData = farmers[0];
      }
    } else if (userType === "customer") {
      const [customers] = await db.query(
        "SELECT * FROM customers WHERE user_id = ?",
        [userId]
      );
      if (customers.length > 0) {
        additionalData = customers[0];
      }
    } else if (userType === "transport") {
      const [transports] = await db.query(
        "SELECT * FROM transport_providers WHERE user_id = ?",
        [userId]
      );
      if (transports.length > 0) {
        additionalData = transports[0];
      }
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user.user_id,
        email: user.email,
        userType: user.user_type,
        fullName: user.full_name,
        phone: user.phone,
        nic: user.nic,
        address: user.address,
        isVerified: user.is_verified,
        isActive: user.is_active,
        ...additionalData,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user data",
      error: error.message,
    });
  }
};

// ============================================
// REFRESH TOKEN - Generate new access token
// ============================================
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // Get user from database to ensure they still exist and are active
    const [users] = await db.query(
      "SELECT user_id, email, user_type, full_name, is_active FROM users WHERE user_id = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      ...tokens,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({
      success: false,
      message: error.message || "Invalid or expired refresh token",
    });
  }
};

