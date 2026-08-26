#!/usr/bin/env node

/**
 * Product Document Migration Script
 * Normalizes product documents in Firestore to use consistent imageUrls field
 * 
 * This script:
 * 1. Fetches all products from Firestore
 * 2. Normalizes image fields (imagePaths → imageUrls, flattens images object)
 * 3. Ensures all products have imageUrls array
 * 4. Updates documents in Firestore
 * 
 * Usage: node scripts/migrate-products.cjs [--dry-run] [--batch-size=25]
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='));
const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1]) : 25;

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../server/serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found at:', serviceAccountPath);
  console.log('\nTo set up the migration:');
  console.log('1. Download your Firebase service account key from Firebase Console');
  console.log('2. Save it to server/serviceAccountKey.json');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

/**
 * Flatten image arrays from Firestore object structure
 * Input: { "red": [...urls], "blue": [...urls] }
 * Output: [...all urls]
 */
function flattenImages(imagesObj) {
  if (!imagesObj || typeof imagesObj !== 'object') return [];
  
  const urls = [];
  Object.values(imagesObj).forEach(colorUrls => {
    if (Array.isArray(colorUrls)) {
      urls.push(...colorUrls);
    } else if (typeof colorUrls === 'string') {
      urls.push(colorUrls);
    }
  });
  return urls;
}

/**
 * Normalize a product document
 */
function normalizeProduct(product) {
  const normalized = { ...product };
  let hasChanges = false;
  
  // Handle imageUrls field
  if (!normalized.imageUrls) {
    normalized.imageUrls = [];
    hasChanges = true;
  }
  
  // If imageUrls is empty, try to populate from other fields
  if (!Array.isArray(normalized.imageUrls) || normalized.imageUrls.length === 0) {
    // Try imagePaths field (old naming convention)
    if (Array.isArray(normalized.imagePaths) && normalized.imagePaths.length > 0) {
      normalized.imageUrls = normalized.imagePaths;
      hasChanges = true;
    }
    // Try images field (Firestore storage structure)
    else if (normalized.images && typeof normalized.images === 'object') {
      normalized.imageUrls = flattenImages(normalized.images);
      if (normalized.imageUrls.length > 0) {
        hasChanges = true;
      }
    }
  }
  
  // Ensure imageUrls is always an array
  if (!Array.isArray(normalized.imageUrls)) {
    normalized.imageUrls = [];
    hasChanges = true;
  }
  
  return { normalized, hasChanges };
}

/**
 * Display product changes in human-readable format
 */
function displayChanges(original, normalized) {
  const changes = [];
  
  if (JSON.stringify(original.imageUrls || []) !== JSON.stringify(normalized.imageUrls || [])) {
    changes.push(`  imageUrls: ${(original.imageUrls || []).length} → ${normalized.imageUrls.length} URLs`);
  }
  
  return changes;
}

/**
 * Main migration routine
 */
async function migrate() {
  console.log('📦 Product Document Migration Script');
  console.log('=====================================\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }
  
  console.log(`Batch size: ${batchSize}`);
  console.log(`Project: ${serviceAccount.project_id}\n`);
  
  try {
    // Fetch all products
    console.log('📂 Fetching products from Firestore...\n');
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No products found in Firestore');
      process.exit(1);
    }
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({
        docId: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✓ Found ${products.length} products\n`);
    
    // Normalize products
    console.log('🔄 Analyzing products...\n');
    const updates = [];
    let changesCount = 0;
    
    for (const product of products) {
      const { normalized, hasChanges } = normalizeProduct(product);
      
      if (hasChanges) {
        changesCount++;
        const changes = displayChanges(product, normalized);
        
        console.log(`📝 ${product.sku} (${product.name})`);
        changes.forEach(change => console.log(change));
        console.log('');
        
        updates.push({
          docId: product.docId,
          data: normalized
        });
      }
    }
    
    console.log('=====================================');
    console.log(`Products to update: ${changesCount}/${products.length}\n`);
    
    if (updates.length === 0) {
      console.log('✅ All products are already normalized!');
      process.exit(0);
    }
    
    if (isDryRun) {
      console.log('ℹ️  DRY RUN COMPLETE - Preview shown above');
      console.log('\nTo apply changes, run without --dry-run:');
      console.log('  node scripts/migrate-products.cjs\n');
      process.exit(0);
    }
    
    // Apply updates in batches
    console.log(`💾 Applying updates in batches of ${batchSize}...\n`);
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = db.batch();
      const batchUpdates = updates.slice(i, i + batchSize);
      
      batchUpdates.forEach(update => {
        const docRef = db.collection('products').doc(update.docId);
        batch.update(docRef, {
          imageUrls: update.data.imageUrls,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await batch.commit();
      console.log(`✓ Updated batch ${Math.floor(i / batchSize) + 1} (${batchUpdates.length} documents)`);
    }
    
    console.log('\n=====================================');
    console.log('✅ Migration Complete!\n');
    console.log(`Total products updated: ${updates.length}`);
    console.log(`Timestamp: ${new Date().toISOString()}\n`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

migrate();
