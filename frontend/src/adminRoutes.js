// src/adminRoutes.js
const express = require('express');
const router = express.Router();
const { db, auth, bucket } = require('./firebaseAdmin');

// GET: list products (example)
router.get('/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').limit(50).get();
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: list users
router.get('/users', async (req, res) => {
  try {
    const list = await auth.listUsers(1000);
    const users = list.users.map(u => ({ uid: u.uid, email: u.email, disabled: u.disabled }));
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: create product (admin)
router.post('/products', async (req, res) => {
  try {
    const payload = req.body;
    const docRef = await db.collection('products').add(payload);
    res.json({ success: true, id: docRef.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
