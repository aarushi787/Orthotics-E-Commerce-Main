const fs = require("fs");
const path = require("path");

// Correct path to YOUR project-root/images
const IMAGES_ROOT = path.join(__dirname, "../../images");

console.log("[imagesController] Images Root:", IMAGES_ROOT);

// GET /api/images → list product folders
exports.getAllProducts = (req, res) => {
  try {
    const items = fs.readdirSync(IMAGES_ROOT, { withFileTypes: true });
    const folders = items.filter(f => f.isDirectory()).map(f => f.name);

    res.json({ products: folders });
  } catch (err) {
    console.error("Error listing products:", err);
    res.status(500).json({
      message: "Failed to list products",
      details: err.message
    });
  }
};

// GET /api/images/:productName → list images inside one folder
exports.getProductImages = (req, res) => {
  try {
    const productName = req.params.productName;
    const productPath = path.join(IMAGES_ROOT, productName);

    console.log("[imagesController] checking:", productPath);

    // Folder not found
    if (!fs.existsSync(productPath)) {
      return res.status(404).json({ message: "Product folder not found" });
    }

    const files = fs.readdirSync(productPath).filter(file =>
      fs.statSync(path.join(productPath, file)).isFile()
    );

    // URL to serve images
    const baseUrl = `${req.protocol}://${req.get("host")}/images/${productName}`;
    const urls = files.map(f => `${baseUrl}/${f}`);

    res.json({ images: urls });

  } catch (err) {
    console.error("Error reading product images:", err);
    res.status(500).json({
      message: "Failed to read images",
      details: err.message
    });
  }
};
