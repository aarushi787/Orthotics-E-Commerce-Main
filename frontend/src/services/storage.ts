// src/services/storage.ts
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Resolve an array of image path strings (Storage paths or already-formed URLs)
 * into an array of usable image URLs. Supports:
 * - Full URLs (http/https)
 * - Hosting-relative paths (/images/...)
 * - Relative paths (images/mdl-029.jpg or images/MDL-101/MDL-101-1.jpg)
 * - Firebase Storage paths (images/MDL-003/...)
 */
export async function resolveImagePaths(paths?: string[]) {
  if (!paths || !Array.isArray(paths)) return [];

  return Promise.all(
    paths.map(async (p) => {
      if (!p) return "/images/no-image.png";
      
      // already a full URL (http/https)
      if (/^https?:\/\//i.test(p)) return p;
      
      // already a hosting-relative path starting with /
      if (p.startsWith("/")) return p;
      
      // Try to resolve as Firebase Storage path FIRST (images/MDL-036/MDL-036-1.jpg, etc)
      if (p.startsWith("images/")) {
        try {
          console.log(`[Firebase Storage] Attempting to resolve: ${p}`);
          let url = await getDownloadURL(ref(storage, p));
          // Add query parameters for image optimization (width, height, quality)
          const separator = url.includes("?") ? "&" : "?";
          url = `${url}${separator}alt=media`;
          console.log(`✅ [Firebase Storage] Successfully resolved: ${p}`);
          return url;
        } catch (storageError: any) {
          console.warn(`⚠️  [Firebase Storage] Failed to resolve "${p}": ${storageError?.message || storageError}`);
          // If Firebase Storage fails, fall back to hosting path
          const fallbackPath = "/" + p;
          console.log(`📁 [Fallback] Using hosting path: ${fallbackPath}`);
          return fallbackPath;
        }
      }

      // For non-image paths, try Firebase Storage
      try {
        console.log(`[Firebase Storage] Attempting to resolve: ${p}`);
        let url = await getDownloadURL(ref(storage, p));
        // Add query parameters for image optimization
        const separator = url.includes("?") ? "&" : "?";
        url = `${url}${separator}alt=media`;
        console.log(`✅ [Firebase Storage] Successfully resolved: ${p}`);
        return url;
      } catch (storageError: any) {
        console.warn(`⚠️  [Firebase Storage] Failed to resolve "${p}": ${storageError?.message || storageError}`);
        
        // If Firebase Storage fails, try as relative hosting path
        if (!p.startsWith("/")) {
          const fallbackPath = "/" + p;
          console.log(`📁 [Fallback] Using hosting path: ${fallbackPath}`);
          return fallbackPath;
        }
        console.log(`❌ Using placeholder for: ${p}`);
        return "/images/no-image.png";
      }
    })
  );
}

export default { resolveImagePaths };
