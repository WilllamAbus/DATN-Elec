import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import checker from 'vite-plugin-checker';


export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }),
  ],
  // proxy: {
  //   '/api': {
  //     target: 'http://localhost:4000',
  //     changeOrigin: true,
  //     secure: false,
  //     rewrite: (path) => path.replace(/^\/api/, ''),
  //   },
  // },
  resolve: {
    alias: {
      '@': 'src',
    },
  },
  server: {
    port: 3150,
    open: true,

    watch: {
      usePolling: true,
     
    },
  },
});

