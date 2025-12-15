import { db } from "../config/db.js";
import { generateImagePath } from "../utils/imagePathGenerator.js";

// ============================================
// ADD PRODUCT - Farmer adds product to inventory
// ============================================
export const addProduct = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { catalogId, quantityAvailable, price, weightUnit } = req.body;

    // Validate user is a farmer
    if (userType !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can add products",
      });
    }

    // Validate required fields
    if (!catalogId || !quantityAvailable || !price || !weightUnit) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: catalogId, quantityAvailable, price, weightUnit",
      });
    }

    // Get farmer_id from user_id
    const [farmers] = await db.query(
      "SELECT farmer_id FROM farmers WHERE user_id = ?",
      [userId]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    const farmerId = farmers[0].farmer_id;

    // Check if product already exists for this farmer
    const [existingProducts] = await db.query(
      "SELECT * FROM farmer_products WHERE farmer_id = ? AND catalog_id = ?",
      [farmerId, catalogId]
    );

    if (existingProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already added this product. Please edit it instead.",
      });
    }

    // Insert product into farmer_products
    const [result] = await db.query(
      `INSERT INTO farmer_products (farmer_id, catalog_id, quantity_available, price, weight_unit, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [farmerId, catalogId, quantityAvailable, price, weightUnit]
    );

    res.status(201).json({
      success: true,
      message: "Product added to inventory successfully",
      data: {
        farmerProductId: result.insertId,
        farmerId,
        catalogId,
        quantityAvailable,
        price,
        weightUnit,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product",
      error: error.message,
    });
  }
};

// ============================================
// GET FARMER PRODUCTS - Get all products for logged-in farmer
// ============================================
export const getFarmerProducts = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    // Validate user is a farmer
    if (userType !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can access this resource",
      });
    }

    // Get farmer_id from user_id
    const [farmers] = await db.query(
      "SELECT farmer_id FROM farmers WHERE user_id = ?",
      [userId]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    const farmerId = farmers[0].farmer_id;

    // Get all products for this farmer with catalog details
    const [products] = await db.query(
      `SELECT
        fp.farmer_product_id,
        fp.farmer_id,
        fp.catalog_id,
        fp.quantity_available,
        fp.price,
        fp.weight_unit,
        fp.status,
        fp.created_at,
        fp.updated_at,
        pc.product_name,
        pc.category,
        pc.standard_weight,
        pc.description
      FROM farmer_products fp
      JOIN product_catalog pc ON fp.catalog_id = pc.catalog_id
      WHERE fp.farmer_id = ?
      ORDER BY fp.created_at DESC`,
      [farmerId]
    );

    // Add image_url dynamically
    const productsWithImages = products.map(product => ({
      ...product,
      image_url: generateImagePath(product.product_name, product.category)
    }));

    res.status(200).json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    console.error("Get farmer products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE PRODUCT - Farmer updates product price/quantity
// ============================================
export const updateProduct = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { farmerProductId } = req.params;
    const { quantityAvailable, price, status } = req.body;

    // Validate user is a farmer
    if (userType !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can update products",
      });
    }

    // Get farmer_id from user_id
    const [farmers] = await db.query(
      "SELECT farmer_id FROM farmers WHERE user_id = ?",
      [userId]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    const farmerId = farmers[0].farmer_id;

    // Verify product belongs to this farmer
    const [products] = await db.query(
      "SELECT * FROM farmer_products WHERE farmer_product_id = ? AND farmer_id = ?",
      [farmerProductId, farmerId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission to update it",
      });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (quantityAvailable !== undefined) {
      updates.push("quantity_available = ?");
      values.push(quantityAvailable);
    }

    if (price !== undefined) {
      updates.push("price = ?");
      values.push(price);
    }

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(farmerProductId);

    await db.query(
      `UPDATE farmer_products SET ${updates.join(", ")} WHERE farmer_product_id = ?`,
      values
    );

    // Get updated product
    const [updatedProduct] = await db.query(
      `SELECT
        fp.farmer_product_id,
        fp.farmer_id,
        fp.catalog_id,
        fp.quantity_available,
        fp.price,
        fp.weight_unit,
        fp.status,
        fp.updated_at,
        pc.product_name,
        pc.category,
        pc.image_url
      FROM farmer_products fp
      JOIN product_catalog pc ON fp.catalog_id = pc.catalog_id
      WHERE fp.farmer_product_id = ?`,
      [farmerProductId]
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct[0],
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: error.message,
    });
  }
};

// ============================================
// DELETE PRODUCT - Farmer deletes product from inventory
// ============================================
export const deleteProduct = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const { farmerProductId } = req.params;

    // Validate user is a farmer
    if (userType !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can delete products",
      });
    }

    // Get farmer_id from user_id
    const [farmers] = await db.query(
      "SELECT farmer_id FROM farmers WHERE user_id = ?",
      [userId]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    const farmerId = farmers[0].farmer_id;

    // Verify product belongs to this farmer
    const [products] = await db.query(
      "SELECT * FROM farmer_products WHERE farmer_product_id = ? AND farmer_id = ?",
      [farmerProductId, farmerId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission to delete it",
      });
    }

    // Delete product
    await db.query(
      "DELETE FROM farmer_products WHERE farmer_product_id = ?",
      [farmerProductId]
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
      error: error.message,
    });
  }
};

// ============================================
// GET ALL PRODUCTS WITH MINIMUM PRICE - For home page display
// ============================================
export const getAllProductsWithMinPrice = async (req, res) => {
  try {
    // Get all products from catalog, with minimum price if available
    const [products] = await db.query(
      `SELECT
        pc.catalog_id,
        pc.product_name,
        pc.category,
        pc.standard_weight,
        pc.description,
        pc.suggested_price,
        MIN(fp.price) as min_price,
        COUNT(DISTINCT CASE WHEN fp.status = 'active' AND fp.quantity_available > 0 THEN fp.farmer_id END) as farmer_count,
        SUM(CASE WHEN fp.status = 'active' AND fp.quantity_available > 0 THEN fp.quantity_available ELSE 0 END) as total_quantity
      FROM product_catalog pc
      LEFT JOIN farmer_products fp ON pc.catalog_id = fp.catalog_id
      WHERE pc.is_active = TRUE
      GROUP BY pc.catalog_id, pc.product_name, pc.category, pc.standard_weight, pc.description, pc.suggested_price
      ORDER BY pc.category, pc.product_name`
    );

    // Transform data to include stock status and generate image paths
    const transformedProducts = products.map(product => ({
      ...product,
      image_url: generateImagePath(product.product_name, product.category),
      price: product.min_price || product.suggested_price, // Use min_price if available, else suggested_price
      in_stock: product.total_quantity > 0,
      farmer_count: parseInt(product.farmer_count) || 0,
      total_quantity: parseInt(product.total_quantity) || 0
    }));

    res.status(200).json({
      success: true,
      data: transformedProducts,
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message,
    });
  }
};

// ============================================
// GET PRODUCT DETAILS - Get all farmers selling a specific product
// ============================================
export const getProductDetails = async (req, res) => {
  try {
    const { catalogId } = req.params;

    // Get product catalog details
    const [catalogProducts] = await db.query(
      `SELECT * FROM product_catalog WHERE catalog_id = ? AND is_active = TRUE`,
      [catalogId]
    );

    if (catalogProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = {
      ...catalogProducts[0],
      image_url: generateImagePath(catalogProducts[0].product_name, catalogProducts[0].category)
    };

    // Get all farmers selling this product
    const [farmers] = await db.query(
      `SELECT
        fp.farmer_product_id,
        fp.farmer_id,
        fp.quantity_available,
        fp.price,
        fp.weight_unit,
        f.farm_name,
        u.full_name as farmer_name,
        u.address as farmer_address
      FROM farmer_products fp
      JOIN farmers f ON fp.farmer_id = f.farmer_id
      JOIN users u ON f.user_id = u.user_id
      WHERE fp.catalog_id = ?
        AND fp.status = 'active'
        AND fp.quantity_available > 0
      ORDER BY fp.price ASC`,
      [catalogId]
    );

    res.status(200).json({
      success: true,
      data: {
        product,
        farmers,
        minPrice: farmers.length > 0 ? farmers[0].price : null,
      },
    });
  } catch (error) {
    console.error("Get product details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product details",
      error: error.message,
    });
  }
};

// ============================================
// GET PRODUCT CATALOG - Get all products from catalog
// ============================================
export const getProductCatalog = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT * FROM product_catalog WHERE is_active = TRUE ORDER BY category, product_name`
    );

    // Add image_url dynamically
    const productsWithImages = products.map(product => ({
      ...product,
      image_url: generateImagePath(product.product_name, product.category)
    }));

    res.status(200).json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    console.error("Get product catalog error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product catalog",
      error: error.message,
    });
  }
};

