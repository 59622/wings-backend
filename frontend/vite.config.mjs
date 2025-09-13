import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",   // use a shorter folder name instead of "dist"
    assetsDir: ".",    // place assets directly inside build/ to flatten paths
  },
});
