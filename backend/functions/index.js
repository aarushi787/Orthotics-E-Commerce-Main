const functions = require("firebase-functions");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// Create a simple Express app for the API
const app = express();
app.use(cors());
app.use(express.json());

// Simple products endpoint - reads from products.json
app.get("/api/products", (req, res) => {
  try {
    const productsPath = path.join(__dirname, "products.json");
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
      return res.json({ success: true, products });
    }
    return res.status(404).json({ success: false, message: "Products not found", products: [] });
  } catch (err) {
    console.error("Error loading products:", err);
    return res.status(500).json({ success: false, message: err.message, products: [] });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "running" });
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
