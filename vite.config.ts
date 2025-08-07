import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 8192,
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      },
      output: {
        manualChunks: (id) => {
          // Core React chunks
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('react-router')) {
            return 'react-router';
          }
          
          // Heavy form libraries
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'forms';
          }
          
          // UI libraries (split further)
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-select')) {
            return 'ui-heavy';
          }
          if (id.includes('@radix-ui')) {
            return 'ui-base';
          }
          
          // Lucide icons - separate chunk for better caching
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          
          // Backend
          if (id.includes('supabase')) {
            return 'supabase';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Utils
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          
          // Helmet for SEO
          if (id.includes('react-helmet-async')) {
            return 'meta';
          }
          
          // Landing pages (lazy load these)
          if (id.includes('LandingPage')) {
            return 'landing-pages';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash:8][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash:8][extname]`;
          }
          if (/woff2?|ttf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash:8][extname]`;
          }
          return `assets/[name]-[hash:8][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash:8].js',
        entryFileNames: 'assets/js/[name]-[hash:8].js',
      },
      external: (id) => {
        // Externalize large libraries that can be loaded from CDN
        return false; // Keep everything bundled for now for better caching
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
      treeShaking: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));