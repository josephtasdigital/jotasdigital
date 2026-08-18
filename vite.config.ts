import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { compression } from "vite-plugin-compression2";

// 1. Define the custom middleware to protect the CMS
const sveltiaAdminBypass = () => ({
  name: 'sveltia-admin-bypass',
  configureServer(server: any) {
    server.middlewares.use((req: any, _res: any, next: any) => {
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
    sveltiaAdminBypass(),
    // 3. Pre-compress build output (gzip + brotli) for faster transfer
    compression({ algorithms: ["gzip", "brotliCompress"], threshold: 1024 }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("three") || id.includes("@react-three")) return "three";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("react-router")) return "router";
          if (id.includes("i18next")) return "i18n";
          if (id.includes("@supabase")) return "supabase";
          return "vendor";
        },
      },
    },
  },
});
