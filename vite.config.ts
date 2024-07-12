import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Optional: Define the base URL for the app (useful if deploying to a subpath)
  base: '/',
  // Optional: Add server configuration for local development
  server: {
    port: 3001, // Change this port if needed
  },
  // Optional: Add build configuration for production
  build: {
    outDir: 'dist',
  },
});
