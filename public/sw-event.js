self.addEventListener('notificationclick', function (event) {
  console.log('通知被点击了', event);
  const action = event.action;
  const notification = event.notification;
  notification.close(); // 关闭通知
  if (action === 'view' || !action) {
    // 处理 "查看详情" 按钮的点击 || 点击了通知面板
    console.log('用户点击了查看详情');
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        console.log('clientList', clientList);
        let focusedClient = null;

        for (let client of clientList) {
          if (client.visibilityState === 'visible') {
            focusedClient = client;
            break;
          }
        }

        if (focusedClient) {
          focusedClient.postMessage({ type: 'NAVIGATE', url: notification.data.url });
          return focusedClient.focus();
        } else if (clientList.length > 0) {
          clientList[0].postMessage({ type: 'NAVIGATE', url: notification.data.url });
          return clientList[0].focus();
        } else {
          return self.clients.openWindow(notification.data.url);
        }
      })
    );
  } else if (action === 'close') {
    // 处理 "关闭" 按钮的点击
    console.log('用户点击了关闭');
  }
});

self.addEventListener('push', event => {
  console.log('收到推送', event);
  if (event.data) {
    const { title, body } = event.data.json();
    console.log('推送数据', event.data.json());
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        data: {
          url: '/news/3', // 点击通知跳转的链接
        },
      })
    );
  }
});


self.addEventListener('sync', (event) => {
  console.log('sync event', event);
  if (event.tag === 'sync-collect') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        console.log('clientList', clientList);
        let focusedClient = null;

        for (let client of clientList) {
          if (client.visibilityState === 'visible') {
            focusedClient = client;
            break;
          }
        }

        if (focusedClient) {
          focusedClient.postMessage({ type: 'REQUEST' });
        } else if (clientList.length > 0) {
          clientList[0].postMessage({ type: 'REQUEST' });
        } else {
          console.log('没有打开的页面');
        }
      })
    );
  }
});