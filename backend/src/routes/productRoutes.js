import express from "express";
import {
  addProduct,
  getFarmerProducts,
  updateProduct,
  deleteProduct,
  getAllProductsWithMinPrice,
  getProductDetails,
  getProductCatalog,
} from "../controllers/productController.js";
import { authenticateToken, authorizeUserType } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES - No authentication required
// ============================================

// GET /api/products - Get all products with minimum prices (for home page)
router.get("/", getAllProductsWithMinPrice);

// GET /api/products/catalog - Get product catalog
router.get("/catalog", getProductCatalog);

// GET /api/products/:catalogId/details - Get product details with all farmers
router.get("/:catalogId/details", getProductDetails);

// ============================================
// FARMER ROUTES - Authentication required
// ============================================

// GET /api/products/farmer/my-products - Get logged-in farmer's products
router.get("/farmer/my-products", authenticateToken, authorizeUserType(["farmer"]), getFarmerProducts);

// POST /api/products/farmer - Add product to farmer's inventory
router.post("/farmer", authenticateToken, authorizeUserType(["farmer"]), addProduct);

// PUT /api/products/farmer/:farmerProductId - Update farmer's product
router.put("/farmer/:farmerProductId", authenticateToken, authorizeUserType(["farmer"]), updateProduct);

// DELETE /api/products/farmer/:farmerProductId - Delete farmer's product
router.delete("/farmer/:farmerProductId", authenticateToken, authorizeUserType(["farmer"]), deleteProduct);

export default router;

