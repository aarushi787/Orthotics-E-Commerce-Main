/**
 * RUN:
 *   node scripts/updateImageURLs.js
 *
 * Supports:
 *  ✔ images/SKU/*.jpg
 *  ✔ images/SKU/color/*.jpg
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "e-commerce-61d74.firebasestorage.app"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();


async function getImagesGroupedByFolder(sku) {
  const basePrefix = `images/${sku}/`;
  const folderGroups = {};

  try {
    const [allFiles] = await bucket.getFiles({ prefix: basePrefix });

    if (!allFiles.length) return {};

    for (const file of allFiles) {
      const rel = file.name.replace(basePrefix, ""); // remove SKU path
      if (!rel || rel.endsWith("/")) continue;

      let folder = "default";

      if (rel.includes("/")) {
        folder = rel.split("/")[0]; // first subfolder = color
      }

      if (!folderGroups[folder]) folderGroups[folder] = [];

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2050"
      });

      folderGroups[folder].push(url);
    }

    return folderGroups;

  } catch (err) {
    console.log(`❌ ERROR (${sku}) →`, err.message);
    return {};
  }
}


async function updateFirestoreWithImages() {
  const snap = await db.collection("products").get();

  console.log(`\n📦 Total Products → ${snap.size}\n`);

  for (let doc of snap.docs) {
    const { sku } = doc.data();
    if (!sku) continue;

    const groupedImages = await getImagesGroupedByFolder(sku);

    await doc.ref.update({ images: groupedImages });

    console.log(`✔ ${sku} →`, JSON.stringify(groupedImages));
  }

  console.log("\n🎉 FIRESTORE UPDATED WITH COLOR-WISE IMAGES\n");
  process.exit();
}

updateFirestoreWithImages();
