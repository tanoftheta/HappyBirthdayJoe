// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/HappyBirthdayJoe/',
  build: {
    chunkSizeWarningLimit: 1024 * 1000, 
  },
});
