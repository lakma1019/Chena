import { db } from "../src/config/db.js";
import bcrypt from "bcrypt";

async function checkAdminUser() {
  try {
    console.log("🔍 Checking database for admin users...\n");

    // Check for all admin users
    const [adminUsers] = await db.query(
      "SELECT user_id, email, user_type, full_name, is_active, password_hash FROM users WHERE user_type = ?",
      ["admin"]
    );

    if (adminUsers.length === 0) {
      console.log("❌ No admin users found in database!");
      console.log("\n💡 Run this command to create an admin user:");
      console.log("   node scripts/create-admin.js\n");
      process.exit(1);
    }

    console.log(`✅ Found ${adminUsers.length} admin user(s):\n`);

    for (const admin of adminUsers) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`👤 User ID: ${admin.user_id}`);
      console.log(`📧 Email: ${admin.email}`);
      console.log(`👑 User Type: ${admin.user_type}`);
      console.log(`📝 Full Name: ${admin.full_name}`);
      console.log(`✓ Active: ${admin.is_active ? 'Yes' : 'No'}`);
      console.log(`🔒 Password Hash: ${admin.password_hash.substring(0, 20)}...`);
      console.log(`🔑 Hash Type: ${admin.password_hash.substring(0, 4)}`);

      // Test passwords
      console.log("\n🧪 Testing passwords:");
      
      const testPasswords = [
        "password",
        "admin@123",
        "admin123",
        "Password123"
      ];

      for (const testPassword of testPasswords) {
        try {
          const isMatch = await bcrypt.compare(testPassword, admin.password_hash);
          if (isMatch) {
            console.log(`   ✅ "${testPassword}" - MATCH! ✓`);
          } else {
            console.log(`   ❌ "${testPassword}" - No match`);
          }
        } catch (error) {
          console.log(`   ⚠️  "${testPassword}" - Error: ${error.message}`);
        }
      }
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    }

    // Test login with the credentials
    console.log("\n🔐 Testing Login API Logic:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const testEmail = "admin@gmail.com";
    const testPassword = "admin@123";
    
    console.log(`📧 Testing Email: ${testEmail}`);
    console.log(`🔑 Testing Password: ${testPassword}`);
    
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND user_type = ?",
      [testEmail, "admin"]
    );

    if (users.length === 0) {
      console.log(`❌ No user found with email: ${testEmail} and user_type: admin`);
      console.log("\n💡 Available admin emails:");
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.email}`);
      });
    } else {
      const user = users[0];
      console.log(`✅ User found: ${user.full_name}`);
      console.log(`✓ Active: ${user.is_active ? 'Yes' : 'No'}`);
      
      const isPasswordValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`🔒 Password Match: ${isPasswordValid ? '✅ YES' : '❌ NO'}`);
      
      if (isPasswordValid && user.is_active) {
        console.log("\n🎉 LOGIN SHOULD WORK!");
        console.log(`   Email: ${testEmail}`);
        console.log(`   Password: ${testPassword}`);
      } else if (!isPasswordValid) {
        console.log("\n❌ Password does not match!");
        console.log("   Run: node scripts/create-admin.js");
      } else if (!user.is_active) {
        console.log("\n❌ User account is deactivated!");
      }
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

checkAdminUser();

