import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import checker from 'vite-plugin-checker';


export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }),
  ],
  
  resolve: {
    alias: {
      '@': 'src',
    },
  },
  server: {
    port: 3150,
    open: true,
    open: true,
    watch: {
      usePolling: true,
      usePolling: true,
    },
  },
});

