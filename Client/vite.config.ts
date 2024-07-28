import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from '@rollup/plugin-commonjs';
export default defineConfig({
  resolve: {
    alias: {
      '~': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 3150,
    open: true,
    watch: {
      usePolling: true,
    },
  },
  plugins: [react(), commonjs()],
});