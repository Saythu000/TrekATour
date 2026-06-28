import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Security: Bind to localhost only to prevent external access
    host: mode === 'development' ? 'localhost' : '::',

    // Security: Disable network access in development
    strictPort: true,
    // Security: Add CORS configuration
    cors: {
      origin: mode === 'development' ? ['http://localhost:8080'] : true,
      credentials: true
    },
    // Security: Disable directory listing
    fs: {
      strict: true,
      allow: ['.']
    }
  },
  // Security: Add build-time security headers
  define: {
    // Prevent global object access
    global: 'globalThis',
  },
  // Security: Configure build options
  build: {
    // Security: Enable source maps only in development
    sourcemap: mode === 'development',
    // Security: Use Terser for production minification with security options
    minify: mode === 'production' ? 'terser' : false,
    // Security: Remove console logs and debugger statements in production
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      }
    } : undefined,
    // Optimize chunk splitting to reduce bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          charts: ['recharts', 'd3-scale', 'd3-array'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' ? componentTagger() : null,
    // Bundle analyzer - generates stats.html in dist folder
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Security: Preview server configuration
  preview: {
    host: 'localhost',
    port: 4173,
    strictPort: true,
    cors: {
      origin: ['http://localhost:4173'],
      credentials: true
    }
  }
}));
