
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /api requests to the local Wrangler dev server so the web app
      // works without CORS issues during local development.
      '/api': {
        target: process.env.VITE_API_BASE_URL ?? 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
