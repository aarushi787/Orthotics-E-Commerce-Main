const admin = require("../config/firebase.cjs");
const fs = require("fs");
const path = require("path");

const db = admin.firestore();
const bucket = admin.storage().bucket();

const IMAGES_DIR = path.join(__dirname, "../../../images");

async function generateUrl(storagePath) {
  const file = bucket.file(storagePath);
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-01-2030"
  });
  return url;
}

async function createProducts() {
  const categories = fs.readdirSync(IMAGES_DIR);

  for (const category of categories) {
    const categoryPath = path.join(IMAGES_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      const storagePath = `products/${category}/${file}`;
      const imageUrl = await generateUrl(storagePath);

      const productName = file.replace(/\.[^.]+$/, "");

      const productData = {
        name: productName,
        category,
        price: Math.floor(Math.random() * 5000) + 1000,
        image: imageUrl,
        createdAt: Date.now(),
      };

      await db.collection("products").add(productData);

      console.log("Added product:", productName);
    }
  }

  console.log("🔥 All products inserted!");
}

createProducts().catch(console.error);
