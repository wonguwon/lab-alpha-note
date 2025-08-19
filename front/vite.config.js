import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 원하는 포트 번호
    host: true, // 네트워크 접근 허용 (선택사항)
    open: true  // 브라우저 자동 열기 (선택사항)
  }
})
