/**
 * Run using:
 * node scripts/uploadProducts.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load serviceAccount key
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✔ Correct dynamic path (no hardcoding)
const filePath = path.join(__dirname, "../products.json");

async function uploadProducts() {
  try {
    console.log("🔥 Deleting old product data...");
    const productsRef = db.collection("products");

    // Delete all previous docs
    const snapshot = await productsRef.get();
    const batchDelete = db.batch();

    snapshot.forEach((doc) => batchDelete.delete(doc.ref));

    await batchDelete.commit();
    console.log("✔ Old products deleted.");

    console.log("📄 Reading products.json...");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

    console.log(`📦 Uploading ${products.length} products...`);
    const batch = db.batch();

    products.forEach((product) => {
      const docRef = productsRef.doc(String(product.id)); // product.id = Firestore doc ID
      batch.set(docRef, product);
    });

    await batch.commit();
    console.log("🎉 SUCCESS! All products uploaded to Firestore.");

  } catch (err) {
    console.error("❌ ERROR:", err);
  }
}

uploadProducts();
