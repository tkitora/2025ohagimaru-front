// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Node.jsのpathモジュールをインポート

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@' というエイリアスを 'src' ディレクトリの絶対パスとして設定
      '@': path.resolve(__dirname, './src'),
    },
  },
});