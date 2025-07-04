// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // << ✅ AGGIUNGI QUESTA LINEA
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.replit.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});
