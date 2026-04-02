import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 1. Define the custom middleware to protect the CMS
const sveltiaAdminBypass = () => ({
  name: 'sveltia-admin-bypass',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // If the URL starts with /admin and isn't specifically asking for a file with an extension
      if (req.url && req.url.startsWith('/admin') && !req.url.includes('.')) {
        req.url = '/admin/index.html';
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. Inject the bouncer into the Vite pipeline
    sveltiaAdminBypass() 
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
