self.addEventListener('notificationclick', function (event) {
  console.log('通知被点击了', event);
  const action = event.action;
  const notification = event.notification;
  if (action === 'view' || !action) {
    // 处理 "查看详情" 按钮的点击 || 点击了通知面板
    console.log('用户点击了查看详情');
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        console.log('clientList', clientList);
        if (clientList.length > 0) {
          // 有页面在运行，通知页面跳转
          clientList[0].postMessage({ type: 'NAVIGATE', url: notification.data.url });
          return clientList[0].focus();
        } else {
          // 没有已打开的页面，新开窗口（兜底）
          return self.clients.openWindow(notification.data.url);
        }
      })
    );
    notification.close(); // 关闭通知
  } else if (action === 'close') {
    // 处理 "关闭" 按钮的点击
    console.log('用户点击了关闭');
    notification.close(); // 关闭通知
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
