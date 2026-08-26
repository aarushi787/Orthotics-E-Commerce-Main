const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Correct path → inside /server/
const serviceAccount = require(path.join(__dirname, "..", "serviceAccountKey.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load products.json from project root
const productsPath = path.join(__dirname, "..", "..", "products.json");
const products = JSON.parse(fs.readFileSync(productsPath));
