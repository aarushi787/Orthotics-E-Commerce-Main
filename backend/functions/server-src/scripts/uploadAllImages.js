const admin = require("../config/firebase.cjs");
const fs = require("fs");
const path = require("path");

const bucket = admin.storage().bucket();

// Root images folder
const IMAGES_DIR = path.join(__dirname, "../../../images");

async function uploadFolder(folderPath, storageBasePath) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const localPath = path.join(folderPath, file);
    const storagePath = `${storageBasePath}/${file}`;

    if (fs.statSync(localPath).isDirectory()) {
      await uploadFolder(localPath, storagePath);
      continue;
    }

    console.log("Uploading:", storagePath);

    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: { contentType: "image/jpeg" }
    });
  }
}

async function startUpload() {
  console.log("🔥 Uploading ALL product images...");
  await uploadFolder(IMAGES_DIR, "products");
  console.log("✅ All images uploaded successfully!");
}

startUpload().catch(console.error);
