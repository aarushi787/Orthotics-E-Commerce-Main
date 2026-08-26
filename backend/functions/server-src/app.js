// server/src/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/firebase.cjs");

const productRoutes = require("./routes/products.js");
const adminProductRoutes = require("./routes/adminProducts.js");
const authRoutes = require("./routes/auth.js");
const reviewRoutes = require("./routes/reviewRoutes.js");

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use("/api/products", productRoutes);
  app.use("/api/admin", adminProductRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/reviews", reviewRoutes);

  app.get("/health", (_, res) => res.json({ status: "running" }));

  // Additional health endpoint accessible via hosting rewrite (/api/health)
  app.get("/api/health", (_, res) =>
    res.json({
      status: "running",
      env: process.env.NODE_ENV || "unknown",
      time: new Date().toISOString(),
    })
  );

  return app;
};

module.exports = createApp;
