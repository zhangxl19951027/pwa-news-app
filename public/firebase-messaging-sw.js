importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDzPlIKbqallzh-n35PLg6655gXqAh2Cr0",
  authDomain: "pwa-fcm-test-7c829.firebaseapp.com",
  projectId: "pwa-fcm-test-7c829",
  storageBucket: "pwa-fcm-test-7c829.firebasestorage.app",
  messagingSenderId: "578932496902",
  appId: "1:578932496902:web:d9d5a90fb8fdbddacc4187",
  measurementId: "G-JRFJFP8QNC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    data: {
      url: payload.notification.click_action, // 点击通知跳转的链接
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
