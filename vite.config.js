// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Use the appropriate plugin for your framework (e.g., react, vue)

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // This is the default output directory; you can change it if needed
  },
  server: {
    // This is optional, for local development
    port: 3000,
  }
})
