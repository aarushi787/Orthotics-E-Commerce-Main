const fs = require('fs');
const path = require('path');

// FIXED: products.json is in project root, not /server
const INPUT = path.join(__dirname, '..', '..', 'products.json');
const OUTPUT = path.join(__dirname, '..', '..', 'products-updated.json');

function slugify(str) {
  return String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

try {
  console.log("📄 Reading:", INPUT);

  const raw = fs.readFileSync(INPUT, 'utf8');
  const products = JSON.parse(raw);

  const updated = products.map(prod => {
    const base = prod.name || prod.sku || `product-${prod.id}`;
    const folder = `products/${slugify(base)}`;

    const copy = { ...prod };
    if (copy.imageUrls) {
      copy._imageUrls_backup = copy.imageUrls;
      delete copy.imageUrls;
    }
    copy.imageFolder = folder;
    return copy;
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(updated, null, 2));

  console.log(`✅ Converted ${updated.length} products`);
  console.log(`📁 Output written to: ${OUTPUT}`);
} catch (err) {
  console.error("❌ Error:", err.message);
}
