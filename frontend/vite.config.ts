import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env dari root project (satu level di atas frontend/)
  const env = loadEnv(mode, '../', '')

  const appDomain = env.APP_DOMAIN || 'localhost'
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      allowedHosts: [
        appDomain,
        'localhost',
        '127.0.0.1',
      ],
      host: true, // Listen on all local IPs
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
        }
      }
    }
  }
})
