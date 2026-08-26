#!/usr/bin/env node

/**
 * Image Optimization Script
 * Optimizes images in dist/images to reduce file sizes
 * Uses sharp library for efficient compression
 * 
 * Usage: node scripts/optimize-images.cjs
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIST_IMAGES_DIR = path.join(__dirname, '../dist/images');
const BACKUP_DIR = path.join(__dirname, '../dist/images-backup');
const QUALITY_JPG = 75; // JPEG quality (0-100)
const QUALITY_PNG = 8; // PNG compression level (0-9)

let optimizedCount = 0;
let totalSize = 0;
let optimizedSize = 0;

/**
 * Recursively find all image files
 */
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Optimize a single image file
 */
async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    
    let optimization;
    
    if (ext === '.jpg' || ext === '.jpeg') {
      optimization = sharp(filePath)
        .jpeg({ quality: QUALITY_JPG, progressive: true });
    } else if (ext === '.png') {
      optimization = sharp(filePath)
        .png({ compressionLevel: QUALITY_PNG });
    } else if (ext === '.webp') {
      optimization = sharp(filePath)
        .webp({ quality: QUALITY_JPG });
    } else {
      return; // Skip unsupported formats
    }
    
    await optimization.toFile(filePath + '.tmp');
    
    const optimizedStats = fs.statSync(filePath + '.tmp');
    const optimizedFileSize = optimizedStats.size;
    
    // Only replace if optimized file is smaller
    if (optimizedFileSize < originalSize) {
      fs.renameSync(filePath + '.tmp', filePath);
      totalSize += originalSize;
      optimizedSize += optimizedFileSize;
      optimizedCount++;
      
      const savings = ((originalSize - optimizedFileSize) / originalSize * 100).toFixed(2);
      console.log(`✓ ${path.relative(DIST_IMAGES_DIR, filePath)}`);
      console.log(`  ${formatBytes(originalSize)} → ${formatBytes(optimizedFileSize)} (${savings}% saved)`);
    } else {
      // Remove temp file if no improvement
      fs.unlinkSync(filePath + '.tmp');
    }
  } catch (error) {
    console.error(`✗ Error optimizing ${filePath}:`, error.message);
  }
}

/**
 * Main optimization routine
 */
async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('============================\n');
  
  // Check if dist/images exists
  if (!fs.existsSync(DIST_IMAGES_DIR)) {
    console.error('❌ Error: dist/images directory not found');
    console.log('Make sure you have run: npm run build:all');
    process.exit(1);
  }
  
  // Check if sharp is installed
  try {
    require.resolve('sharp');
  } catch (e) {
    console.error('❌ Error: sharp library not found');
    console.log('\nInstall it with: npm install --save-dev sharp');
    process.exit(1);
  }
  
  console.log(`📂 Scanning images in: ${DIST_IMAGES_DIR}\n`);
  
  const imageFiles = findImageFiles(DIST_IMAGES_DIR);
  console.log(`Found ${imageFiles.length} image files\n`);
  
  if (imageFiles.length === 0) {
    console.log('No images to optimize.');
    process.exit(0);
  }
  
  console.log('🔄 Optimizing images...\n');
  
  // Process images sequentially
  for (const filePath of imageFiles) {
    await optimizeImage(filePath);
  }
  
  console.log('\n============================');
  console.log('✅ Optimization Complete!\n');
  console.log(`Total images optimized: ${optimizedCount}/${imageFiles.length}`);
  console.log(`Original total size: ${formatBytes(totalSize)}`);
  console.log(`Optimized total size: ${formatBytes(optimizedSize)}`);
  
  if (totalSize > 0) {
    const totalSavings = ((totalSize - optimizedSize) / totalSize * 100).toFixed(2);
    console.log(`Total space saved: ${formatBytes(totalSize - optimizedSize)} (${totalSavings}%)`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
