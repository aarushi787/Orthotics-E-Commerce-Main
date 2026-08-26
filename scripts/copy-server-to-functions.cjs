// scripts/copy-server-to-functions.cjs
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const serverRoot = path.join(root, 'backend', 'server');
const functionsRoot = path.join(root, 'backend', 'functions');
const serverSrc = path.join(serverRoot, 'src');
const target = path.join(functionsRoot, 'server-src');

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

if (!fs.existsSync(serverSrc)) {
  console.error('server/src not found. Make sure the server folder exists.');
  process.exitCode = 1;
} else {
  // remove existing target to avoid stale files
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  copyRecursive(serverSrc, target);
  // also copy package.json dependencies list for reference
  const serverPkg = path.join(serverRoot, 'package.json');
  const targetPkg = path.join(functionsRoot, 'server-package.json');
  if (fs.existsSync(serverPkg)) fs.copyFileSync(serverPkg, targetPkg);
  console.log('Copied server/src to', target);
}
