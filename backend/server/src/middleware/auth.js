// const admin = require("../config/firebase");

// // Verify Firebase ID Token from frontend
// async function verifyFirebaseToken(req, res, next) {
//   const header = req.headers.authorization;

//   if (!header || !header.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const idToken = header.split(" ")[1];

//   try {
//     const decoded = await admin.auth().verifyIdToken(idToken);
//     req.user = decoded; // contains uid, email, admin flag (if added)
//     next();
//   } catch (err) {
//     console.error("Firebase Auth Error:", err.message);
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }

// // Allow only admin users (Firebase custom claims)
// function requireAdmin(req, res, next) {
//   if (!req.user || req.user.admin !== true) {
//     return res.status(403).json({ error: "Admin access required" });
//   }
//   next();
// }

// module.exports = { verifyFirebaseToken, requireAdmin };

// server/src/middleware/auth.js
const admin = require("../config/firebase.cjs");

async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const idToken = header.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err.message || err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.admin !== true) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = { verifyFirebaseToken, requireAdmin };
