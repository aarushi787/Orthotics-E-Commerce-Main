// server/src/routes/products.js
const express = require("express");
const router = express.Router();
const admin = require("../config/firebase.cjs");

const db = admin.firestore();
const bucket = admin.storage().bucket();

// --------- FETCH IMAGE URLS FROM FIREBASE STORAGE ----------
async function getImageUrls(folder) {
  if (!folder) return []; // avoid crash

  try {
    const [files] = await bucket.getFiles({ prefix: `images/${folder}/` });

    const urls = await Promise.all(
      files.map(file =>
        file.getSignedUrl({
          action: "read",
          expires: "03-09-3030"
        }).then(url => url[0])
      )
    );

    return urls;
  } catch (err) {
    console.log("❌ Firebase image fetch error:", folder, err.message);
    return [];
  }
}

// ------------- API: GET ALL PRODUCTS WITH IMAGES --------------
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      console.log("📌 Fetching images for:", data.sku);
      data.images = await getImageUrls(data.sku); // SKU = folder name

      products.push(data);
    }

    return res.json({ success: true, products });

  } catch (error) {
    console.error("🚨 /api/products ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
