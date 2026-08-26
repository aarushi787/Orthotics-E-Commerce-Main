const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// YOUR Firebase Admin SDK initialization
// const serviceAccount = require("../firebaseServiceAccount.json");
// const path = require("path");
const serviceAccount = require(path.join(__dirname, "..", "serviceAccountKey.json"));


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Path to /images at project root
const IMAGES_ROOT = path.join(__dirname, "..", "..", "images");
console.log("Images root:", IMAGES_ROOT);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function syncImages() {
  try {
    const folders = fs.readdirSync(IMAGES_ROOT, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name);

    for (const folder of folders) {
      const productName = folder;
      const productSlug = slugify(folder);

      console.log("Syncing product:", productName);

      // Add product document
      const productRef = db.collection("products").doc(productSlug);
      await productRef.set({
        name: productName,
        slug: productSlug,
        updatedAt: new Date()
      });

      const productPath = path.join(IMAGES_ROOT, folder);
      const files = fs.readdirSync(productPath)
        .filter(file => fs.statSync(path.join(productPath, file)).isFile());

      for (const fileName of files) {
        const url = `http://localhost:5001/images/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`;
        const imageRef = productRef.collection("images").doc();

        await imageRef.set({
          fileName,
          url,
          createdAt: new Date()
        });

        console.log(" → Added image:", url);
      }

      console.log("✔ Synced:", productName);
    }

    console.log("\n🎉 Sync Complete!");

  } catch (err) {
    console.error("Sync failed:", err);
  }
}

syncImages();
