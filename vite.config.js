import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: true,
    host: '0.0.0.0',  // 允许外部设备访问
    port: 5173,
    allowedHosts: ['.ngrok-free.app']
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PWA 新闻APP', // 全名
        short_name: 'PWA 新闻', // 简称
        description: 'PWA 新闻APP 测试demo', // 描述
        theme_color: '#f00', // 主题色 顶部工具栏颜色
        background_color: '#00f', // 背景色
        display: 'standalone', // 显示模式
        scope: '/', // 作用域
        start_url: '/', // 启动页
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ]
      },
      devOptions: {
        enabled: true,
      }
    }),
    mkcert()
  ],
})
