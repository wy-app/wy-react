const path = require('path')
import eslint from '@rollup/plugin-eslint'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    {
      ...eslint({
        include: 'src/**/**/*.+(js|jsx|ts|tsx|vue)'
      }),
      enforce: 'pre'
    },
    react()
  ],
  base: '/wy',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/style/index.scss";`
      }
    }
  },
  server: {
    open: true,
    host: '0.0.0.0',
    port: 8888,
    https: false,
    proxy: {
      '/api': {
        // target: 'https://bgbasis.com:40000',
        // target: 'http://nps.bgbasis.net',
        // changeOrigin: true
      },
    }
  }
})
