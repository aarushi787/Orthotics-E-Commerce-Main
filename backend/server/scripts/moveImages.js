const fs = require("fs");
const path = require("path");

const PRODUCTS_JSON = path.join(__dirname, "..", "..", "products.json");
const IMAGES_ROOT = path.join(__dirname, "..", "..", "images", "products");

function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

console.log("📄 Loading products:", PRODUCTS_JSON);

const raw = fs.readFileSync(PRODUCTS_JSON, "utf8");
const products = JSON.parse(raw);

products.forEach((product) => {
  const folderName = slugify(product.name);
  const targetFolder = path.join(IMAGES_ROOT, folderName);

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
    console.log("📁 Created:", targetFolder);
  }

  const backupUrls = product.imageUrls || [];

  backupUrls.forEach((img) => {
    const fileName = path.basename(img);
    const oldPath = path.join(__dirname, "..", "..", "images", fileName);
    const newPath = path.join(targetFolder, fileName);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`🔄 Moved ${fileName} -> ${targetFolder}`);
    } else {
      console.log(`⚠ Missing file: ${oldPath}`);
    }
  });
});

console.log("✅ Image moving complete!");
