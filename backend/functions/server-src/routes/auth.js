// server/src/routes/auth.js
const express = require("express");
const { verifyFirebaseToken } = require("../middleware/auth");
const { getProfile } = require("../controllers/authController"); // ensure this exists

const router = express.Router();

// example protected profile route
router.get("/profile", verifyFirebaseToken, getProfile);

module.exports = router;
