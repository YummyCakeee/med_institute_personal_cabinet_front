import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: "./build",
    rollupOptions: {
      output: {
        assetFileNames: 'assets/qumicon[extname]',
        // chunkFileNames: 'assets/[chunks]/[name].[hash].js',
        entryFileNames: 'assets/qumicon.js'
      }
    }
  }
})