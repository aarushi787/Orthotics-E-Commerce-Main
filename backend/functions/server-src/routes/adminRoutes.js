const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// Admin login
router.post("/login", adminController.loginAdmin);

// Admin protected routes
router.get("/products", adminAuth, async (req, res) => {
  const products = await req.db.collection("products").get();
  const items = products.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json({ success: true, items });
});

router.get("/orders", adminAuth, async (req, res) => {
  res.json({ message: "Fetch orders logic here" });
});

router.get("/users", adminAuth, async (req, res) => {
  res.json({ message: "Fetch users logic here" });
});

module.exports = router;
