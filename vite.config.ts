import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['crypto', 'stream', 'events', 'buffer', 'string_decoder', 'util', 'vm'],
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'leaflet-vendor': ['leaflet', 'react-leaflet'],
          'icons-vendor': ['lucide-react'],
          'framer-vendor': ['framer-motion'],
          'socket-vendor': ['socket.io-client'],
        }
      }
    }
  }
})
