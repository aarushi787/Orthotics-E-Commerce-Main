const express = require("express");
const Review = require("../models/review.model");

const router = express.Router();

// GET reviews by Product ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Review.getByProductId(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review
router.post("/", async (req, res) => {
  try {
    const saved = await Review.addReview(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
