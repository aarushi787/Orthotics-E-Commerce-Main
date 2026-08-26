/**
 * fixMissingFolders.js
 * ----------------------------------------
 * Creates missing product folders
 * Moves each product's images into the correct folder
 * Follows Firestore product.slug
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Load Firebase
const serviceAccount = require(path.join(__dirname, "..", "serviceAccountKey.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const IMAGES_ROOT = path.join(__dirname, "..", "..", "images");

async function run() {
  console.log("\n🔧 Starting missing-folder fix…\n");

  const snap = await db.collection("products").get();
  let created = 0;
  let moved = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const slug = data.slug;
    const sku = data.sku; // e.g. MDL-101

    const productDir = path.join(IMAGES_ROOT, slug);

    console.log(`📦 ${data.name}`);
    console.log(`   slug: ${slug} | sku: ${sku}`);

    /** STEP 1: Ensure folder exists */
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
      created++;
      console.log(`   📁 Created folder: ${slug}`);
    } else {
      console.log("   ✔ Folder exists");
    }

    /** STEP 2: Move product images based on SKU */
    if (sku) {
      const files = fs.readdirSync(IMAGES_ROOT);
      const matches = files.filter(
        f => f.toLowerCase().includes(sku.toLowerCase()) &&
        /\.(jpg|jpeg|png|webp)$/i.test(f)
      );

      if (matches.length === 0) {
        console.log("   ⚠ No images found by SKU");
        continue;
      }

      matches.forEach(file => {
        const oldPath = path.join(IMAGES_ROOT, file);
        const newPath = path.join(productDir, file);

        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
          moved++;
          console.log(`   📸 Moved: ${file}`);
        } else {
          console.log(`   ⚠ Already exists: ${file}`);
        }
      });
    }

    console.log("");
  }

  console.log("\n🎉 Completed Fix!");
  console.log(`📁 Folders created: ${created}`);
  console.log(`📸 Images moved: ${moved}`);
  process.exit(0);
}

run();
