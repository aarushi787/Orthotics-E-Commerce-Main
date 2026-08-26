const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductImages
} = require("../controllers/imagesController");

// GET /api/images → list product folders
router.get("/", getAllProducts);

// GET /api/images/:productName → list images from one product folder
router.get("/:productName", getProductImages);

module.exports = router;
