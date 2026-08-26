/**
 * Image optimization utilities for fast loading
 */

/**
 * Preload an image for faster display
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
    img.src = src;
  });
}

/**
 * Preload multiple images in parallel
 */
export async function preloadImages(urls: string[]): Promise<void> {
  const promises = urls
    .filter(Boolean)
    .map(url => preloadImage(url).catch(() => undefined));
  
  await Promise.all(promises);
}

/**
 * Add DNS prefetching for Firebase Storage
 */
export function addDNSPrefetch(): void {
  if (typeof document === 'undefined') return;

  const prefetchLinks = [
    'https://firebasestorage.googleapis.com',
    'https://www.gstatic.com',
    'https://www.googletagmanager.com'
  ];

  prefetchLinks.forEach(link => {
    const existingLink = document.querySelector(`link[href="${link}"]`);
    if (!existingLink) {
      const link_elem = document.createElement('link');
      link_elem.rel = 'dns-prefetch';
      link_elem.href = link;
      document.head.appendChild(link_elem);
    }
  });
}

/**
 * Optimize image URL for CDN delivery
 */
export function optimizeImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return url;
  
  // Firebase Storage URLs
  if (url.includes('firebasestorage.googleapis.com')) {
    const separator = url.includes('?') ? '&' : '?';
    let optimized = `${url}${separator}alt=media`;
    
    if (width) optimized += `&w=${width}`;
    if (height) optimized += `&h=${height}`;
    
    return optimized;
  }
  
  return url;
}

/**
 * Check if image URL is from Firebase Storage
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com');
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(baseUrl: string): string {
  if (!isFirebaseStorageUrl(baseUrl)) {
    return baseUrl;
  }

  const sizes = [320, 480, 640, 800, 1024, 1280, 1536, 1920, 2560, 3200, 3840];
  return sizes
    .map(size => `${optimizeImageUrl(baseUrl, size, size)} ${size}w`)
    .join(', ');
}
