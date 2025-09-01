import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react-router-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "react-helmet-async",
      "sonner",
      "next-themes",
      "@radix-ui/react-dialog",
      "lucide-react"
    ],
    force: true,
    esbuildOptions: {
      target: 'esnext',
      // Ensure React is treated as external global
      external: [],
    }
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'sonner', 'react-router-dom', '@radix-ui/react-dialog']
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime", 
      "react/jsx-dev-runtime",
      "react-router-dom",
      "react-router",
      "sonner",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@tanstack/react-query",
      "react-helmet-async"
    ],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force single React instance - use directory paths
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  define: {
    // Ensure React is available globally
    'global.React': 'React',
    'global.window.React': 'React',
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development')
  },
  clearScreen: false,
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
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
          
          // Backend
          if (id.includes('supabase')) {
            return 'supabase';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Icons and utilities
          if (id.includes('lucide-react')) {
            return 'icons';
          }
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
