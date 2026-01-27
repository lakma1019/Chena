import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import farmerOrderRoutes from "./routes/farmerOrderRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Chena Backend is Running 🚜");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmer", farmerOrderRoutes);
app.use("/api/transport", transportRoutes);

// Sample: Get all farmers
app.get("/farmers", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM farmers");
  res.json(rows);
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Backend running on port ${process.env.PORT}`)
);
