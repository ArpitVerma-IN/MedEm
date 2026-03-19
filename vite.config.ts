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
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet') || id.includes('react-leaflet')) return 'leaflet-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
            if (id.includes('framer-motion')) return 'framer-vendor';
            if (id.includes('socket.io')) return 'socket-vendor';
            if (id.includes('crypto-browserify') || id.includes('stream-browserify') || id.includes('buffer') || id.includes('events') || id.includes('vite-plugin-node-polyfills')) return 'polyfills-vendor';
          }
          if (id.includes('src/components/LiveTrackingMap')) return 'LiveTrackingMap';
        }
      }
    }
  }
})
