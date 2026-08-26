import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      root: '.',
      publicDir: 'public',
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Proxy API calls in development to the backend server
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '/api')
          }
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'frontend/src'),
        }
      },
      build: {
        // Optimize images and assets
        assetsInlineLimit: 4096,
        minify: 'esbuild',
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor': ['react', 'react-dom'],
              'firebase': ['firebase/app', 'firebase/storage', 'firebase/firestore', 'firebase/auth']
            }
          }
        }
      }
    };
});
