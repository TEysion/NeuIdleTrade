import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // dev 独有配置
      plugins: [
        vue(),
      ],
      
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:4534/api', // 目标地址 --> 服务器地址
            changeOrigin: true, // 允许跨域
            ws: true,  // 允许websocket代理
            rewrite: (path) => path.replace(/^\/api/, "")
          },
          
         },
      },
    }
  } else {
    return {
      plugins: [
        vue(),
      ],
      minify: true,
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
      },
      server: {
      },
    }
  }
})

