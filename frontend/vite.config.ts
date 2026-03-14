import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env dari root project (satu level di atas frontend/)
  const env = loadEnv(mode, '../', '')

  const appDomain = env.APP_DOMAIN || 'localhost'
  // Default ke port 3000 (sesuai backend)
  const apiTarget = env.VITE_API_TARGET || 'http://127.0.0.1:3000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      allowedHosts: [
        appDomain,
        'localhost',
        '127.0.0.1',
      ],
      host: true,
      proxy: {
        // Semua request /api di-forward ke backend
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,  // Forward WebSocket (untuk fitur chat)
          rewrite: (path) => path,
        },
        // WebSocket path khusus untuk Socket.IO / chat
        '/socket.io': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
        },
        // Proxy gambar produk ke local backend
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path,
        }
      }
    }
  }
})
