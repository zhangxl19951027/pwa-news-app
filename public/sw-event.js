self.addEventListener('notificationclick', function (event) {
  console.log('通知被点击了', event);
  const action = event.action;
  const notification = event.notification;
  if (action === 'view' || !action) {
    // 处理 "查看详情" 按钮的点击 || 点击了通知面板
    console.log('用户点击了查看详情');
    event.waitUntil(clients?.openWindow(notification.data.url)); // 打开链接
    notification.close(); // 关闭通知
  } else if (action === 'close') {
    // 处理 "关闭" 按钮的点击
    console.log('用户点击了关闭');
    notification.close(); // 关闭通知
  }
});
