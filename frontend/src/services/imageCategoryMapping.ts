// Map SKU/MDL codes to actual category folder names where images are stored
// This allows us to find images by the actual folder names they're stored in
export const SKU_TO_CATEGORY_MAPPING: Record<string, string> = {
  // Ankle products
  "MDL-003": "Ankle brace 4t",
  "MDL-001": "Anklet with ankle binder 3d",
  
  // Back/Lumbar support
  "MDL-005": "Calf support",
  "MDL-008": "Lumbar & Back Support",
  "MDL-017": "Lumbar & Back Support",
  "MDL-025": "Lumbar & Back Support",
  "MDL-029": "Lumbar & Back Support",
  "MDL-063": "Pregnancy Support Belt",
  "MDL-105": "Posture Corrector",
  "MDL-132": "Wrist & Hand Braces",
  
  // Cervical/Neck
  "MDL-013": "Cervical collar",
  "MDL-015": "Wrist & Hand Braces",
  
  // Knee/Leg
  "MDL-016": "Knee Support & Braces",
  "MDL-021": "Knee Support & Braces",
  "MDL-076": "Knee Support & Braces",
  "MDL-079": "Knee Support & Braces",
  
  // Wrist/Hand
  "MDL-010": "Wrist Band",
  "MDL-011": "Thumb And Wrist Support",
  "MDL-012": "Tennis Elbow Support",
  "MDL-019": "Wrist & Hand Braces",
  "MDL-022": "Wrist & Hand Braces",
  "MDL-023": "Wrist & Hand Braces",
  "MDL-027": "Weight Cuff",
  "MDL-032": "Wrist Splint",
  "MDL-033": "Wrist & Hand Braces",
  
  // Shoulder
  "MDL-028": "Shoulder Immobilizer",
  "MDL-031": "Shoulder Support",
  "MDL-037": "Shoulder Elastic Cap",
  
  // Elbow
  "MDL-040": "Elbow Support",
  "MDL-041": "Elbow support",
  
  // Mobility aids
  "MDL-044": "Mobility & Support Aids",
  "MDL-045": "Mobility & Support Aids",
  "MDL-046": "Walking Stick",
  "MDL-056": "Mobility & Support Aids",
  
  // Cushions
  "MDL-065": "Coccyx Cushion",
  "MDL-068": "Coccyx Cushion",
  "MDL-069": "Cut Donut Cushion",
  "MDL-070": "Foot Drop",
  "MDL-071": "Foot Drop",
  "MDL-072": "Foot Drop",
  
  // Other support items
  "MDL-082": "wrist & Hand Braces",
  "MDL-083": "Wrist & Hand Braces",
  "MDL-088": "Wrist & Hand Braces",
  "MDL-089": "Wrist & Hand Braces",
  "MDL-090": "Wrist & Hand Braces",
  "MDL-091": "Wrist & Hand Braces",
};

// Alternative: Map category names (from products.json) to actual image folder names
// This helps normalize folder name variations
export const CATEGORY_FOLDER_NAMES: Record<string, string> = {
  "Ankle Support": "Ankle brace 4t",
  "Ankle brace": "Ankle brace 4t",
  "Anklet": "Anklet with ankle binder 3d",
  "Back Support": "Lumbar & Back Support",
  "Lumbar & Back Support": "Lumbar & Back Support",
  "Cervical": "Cervical collar",
  "Cervical Collar": "Cervical collar",
  "Hand Braces": "Wrist & Hand Braces",
  "Wrist & Hand Braces": "Wrist & Hand Braces",
  "Knee Support": "Knee Support & Braces",
  "Knee Support & Braces": "Knee Support & Braces",
  "Mobility": "Mobility & Support Aids",
  "Mobility & Support Aids": "Mobility & Support Aids",
  "Wrist": "Wrist & Hand Braces",
  "Shoulder": "Shoulder Support",
  "Elbow": "Elbow Support",
  "Elbow Support": "Elbow Support",
  "Foot": "Foot Drop",
  "Foot Drop": "Foot Drop",
  "Cushion": "Coccyx Cushion",
  "Coccyx": "Coccyx Cushion",
  "Weight": "Weight Cuff",
};

/**
 * Find image path by searching available directories
 * Useful when products.json references MDL codes but images are stored by category
 */
export async function findImageByCategoryName(
  imagePath: string,
  categoryName?: string
): Promise<string | null> {
  // If the path starts with "images/mdl-" (lowercase), try to find it
  if (imagePath.includes("mdl-") || imagePath.includes("MDL-")) {
    // Extract the MDL code from the path
    const mdlMatch = imagePath.match(/([Mm][Dd][Ll]-[\d\w-]+)/);
    if (mdlMatch) {
      const mdlCode = mdlMatch[1].toUpperCase();
      
      // Look up the category folder for this SKU
      const categoryFolder = SKU_TO_CATEGORY_MAPPING[mdlCode];
      if (categoryFolder) {
        // Try to find images in this category folder
        const lastSlashIdx = imagePath.lastIndexOf("/");
        let fileName = "DSC05919.jpg"; // Try common first image name
        
        if (lastSlashIdx > 0) {
          fileName = imagePath.substring(lastSlashIdx + 1);
        }
        
        const categoryPath = `/images/${encodeURIComponent(categoryFolder)}/${fileName}`;
        try {
          const response = await fetch(categoryPath, { method: "HEAD" });
          if (response.ok) {
            console.log(`✅ Found by SKU mapping: ${categoryPath}`);
            return categoryPath;
          }
        } catch (e) {
          console.log(`Not found, trying to list folder: ${categoryFolder}`);
          // Try to find any jpg in the folder (common first image names)
          for (const fname of ["DSC05919.jpg", "DSC05921.jpg", "IMG_0001.jpg", "image1.jpg", "1.jpg"]) {
            const altPath = `/images/${encodeURIComponent(categoryFolder)}/${fname}`;
            try {
              const response = await fetch(altPath, { method: "HEAD" });
              if (response.ok) {
                console.log(`✅ Found alternate: ${altPath}`);
                return altPath;
              }
            } catch {
              // Continue trying other names
            }
          }
        }
        return categoryPath; // Return even if not found (as fallback)
      }
    }

    // If no SKU mapping found, try by category name
    if (categoryName) {
      const folderName = CATEGORY_FOLDER_NAMES[categoryName] || categoryName;
      
      const lastSlashIdx = imagePath.lastIndexOf("/");
      const fileName = imagePath.substring(lastSlashIdx + 1);
      
      const categoryPath = `/images/${encodeURIComponent(folderName)}/${fileName}`;
      try {
        const response = await fetch(categoryPath, { method: "HEAD" });
        if (response.ok) {
          console.log(`✅ Found by category: ${categoryPath}`);
          return categoryPath;
        }
      } catch {
        console.warn(`Category lookup failed for: ${categoryPath}`);
      }
    }
  }

  return null;
}
