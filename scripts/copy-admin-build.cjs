// scripts/copy-admin-build.cjs
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const adminDist = path.join(root, 'Fox-Orthotics-Admin', 'dist');
const target = path.join(root, 'dist', 'admin');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
  return true;
}

if (!fs.existsSync(adminDist)) {
  console.error('Admin dist not found. Run `npm run build` inside Fox-Orthotics-Admin first.');
  process.exitCode = 1;
} else {
  copyRecursive(adminDist, target);
  console.log('Copied admin build to', target);
}
