const { admin, db } = require("../src/firebase");
const fs = require("fs");
const path = require("path");

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "products.json"), "utf8")
);

async function importProducts() {
  console.log("🔥 Importing products...");

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await db.collection("products").doc(slug).set({
      ...p,
      slug,
      createdAt: new Date(),
    });

    console.log("✔️ Added:", p.name);
  }

  console.log("🎉 Import completed!");
  process.exit(0);
}

importProducts().catch((err) => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});
