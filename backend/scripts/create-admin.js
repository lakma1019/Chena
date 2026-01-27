import { db } from "../src/config/db.js";
import bcrypt from "bcrypt";

async function createAdminUser() {
  try {
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin@123";

    console.log("🔍 Checking for existing admin user...");

    // Check if admin exists with new email
    const [existingAdmin] = await db.query(
      "SELECT * FROM users WHERE email = ? AND user_type = ?",
      [ADMIN_EMAIL, "admin"]
    );

    // Also check for old admin email
    const [oldAdmin] = await db.query(
      "SELECT * FROM users WHERE email = ? AND user_type = ?",
      ["admin@chena.com", "admin"]
    );

    // Hash the password with Node.js bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    if (existingAdmin.length > 0) {
      console.log("✅ Admin user already exists!");
      console.log("📧 Email:", existingAdmin[0].email);
      console.log("👤 Name:", existingAdmin[0].full_name);
      console.log("🔒 Updating password...");

      // Update the password
      await db.query(
        "UPDATE users SET password_hash = ? WHERE user_id = ?",
        [passwordHash, existingAdmin[0].user_id]
      );

      console.log("✅ Password updated successfully!");
    } else if (oldAdmin.length > 0) {
      console.log("✅ Found old admin user. Updating email and password...");

      // Update email and password
      await db.query(
        "UPDATE users SET email = ?, password_hash = ? WHERE user_id = ?",
        [ADMIN_EMAIL, passwordHash, oldAdmin[0].user_id]
      );

      console.log("✅ Admin user updated successfully!");
    } else {
      console.log("❌ Admin user not found. Creating new admin user...");

      // Create admin user
      await db.query(
        `INSERT INTO users (email, password_hash, user_type, full_name, phone, nic, address, is_verified, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ADMIN_EMAIL,
          passwordHash,
          "admin",
          "System Administrator",
          "+94 11 234 5678",
          "197012345678",
          "Chena Head Office, Colombo 07",
          true,
          true,
        ]
      );

      console.log("✅ Admin user created successfully!");
    }

    console.log("\n🔐 Admin Credentials:");
    console.log("   Email:", ADMIN_EMAIL);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("   User Type: admin");
    console.log("\n🌐 Login URL: http://localhost:3000/login/admin-login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdminUser();

