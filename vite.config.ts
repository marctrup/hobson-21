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
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI components (smaller chunks)
          'ui-base': ['@radix-ui/react-slot', '@radix-ui/react-toast'],
          'ui-forms': ['@radix-ui/react-dialog', '@radix-ui/react-checkbox', '@radix-ui/react-select', '@radix-ui/react-label'],
          
          // Forms and validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Backend and data
          'supabase': ['@supabase/supabase-js'],
          'query': ['@tanstack/react-query'],
          
          // Utilities (separate from heavy libraries)
          'icons': ['lucide-react'],
          'utils': ['clsx', 'tailwind-merge'],
          'cva': ['class-variance-authority'],
          
          // Helmet and async
          'meta': ['react-helmet-async'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      external: (id) => {
        // Externalize large libraries that can be loaded from CDN
        return false; // Keep everything bundled for now for better caching
      },
    },
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
