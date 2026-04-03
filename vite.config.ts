import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: any[] = [
    react(),
    mode === 'development' && componentTagger(),
  ];

  if (mode === 'production') {
    // Prerender plugin is loaded at build time via postbuild script
    // See package.json "build" script
  }

  return {
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
      }
    },
    ssr: {
      noExternal: [
        'react', 
        'react-dom', 
        'sonner', 
        'react-router-dom', 
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@radix-ui/react-label',
        'react-helmet-async',
        'next-themes'
      ]
    },
    plugins: plugins.filter(Boolean),
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
        "@radix-ui/react-label",
        "@tanstack/react-query",
        "react-helmet-async",
        "next-themes"
      ],
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "react-dom/client": path.resolve(__dirname, "./node_modules/react-dom/client"),
        "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
        "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      },
    },
    define: {
      'global.React': '"React"',
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
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
          manualChunks: (id: string) => {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'react-router';
            }
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'forms';
            }
            if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-select')) {
              return 'ui-heavy';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-base';
            }
            if (id.includes('supabase')) {
              return 'supabase';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'utils';
            }
            if (id.includes('react-helmet-async')) {
              return 'meta';
            }
            if (id.includes('LandingPage')) {
              return 'landing-pages';
            }
          },
          assetFileNames: (assetInfo: { name?: string }) => {
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
        external: (_id: string) => {
          return false;
        },
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] as ('console' | 'debugger')[] : [],
    },
  };
});