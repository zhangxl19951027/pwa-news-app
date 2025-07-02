import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import InstallTip from './components/InstallTip';
import VConsole from 'vconsole';
import { messaging } from './common/utils/firebase-config';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { openDB } from 'idb';

new VConsole(); // 初始化

function App() {

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📥 收到前台消息:', payload);

      // new Notification(payload.notification.title, {
      //   body: payload.notification.body,
      //   icon: '/icons/icon-192x192.png',
      //   data: { url: payload.fcmOptions?.link }
      // });
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/icons/icon-192x192.png',
          data: {
            url: payload.fcmOptions?.link, // 点击通知跳转的链接
          },
        })
      });
    });

    // 可选：如果 firebase 新版本支持 unsubscribe，建议返回清理函数
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('App mounted', navigator);
    if ('serviceWorker' in navigator) {
      // 监听postMessage事件
      const messageHandler = (event) => {
        console.log('Received message from service worker:', event.data);
        if (event.data && event.data.type === 'NAVIGATE') {
          if (event.data.url.includes('://')) {
            location.href = event.data.url; // 跳转到外部链接
          } else {
            setTimeout(() => {
              location.href = event.data.url
            }, 0);
          }
        } else if (event.data?.type == 'REQUEST') {
          syncCollectToServer();
        } else if (event.data?.type == 'CACHE_NEWS_LIST') {
          cacheLatestNewsList();
        }
        // else if (event.data.isFirebaseMessaging) {
        //   navigator.serviceWorker.ready.then((registration) => {
        //     registration.showNotification(event.data.notification.title, {
        //       body: event.data.notification.body,
        //       icon: '/icons/icon-192x192.png',
        //       data: {
        //         url: event.data.notification.click_action, // 点击通知跳转的链接
        //       },
        //     })
        //   });
        // }
      };
      navigator.serviceWorker.addEventListener('message', messageHandler);
      return () => {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      };
    }
  }, []);

  useEffect(() => {
    async function requestPersistPermission() {
      console.log('请求持久化权限', navigator.storage);
      if (navigator.storage && navigator.storage.persist) {
        const persisted = await navigator.storage.persisted();
        console.log(`持久化权限已获取: ${persisted}`);
        if (!persisted) {
          const success = await navigator.storage.persist();
          console.log(`持久化权限获取成功: ${success}`);
        }
      }
    }
  
    requestPersistPermission();
  }, [])

  const syncCollectToServer = async () => {
    const db = await openDB('pwa-news-db', 1);
    const allCollect = await db.getAll('collect');
    console.log('allCollect', allCollect);

    for (const collect of allCollect) {
      try {
        const res = await fetch('https://pwa-push-server-production.up.railway.app/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: collect.id }),
        });

        if (res.ok) {
          await db.delete('collect', collect.id); // 成功后清除缓存
          console.log(`✅ 同步成功: ${collect.id}`);
        }
      } catch (err) {
        console.error(`❌ 同步失败: ${collect.id}`, err);
        // 下次继续尝试
      }
    }
  }

  const cacheLatestNewsList = async () => {
    try {
      const response = await fetch('https://pwa-push-server-production.up.railway.app/news_list');
      const res = await response.json();
  
      // 打开 IndexedDB 并保存新闻
      const db = await openDB('pwa-news-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('newsList')) {
            db.createObjectStore('newsList', { keyPath: 'id' });
          }
        },
      });
  
      await db.put('newsList', { id: 'latest', data: res.list });
      console.log('✅ 最新新闻已更新到 IndexedDB');
      res.list.forEach((item) => {
        item.imgs?.length && cacheNewsImages(item.imgs);
      })
    } catch (error) {
      console.error('❌ 同步失败:', error);
    }
  }

  const cacheNewsImages = async (imgs) => {
    const cache = await caches.open('news-image-cache');
  
    imgs.forEach(async (imageUrl) => {
      const matched = await isImageCached(imageUrl);
      if (imageUrl && !matched) {
        try {
          const response = await fetch(imageUrl);
          if (response.ok) {
            await cache.put(imageUrl, response.clone());
            console.log(`✅ 图片已缓存: ${imageUrl}`);
          }
        } catch (err) {
          console.error(`❌ 缓存失败: ${imageUrl}`, err);
        }
      }
    });
  };
  
  // 简单判断是否已缓存
  const isImageCached = async (url) => {
    const cache = await caches.open('news-image-cache');
    const match = await cache.match(url);
    return !!match;
  };

  return (
    <>
      <InstallTip />
      <RouterProvider router={router} />
    </>
  )
}

export default App
