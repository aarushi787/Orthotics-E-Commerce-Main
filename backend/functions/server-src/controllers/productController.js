/* --------------------------------------------------
   IMPORTS
-------------------------------------------------- */
const admin = require("../config/firebase.cjs");
const db = admin.firestore();

/* --------------------------------------------------
   PUBLIC: Get All Products
-------------------------------------------------- */
exports.getAllProducts = async (req, res) => {
  try {
    const snap = await db.collection("products")
      .orderBy("createdAt", "desc")
      .get();

    const products = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, products });
  } catch (err) {
    console.error("getAllProducts error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

/* --------------------------------------------------
   PUBLIC: Get Product by ID
-------------------------------------------------- */
exports.getProductById = async (req, res) => {
  try {
    const doc = await db.collection("products").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ success: false });
  }
};

/* --------------------------------------------------
   ADMIN: Create Product with Image Upload
-------------------------------------------------- */
exports.createProductWithImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    const { originalname, buffer, mimetype } = req.file;
    const { name, category, price } = req.body;

    const filename = `${Date.now()}_${originalname.replace(/\s+/g, "_")}`;
    const storagePath = `products/${category || "uncategorized"}/${filename}`;

    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);

    await file.save(buffer, { metadata: { contentType: mimetype } });

    const [imageUrl] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2030"
    });

    const productData = {
      name,
      category,
      price: Number(price) || 0,
      image: imageUrl,
      storagePath,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("products").add(productData);

    res.json({ success: true, id: docRef.id, product: productData });
  } catch (err) {
    console.error("createProductWithImage error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* --------------------------------------------------
   ADMIN: Update Product
-------------------------------------------------- */
exports.updateProduct = async (req, res) => {
  try {
    await db.collection("products").doc(req.params.id).update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: "Product updated" });
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ success: false });
  }
};

/* --------------------------------------------------
   ADMIN: Delete Product
-------------------------------------------------- */
exports.deleteProduct = async (req, res) => {
  try {
    await db.collection("products").doc(req.params.id).delete();
    res.status(204).send();
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ success: false });
  }
};