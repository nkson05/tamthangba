import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Thêm dòng này

export default defineConfig({
  base: '/tamthangba/', // tên repo nếu deploy pages
  plugins: [
    react(),
    tailwindcss(), // Thêm dòng này vào mảng plugins
  ],
})