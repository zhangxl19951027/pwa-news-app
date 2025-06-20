import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDzPlIKbqallzh-n35PLg6655gXqAh2Cr0",
  authDomain: "pwa-fcm-test-7c829.firebaseapp.com",
  projectId: "pwa-fcm-test-7c829",
  storageBucket: "pwa-fcm-test-7c829.firebasestorage.app",
  messagingSenderId: "578932496902",
  appId: "1:578932496902:web:d9d5a90fb8fdbddacc4187",
  measurementId: "G-JRFJFP8QNC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const vapidKey = 'BEdmfI03aIefgzQRqwlNyMToyWZzUhyZRgEYfE0oSZzjsLSJatn5HqKdB0KIWAlnTiTy0lWpdiW88joS2kSjPt4';

export async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const currentToken = await getToken(messaging, { vapidKey });
    console.log('FCM Token:', currentToken);
    // 你需要把这个 token 发给你的服务端
    return currentToken;
  } else {
    console.warn('Notification permission denied');
  }
}

export { messaging };