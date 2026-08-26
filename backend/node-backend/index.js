import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Load Firebase service account
let serviceAccount;
try {
  // Try environment variable first
  if (process.env.FIREBASE_ADMIN_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  } else {
    // Try reading from file in server folder
    const keyPath = path.join(process.cwd(), "../server/serviceAccountKey.json");
    if (fs.existsSync(keyPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
    } else {
      console.warn("⚠️  Firebase service account key not found. API will use fallback mode.");
      serviceAccount = null;
    }
  }
} catch (err) {
  console.error("⚠️  Error loading Firebase credentials:", err.message);
  serviceAccount = null;
}

// Initialize Firebase only if credentials are available
if (serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = serviceAccount ? getFirestore() : null;

const app = express();
app.use(cors());
app.use(express.json());

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ================== IMAGE UPLOAD (LOCAL + STATIC SERVE) ==================
app.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No image uploaded");

    const file = req.file;
    const productName = req.body.productName || "unknown";

    const uploadDir = path.join("uploads", productName);
    fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    const publicUrl = `${process.env.RENDER_EXTERNAL_URL}/uploads/${productName}/${filename}`;

    res.json({ url: publicUrl });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ================== GET PRODUCTS ==================
app.get("/products", async (req, res) => {
  try {
    if (!db) {
      // Fallback: serve products.json if Firebase is unavailable
      const productsPath = path.join(path.dirname(new URL(import.meta.url).pathname), "../products.json");
      const cleanPath = productsPath.replace(/^\/([A-Z]:)/, "$1");
      
      if (fs.existsSync(cleanPath)) {
        const products = JSON.parse(fs.readFileSync(cleanPath, "utf8"));
        return res.json({ success: true, products });
      }
      return res.status(503).json({ success: false, error: "Firebase unavailable and products.json not found", products: [] });
    }

    const snap = await db.collection("products").get();
    const products = snap.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    // Return wrapped in success object for frontend compatibility
    res.json({ 
      success: true,
      products: products 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      products: []
    });
  }
});

// ================== ADD PRODUCT ==================
app.post("/addProduct", async (req, res) => {
  await db.collection("products").add(req.body);
  res.send("Product added");
});

// ================== TEST API ==================
app.get("/test", (req, res) => {
  res.send("API is LIVE on Render!");
});

// ================== SYNC PRODUCTS FROM products.json ==================
app.post("/syncProducts", async (req, res) => {
  try {
    const productsPath = path.join(path.dirname(new URL(import.meta.url).pathname), "../products.json");
    
    // For Windows paths, clean up the path
    const cleanPath = productsPath.replace(/^\/([A-Z]:)/, "$1");
    
    if (!fs.existsSync(cleanPath)) {
      return res.status(404).json({ error: "products.json not found at " + cleanPath });
    }

    const productsData = JSON.parse(fs.readFileSync(cleanPath, "utf8"));
    
    let updated = 0;
    let errors = [];
    const batch = db.batch();
    let batchSize = 0;

    for (const product of productsData) {
      try {
        const sku = product.sku?.toUpperCase() || "";
        if (!sku) continue;

        const docRef = db.collection("products").doc(sku);
        
        const updateData = {
          id: product.id || 0,
          name: product.name || "",
          sku: sku,
          price: product.price || 0,
          originalPrice: product.originalPrice || 0,
          category: product.category || "",
          rating: product.rating || 0,
          moq: product.moq || 0,
          material: product.material || "",
          inStock: product.inStock ?? true,
          bulkAvailable: product.bulkAvailable ?? false,
          description: product.description || "",
          sizes: product.sizes || [],
          certifications: product.certifications || [],
          features: product.features || [],
          imageUrls: product.imageUrls || [],
          images: product.images || {},
          updatedAt: new Date().toISOString()
        };

        batch.set(docRef, updateData, { merge: true });
        batchSize++;
        updated++;

        if (batchSize >= 100) {
          await batch.commit();
          batchSize = 0;
        }
      } catch (err) {
        errors.push(`${product.sku}: ${err.message}`);
      }
    }

    if (batchSize > 0) {
      await batch.commit();
    }

    res.json({ 
      success: true, 
      updated, 
      errors,
      message: `✅ Synced ${updated} products to Firestore`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
