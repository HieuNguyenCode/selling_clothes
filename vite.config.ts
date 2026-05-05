import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Chuyển hướng các yêu cầu ảnh sản phẩm
      '/images': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Chuyển hướng các yêu cầu ảnh Combo
      '/combos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Proxy cho API
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
