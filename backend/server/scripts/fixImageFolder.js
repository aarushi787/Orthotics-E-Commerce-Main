/**
 * Fix Firestore imageFolder → match slug
 * Removes incorrect values and aligns with local folder structure.
 */

const admin = require("firebase-admin");
const path = require("path");

// Load service account
const serviceAccount = require(path.join(__dirname, "..", "serviceAccountKey.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fox-orthotics-e-commerce-f80f0.firebaseio.com",
  });
}

const db = admin.firestore();

const IMAGES_ROOT = path.join(__dirname, "..", "..", "images");
const fs = require("fs");

async function runFix() {
  console.log("🔧 Starting Firestore imageFolder migration…");

  const snapshot = await db.collection("products").get();

  let updates = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    let slug = data.slug;
    let imageFolder = data.imageFolder;

    console.log(`\n📦 Product: ${data.name}`);

    // Generate slug if missing
    if (!slug) {
      slug = data.name
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      console.log(`  ➜ Auto-created slug: ${slug}`);
    }

    const expectedFolder = path.join(IMAGES_ROOT, slug);

    // Check if folder exists locally
    if (!fs.existsSync(expectedFolder)) {
      console.log(`  ⚠ Missing folder: ${expectedFolder}`);
    } else {
      console.log(`  ✔ Folder exists: ${slug}`);
    }

    // Fix imageFolder if needed
    if (!imageFolder || imageFolder !== slug) {
      console.log(`  🔄 Updating imageFolder: "${imageFolder}" ➝ "${slug}"`);
      await db.collection("products").doc(doc.id).update({
        slug,
        imageFolder: slug,
        updatedAt: new Date(),
      });
      updates++;
    } else {
      console.log("  ✔ imageFolder is correct");
    }
  }

  console.log(`\n🎉 Done! Updated ${updates} products.`);
  process.exit(0);
}

runFix();
