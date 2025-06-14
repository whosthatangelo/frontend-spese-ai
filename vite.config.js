import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // ✅ Usa una porta diversa dal backend
    allowedHosts: ['.replit.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // << QUI DEVE ESSERE 5000
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
