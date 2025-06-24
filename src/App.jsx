import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import InstallTip from './components/InstallTip';
import VConsole from 'vconsole';
import { messaging } from './common/utils/firebase-config';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';

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

    console.log('App mounted', navigator);
    if ('serviceWorker' in navigator) {
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

    // 可选：如果 firebase 新版本支持 unsubscribe，建议返回清理函数
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <>
      <InstallTip />
      <RouterProvider router={router} />
    </>
  )
}

export default App
