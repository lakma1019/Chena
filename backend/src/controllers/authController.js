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
      // Parse farm size to extract numeric value and unit
      let farmSizeValue = null;
      let farmSizeUnit = 'Acre'; // Default unit

      if (farmSize) {
        // Extract numeric value and unit from string like "120 Acre" or "50 Perch"
        const match = farmSize.match(/^([\d.]+)\s*(Acre|Perch|acre|perch)?$/i);
        if (match) {
          farmSizeValue = parseFloat(match[1]);
          if (match[2]) {
            farmSizeUnit = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase(); // Normalize to "Acre" or "Perch"
          }
        }
      }

      await db.query(
        `INSERT INTO farmers (user_id, farm_name, farm_size, farm_size_unit, farm_type, bank_account, bank_name, branch)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, farmName || "", farmSizeValue, farmSizeUnit, farmType || null, bankAccount || null, bankName || null, branch || null]
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
        const farmerData = farmers[0];
        // Combine farm_size and farm_size_unit for frontend compatibility
        if (farmerData.farm_size && farmerData.farm_size_unit) {
          farmerData.farm_size = `${farmerData.farm_size} ${farmerData.farm_size_unit}`;
        }
        additionalData = farmerData;
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
        const farmerData = farmers[0];
        // Combine farm_size and farm_size_unit for frontend compatibility
        if (farmerData.farm_size && farmerData.farm_size_unit) {
          farmerData.farm_size = `${farmerData.farm_size} ${farmerData.farm_size_unit}`;
        }
        additionalData = farmerData;
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

// ============================================
// UPDATE PROFILE - Update user profile information
// ============================================
export const updateProfile = async (req, res) => {
  try {
    const { userId, userType } = req.user;
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

    console.log("=== UPDATE PROFILE REQUEST ===");
    console.log("User ID:", userId);
    console.log("User Type:", userType);
    console.log("Request Body:", req.body);

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

      if (existingFarmer.length === 0) {
        // Create farmer record if it doesn't exist
        console.log("Creating new farmer record for user:", userId);

        // Parse farm size for initial insert
        let farmSizeValue = null;
        let farmSizeUnit = 'Acre';

        if (farmSize) {
          const match = farmSize.match(/^([\d.]+)\s*(Acre|Perch)?$/i);
          if (match) {
            farmSizeValue = parseFloat(match[1]);
            farmSizeUnit = match[2] ? match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase() : 'Acre';
          } else {
            const numericValue = parseFloat(farmSize);
            if (!isNaN(numericValue)) {
              farmSizeValue = numericValue;
            }
          }
        }

        await db.query(
          `INSERT INTO farmers (user_id, farm_name, farm_size, farm_size_unit, farm_type, bank_account, bank_name, branch)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            farmName || "My Farm", // Provide default value since it's NOT NULL
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

        if (farmSize !== undefined && farmSize !== null && farmSize !== '') {
          // Parse farm size (e.g., "120 Acre" -> 120 and "Acre")
          const match = farmSize.match(/^([\d.]+)\s*(Acre|Perch)?$/i);
          console.log("Farm size parsing:", { farmSize, match });

          if (match) {
            farmerUpdates.push("farm_size = ?");
            farmerValues.push(parseFloat(match[1]));

            // Always set unit - default to 'Acre' if not specified
            const unit = match[2] ? match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase() : 'Acre';
            farmerUpdates.push("farm_size_unit = ?");
            farmerValues.push(unit);
          } else {
            // If no match, try to parse as just a number
            const numericValue = parseFloat(farmSize);
            if (!isNaN(numericValue)) {
              farmerUpdates.push("farm_size = ?");
              farmerValues.push(numericValue);
              farmerUpdates.push("farm_size_unit = ?");
              farmerValues.push('Acre'); // Default to Acre
            }
          }
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
      // Check if customer record exists
      const [existingCustomer] = await db.query(
        "SELECT customer_id FROM customers WHERE user_id = ?",
        [userId]
      );

      if (existingCustomer.length === 0) {
        // Create customer record if it doesn't exist
        console.log("Creating new customer record for user:", userId);
        await db.query(
          `INSERT INTO customers (user_id, city, postal_code) VALUES (?, ?, ?)`,
          [userId, city || null, postalCode || null]
        );
      } else {
        // Update existing customer record
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
      }
    } else if (userType === "transport") {
      // Check if transport provider record exists
      const [existingTransport] = await db.query(
        "SELECT transport_id FROM transport_providers WHERE user_id = ?",
        [userId]
      );

      if (existingTransport.length === 0) {
        // Create transport provider record if it doesn't exist
        console.log("Creating new transport provider record for user:", userId);
        await db.query(
          `INSERT INTO transport_providers (user_id, city, postal_code) VALUES (?, ?, ?)`,
          [userId, city || null, postalCode || null]
        );
      } else {
        // Update existing transport provider record
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
    }

    console.log("=== PROFILE UPDATED SUCCESSFULLY ===");
    console.log("User ID:", userId);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("=== UPDATE PROFILE ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};
