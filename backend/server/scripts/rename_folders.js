// const fs = require("fs");
// const path = require("path");

// // Images are in project-root/images (NOT inside server/)
// const IMAGES_ROOT = path.join(__dirname, "..", "..", "images");

// console.log("📁 Images root:", IMAGES_ROOT);

// if (!fs.existsSync(IMAGES_ROOT)) {
//     console.error("❌ ERROR: Images folder not found at:", IMAGES_ROOT);
//     process.exit(1);
// }

// function toKebabCase(name) {
//     return name
//         .trim()
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/-+/g, "-")
//         .replace(/^-|-$/g, "");
// }

// const items = fs.readdirSync(IMAGES_ROOT, { withFileTypes: true });

// items.forEach(item => {
//     if (!item.isDirectory()) return;

//     const originalName = item.name;
//     const newName = toKebabCase(originalName);

//     if (originalName === newName) {
//         console.log(`✔ Already correct: ${originalName}`);
//         return;
//     }

//     try {
//         fs.renameSync(
//             path.join(IMAGES_ROOT, originalName),
//             path.join(IMAGES_ROOT, newName)
//         );
//         console.log(`🔄 Renamed: "${originalName}" ➝ "${newName}"`);
//     } catch (err) {
//         console.error(`❌ Failed to rename ${originalName}:`, err);
//     }
// });

// console.log("🎉 Done!");

const fs = require("fs");
const path = require("path");

const IMAGES_ROOT = path.join(__dirname, "..", "..", "images");

function toKebabCase(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

console.log("📁 Images Root:", IMAGES_ROOT);

const folders = fs.readdirSync(IMAGES_ROOT, { withFileTypes: true })
    .filter(f => f.isDirectory())
    .map(f => f.name);

folders.forEach(folder => {
    const newName = toKebabCase(folder);
    if (newName === folder) return;

    const oldPath = path.join(IMAGES_ROOT, folder);
    const newPath = path.join(IMAGES_ROOT, newName);

    try {
        // Normal rename attempt
        fs.renameSync(oldPath, newPath);
        console.log(`✔ Renamed normally: ${folder} ➝ ${newName}`);
    } catch (err) {
        console.log(`⚠ Normal rename failed for "${folder}", using force method...`);

        const tempPath = path.join(IMAGES_ROOT, "__temp_" + newName);

        try {
            // 1. Create temp folder
            fs.mkdirSync(tempPath);

            // 2. Move all files to temp
            const files = fs.readdirSync(oldPath);
            files.forEach(file => {
                fs.renameSync(
                    path.join(oldPath, file),
                    path.join(tempPath, file)
                );
            });

            // 3. Remove old folder
            fs.rmSync(oldPath, { recursive: true, force: true });

            // 4. Create new folder
            fs.mkdirSync(newPath);

            // 5. Move files back
            const tempFiles = fs.readdirSync(tempPath);
            tempFiles.forEach(file => {
                fs.renameSync(
                    path.join(tempPath, file),
                    path.join(newPath, file)
                );
            });

            // 6. Remove temp folder
            fs.rmSync(tempPath, { recursive: true, force: true });

            console.log(`✔ FORCE Renamed: ${folder} ➝ ${newName}`);
        } catch (e) {
            console.error(`❌ FAILED to force rename "${folder}":`, e);
        }
    }
});

console.log("🎉 Force rename completed!");
