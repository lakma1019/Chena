import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Chena Backend is Running 🚜");
});

// Sample: Get all farmers
app.get("/farmers", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM farmers");
  res.json(rows);
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Backend running on port ${process.env.PORT}`)
);
