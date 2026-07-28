import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { APP_THEME_COLOR } from './src/shared/theme/brandTokens';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      devOptions: { enabled: false },
      includeAssets: [
        'icons/clara-192.svg',
        'icons/clara-512.svg',
        'icons/clara-192.png',
        'icons/clara-512.png',
        'icons/clara-512-maskable.png',
      ],
      manifest: {
        name: 'Clara Insurance Quotes',
        short_name: 'Clara Quotes',
        description: 'A secure, guided workspace for Clara insurance quotes.',
        start_url: '/quotes',
        display: 'standalone',
        theme_color: APP_THEME_COLOR,
        background_color: '#FBFBFD',
        icons: [
          {
            src: '/icons/clara-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icons/clara-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icons/clara-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/clara-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/clara-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: true,
    proxy: {
      '/api': {
        target:
          process.env.VITE_DEV_API_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
