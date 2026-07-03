import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // generateSW: Workbox generates the SW — works reliably in dev + prod
      registerType: 'autoUpdate',
      strategies: 'generateSW',

      // Point to our manifest.json in public/ — don't auto-generate one
      manifest: {
        name: 'MCA App',
        short_name: 'MCA App',
        description: 'Secure Escrow Platform',
        theme_color: '#18181b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },

      // Workbox config: cache static assets + offline fallback
      workbox: {
        // Cache the app shell
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Offline fallback for navigation
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        // Network-first for API calls (never cache)
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api') ||
              url.hostname !== self.location.hostname,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },

      // Enable service worker in Vite dev mode (required for install prompt on localhost)
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  server: {
    // Expose on all network interfaces so mobile devices can connect
    host: true,
    port: 5173,
    // Proxy /api to backend — single origin for desktop + mobile (no CORS / IP issues)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});


