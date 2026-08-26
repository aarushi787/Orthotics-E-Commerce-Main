// importProducts.js
const admin = require("firebase-admin");
const { readFileSync } = require("fs");

// Load service account file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Load JSON file (your products list)
const products = JSON.parse(readFileSync("./products.json", "utf-8"));

async function importProducts() {
  console.log("⏳ Importing products...");

  const batch = db.batch();
  const productsCollection = db.collection("products");

  products.forEach(product => {
    const docRef = productsCollection.doc(product.sku); // using sku as ID
    batch.set(docRef, product);
  });

  await batch.commit();

  console.log("✅ Successfully imported products to Firestore!");
}

importProducts();
