import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Chuyển hướng các yêu cầu ảnh để tránh lỗi CORS
      '/images': {
        target: 'http://localhost:5267',
        changeOrigin: true,
      },
      // Bạn cũng có thể proxy luôn phần API nếu muốn gọn hơn
      '/api': {
        target: 'http://localhost:5267',
        changeOrigin: true,
      }
    }
  }
})
