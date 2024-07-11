import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// import dotenv from 'dotenv';

// dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3150,
    open: true, // Automatically open the app in the browser
    watch: {
      usePolling: true, // Use polling to watch for file changes, useful in some environments
    },
    // This enables Vite's middleware mode for handling HTML fallback
 
  
  },
})
