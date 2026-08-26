// server/src/routes/adminProducts.js
const express = require("express");
const multer = require("multer");
const { verifyFirebaseToken, requireAdmin } = require("../middleware/auth");
const { createProductWithImage } = require("../controllers/productController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// POST /api/admin/products  (protected)
router.post("/products", verifyFirebaseToken, requireAdmin, upload.single("image"), createProductWithImage);

module.exports = router;
