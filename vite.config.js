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
      strategies: 'generateSW', // 默认generateSW，生成sw.js；如果injectManifest，则可以使用自定义sw.js
      includeAssets: ['vite.svg', 'icons/*', 'offline.html'], // 精确配置需要缓存的文件--非构建产物(仅匹配public路径下的文件)
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
      workbox: {
        // 构建期缓存策略
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg}'], // 扫描构建产物，匹配需要缓存的文件
        // 运行期缓存策略
        runtimeCaching: [
          // 缓存 HTML 页面
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
              },
            }
          },
          // 缓存 API 响应
          {
            urlPattern: /\/mock\/news.json/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'news-api-cache',
              expiration: {
                maxEntries: 50, // 最多缓存50条数据
                maxAgeSeconds: 60 * 60 * 24 * 7, // 缓存有效期为7天
             },
            }
          },
          // 缓存图片资源
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst', // 优先缓存，适合图片
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 缓存有效期为30天
              },
            },
          },
        ],
        // 配置离线回退页面
        navigateFallback: '/index.html',
        // 哪些请求不走fallback
        navigateFallbackDenylist: [
          // 排除 API 请求
          /^\/mock\//,
          // 排除资源文件
          /\/[^\/]+\.[^\/]+$/,
        ]
      },
      devOptions: {
        enabled: true,
      }
    }),
    mkcert()
  ],
})
