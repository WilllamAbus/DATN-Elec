import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import commonjs from '@rollup/plugin-commonjs';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    // commonjs(),
    checker({
      typescript: true, // Enable TypeScript type checking
    }),
  ],
  resolve: {
    alias: {
      '~': '/src',
    },
  },
  
  server: {
    port: 3150,
    open: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  optimizeDeps: {
    include: ['jwt-decode'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  
});
