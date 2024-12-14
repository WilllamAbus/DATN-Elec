import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    port: 3150,
    open: true,
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**"],
    },    
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  optimizeDeps: {
    include: ["jwt-decode"],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
