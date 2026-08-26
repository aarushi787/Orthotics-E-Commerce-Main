/**
 * Firebase Image Configuration
 * Handles image resolution strategies and fallbacks
 */

// Image resolution strategy
export const IMAGE_STRATEGY = {
  // Primary: Try Firebase Storage first
  PRIMARY: 'firebase',
  
  // Fallback: Use local public folder
  FALLBACK: 'local',
  
  // Last resort
  PLACEHOLDER: '/images/no-image.png',
} as const;

// Image paths configuration
export const IMAGE_PATHS = {
  // Product images
  PRODUCTS: 'images/',
  
  // Logo
  LOGO: 'frontend/src/assets/logo.png',
  
  // Placeholder
  NO_IMAGE: '/images/no-image.png',
  
  // Local fallback root
  PUBLIC_IMAGES: '/images/',
} as const;

// Firebase Storage bucket
export const FIREBASE_BUCKET = process.env.VITE_FIREBASE_STORAGE_BUCKET || 
  'e-commerce-61d74.firebasestorage.app';

// Image optimization settings
export const IMAGE_OPTIMIZATION = {
  // Maximum image width for optimization
  MAX_WIDTH: 1200,
  
  // Image quality (0-100)
  QUALITY: 85,
  
  // Enable caching
  CACHE_ENABLED: true,
  
  // Cache duration (ms)
  CACHE_DURATION: 1000 * 60 * 60 * 24, // 24 hours
} as const;

// Image loading settings
export const IMAGE_LOADING = {
  // Use lazy loading
  LAZY_LOAD: true,
  
  // Preload critical images
  PRELOAD_CRITICAL: true,
  
  // Timeout for image loading (ms)
  TIMEOUT: 10000,
} as const;
