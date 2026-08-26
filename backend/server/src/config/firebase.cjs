// server/src/config/firebase.cjs
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Find service key file (optional for local dev)
const keyPath = path.join(__dirname, "../../serviceAccountKey.json");

try {
  if (fs.existsSync(keyPath)) {
    // Use explicit service account for local dev or CI when present
    admin.initializeApp({
      credential: admin.credential.cert(require(keyPath)),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "e-commerce-61d74.firebasestorage.app",
    });
    console.log("🔥 Firebase Admin Connected using serviceAccountKey.json (CJS)");
  } else {
    // In Cloud Functions environment prefer default credentials
    admin.initializeApp({
      // storageBucket can be overridden by env in production
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "e-commerce-61d74.firebasestorage.app",
    });
    console.log("🔥 Firebase Admin Connected using default credentials (CJS)");
  }
} catch (err) {
  console.error('Failed to initialize Firebase Admin:', err);
  // rethrow so startup fails loudly in dev, but keep exported admin reference
  throw err;
}

module.exports = admin;
