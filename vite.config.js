import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // 確保根目錄
  build: {
    outDir: 'dist', // 輸出到 dist
    emptyOutDir: true // 清空輸出目錄
  },
  server: {
    open: true // 開發時自動開瀏覽器
  }
});
