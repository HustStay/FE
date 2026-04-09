import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    host: '0.0.0.0', // Listen on all interfaces for Docker
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_GATEWAY_URL || 'https://api-gateway-310906765270.asia-southeast1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // WebSocket proxy - routes SockJS/WS through Vite to avoid CORS & 403
      '/chat-ws': {
        target: process.env.API_GATEWAY_URL || 'https://api-gateway-310906765270.asia-southeast1.run.app',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/chat-ws/, '')
      }
    }
  }
})
