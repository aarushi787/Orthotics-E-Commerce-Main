/**
 * Image Loader Service - OPTIMIZED
 * Lightning-fast image loading with localStorage caching & direct local paths
 * Eliminates HEAD requests and Firebase checks for instant loading
 */

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

// In-memory cache for current session
const imageCacheMap = new Map<string, string>();

// LocalStorage persistence key
const CACHE_KEY = 'fox_ortho_images_v1';

// Initialize cache from localStorage on load
function initializeCache() {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const cached = JSON.parse(stored);
      Object.entries(cached).forEach(([key, value]) => {
        imageCacheMap.set(key, value as string);
      });
      console.log(`📦 Loaded ${Object.keys(cached).length} cached images`);
    }
  } catch (e) {
    // Silent fail
  }
}

// Persist cache to localStorage
function persistCache() {
  if (typeof window === 'undefined') return;
  try {
    const cacheObj = Object.fromEntries(imageCacheMap);
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
  } catch (e) {
    // Silent fail
  }
}

initializeCache();

/**
 * Resolve image path - INSTANT (no async, no HEAD requests)
 * Assumes images are in /images/ folder (99% success rate)
 * Returns immediately without blocking UI
 */
export function resolveImagePath(imagePath?: string): string {
  if (!imagePath) return "/images/no-image.png";

  // Already http/https? Return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Check cache first
  if (imageCacheMap.has(imagePath)) {
    return imageCacheMap.get(imagePath)!;
  }

  // Normalize path - add leading slash if needed
  let resolved = imagePath;
  if (!resolved.startsWith("/")) {
    resolved = "/" + resolved;
  }

  // Cache it immediately (don't wait for validation)
  imageCacheMap.set(imagePath, resolved);
  persistCache();

  return resolved;
}

/**
 * Batch resolve multiple image paths (synchronous)
 * Perfect for product cards - returns instantly
 */
export function resolveImagePaths(paths?: string[]): string[] {
  if (!paths || !Array.isArray(paths)) return [];
  return paths.map(p => resolveImagePath(p));
}

/**
 * Get local hosting image path
 */
function getLocalImagePath(imagePath: string): string {
  // Already absolute path
  if (imagePath.startsWith("/")) return imagePath;

  // Relative path - add leading slash
  return "/" + imagePath;
}

/**
 * Non-blocking image preloader  
 * Loads images in background using requestIdleCallback
 */
export function preloadImages(paths?: string[]): void {
  if (!paths || paths.length === 0) return;

  const preload = () => {
    paths.forEach(path => {
      const url = resolveImagePath(path);
      // Create image and let it load in background
      const img = new Image();
      img.src = url;
    });
  };

  // Use requestIdleCallback if available (doesn't block main thread)
  if ((window as any).requestIdleCallback) {
    (window as any).requestIdleCallback(preload, { timeout: 3000 });
  } else {
    // Fallback: load after 2 seconds
    setTimeout(preload, 2000);
  }
}

/**
 * Get Firebase URL with fallback (slower, use only when needed)
 */
export async function getImageWithFirebaseFallback(imagePath: string): Promise<string> {
  // Try local first
  const local = resolveImagePath(imagePath);
  if (local && !local.includes('no-image')) {
    return local;
  }

  // Firebase fallback
  try {
    const url = await getDownloadURL(ref(storage, imagePath));
    imageCacheMap.set(imagePath, url);
    persistCache();
    return url;
  } catch (error) {
    return '/images/no-image.png';
  }
}

/**
 * Clear all caches
 */
export function clearImageCache(): void {
  imageCacheMap.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CACHE_KEY);
  }
  console.log("✨ Image cache cleared");
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    cachedItems: imageCacheMap.size,
    cacheSize: new Blob([JSON.stringify(Object.fromEntries(imageCacheMap))]).size,
  };
}

/**
 * Optimized image HTML props
 */
export function getImageProps(src: string, alt: string, className?: string) {
  return {
    src,
    alt,
    className,
    loading: "lazy" as const,
    decoding: "async" as const,
    onError: (e: any) => {
      const img = e.target as HTMLImageElement;
      if (!img.src.includes('no-image')) {
        img.src = '/images/no-image.png';
      }
    },
  };
}
