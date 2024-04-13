// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/happybirthdayjoe/',
  build: {
    chunkSizeWarningLimit: 1024 * 1000, 
  },
});
