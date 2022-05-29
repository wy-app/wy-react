import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const path = require('path')
import eslint from '@rollup/plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [react(),
  {
    ...eslint({
      include: 'src/**/**/*.+(js|jsx|ts|tsx)'
    }),
    enforce: 'pre'
  }],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') },]
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/style/index.scss";`
      }
    }
  },
  server: {
    port: 8989,
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true
      },
    }
  }
})

