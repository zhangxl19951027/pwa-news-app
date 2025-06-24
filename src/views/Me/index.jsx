import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from '../../components/BottomBar';
import avatar from '../../assets/avatar.jpeg';
import { newsList } from '../../common/mock/newsList';
import './index.less';
import { Button } from 'antd-mobile';
import { requestPermission } from '../../common/utils/firebase-config';

const Me = () => {
  const navigate = useNavigate();
  const recentNews = newsList.slice(0, 5);

  useEffect(() => {
    console.log('App mounted', navigator);
    if ('serviceWorker' in navigator) {
      const messageHandler = (event) => {
        console.log('Received message from service worker:', event.data);
        if (event.data && event.data.type === 'NAVIGATE') {
          if (event.data.url.includes('://')) {
            location.href = event.data.url; // 跳转到外部链接
          } else {
            setTimeout(() => {
              navigate(event.data.url);
            }, 0);
          }
        } else if (event.data.isFirebaseMessaging) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(event.data.notification.title, {
              body: event.data.notification.body,
              icon: '/icons/icon-192x192.png',
              data: {
                url: event.data.notification.click_action, // 点击通知跳转的链接
              },
            })
          });
        }
      };
      navigator.serviceWorker.addEventListener('message', messageHandler);
      return () => {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      };
    }
  }, [])

  const toDetail = (id) => {
    navigate(`/news/${id}`);
  };

  const subscribeNotification = () => {
    Notification.requestPermission().then(function (result) {
      console.log("用户授权接收通知", result);
      if (result === "granted") {
        console.log("用户同意接收通知");
        setTimeout(() => {
          randomNotification();
        }, 3000)
      }
    });
    
  };

  const randomNotification = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('今日热点推荐', {
          body: '中国新能源汽车出口量跃居世界第一',
          icon: '/icons/icon-192x192.png', // 通知图标
          data: {
            url: '/news/3', // 点击通知跳转的链接
          },
          actions: [
            { action: 'view', title: '查看详情', icon: '/icons/icon-192x192.png' },
            { action: 'close', title: '关闭', icon: '/icons/icon-192x192.png' },
          ]
        });
      });
    }
  };

  const backgroundPush = async () => {
    console.log('backgroundPush', 'serviceWorker' in navigator);
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker 不可用');
      return;
    }

    // 检查 Push 权限
    const permissionState = await navigator.permissions.query({ name: 'push' });
    console.log('permissionState', JSON.parse(JSON.stringify(permissionState)), permissionState.state);
    if (permissionState.state !== 'granted') {
      const result = await Notification.requestPermission();
      console.log('requestPermission', result);
      if (result !== 'granted') {
        console.error('用户未授权 Push 权限');
        return;
      }
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('registration', registration, JSON.parse(JSON.stringify(registration)));
      const publicVapidKey = 'BI5DkSF_y2i7ePRetT3LgV3RqUmr81ULV6TZUJ4-3-lBQXKEMdg3IU5-aNyoAS24GMdgS_cquGM2XE73b2yPI8k';
      console.log('publicVapidKey', urlBase64ToUint8Array(publicVapidKey));
      console.log('publicVapidKey类型:', urlBase64ToUint8Array(publicVapidKey).constructor.name);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      })
      console.log('subscription', subscription, JSON.parse(JSON.stringify(subscription)), JSON.stringify(subscription));
      const res = await fetch('https://pwa-push-server-production.up.railway.app/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      console.log('订阅成功：', JSON.parse(JSON.stringify(res)), JSON.stringify(res));
    } catch (error) {
      console.error('Push 订阅失败:', error, JSON.parse(JSON.stringify(error)), JSON.stringify(error));
    }
  };

  // const urlBase64ToUint8Array = (base64String) => {
  //   console.log('urlBase64ToUint8Array', base64String);
  //   const padding = '='.repeat((4 - base64String.length % 4) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/\-/g, '+')
  //     .replace(/_/g, '/');
  //   const rawData = window.atob(base64);
  //   console.log('urlBase64ToUint8Array res', Uint8Array.from([...rawData].map(char => char.charCodeAt(0))));
  //   return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  // }

  const urlBase64ToUint8Array = (base64String) => { 
    console.log('urlBase64ToUint8Array222', base64String);
    const padding = '='.repeat((4 - base64String.length % 4) % 4); 
    const base64 = (base64String + padding) 
      .replace(/-/g, '+') 
      .replace(/_/g, '/'); 

    const rawData = window.atob(base64); 
    const outputArray = new Uint8Array(rawData.length); 

    for (let i = 0; i < rawData.length; ++i) { 
      outputArray[i] = rawData.charCodeAt(i); 
    } 
    console.log('urlBase64ToUint8Array res2', outputArray)
    return outputArray; 
  }; 

  const fcmPush = async () => {
    const token = await requestPermission();
    console.log('fcmPush token11111', token);
    const res = await fetch('https://pwa-push-server-production.up.railway.app/fcm_push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        title: '今日热点推荐2',
        body: '中国新能源汽车出口量跃居世界第一2',
      }),
    });
    console.log('fcmPush res', res);
  };


  return (
    <div className='me-container'>
      <div className='me-info'>
        <img src={avatar} alt='头像' className='avatar' />
        <div className='info-text'>
          <div className='nickname'>帅气的用户</div>
          <div className='desc'>我是一个随便看看的用户...</div>
        </div>
      </div>
      <Button onClick={subscribeNotification} size='mini' className='subscribe-btn'>订阅通知</Button>
      <Button onClick={backgroundPush} size='mini' className='subscribe-btn'>后台推送</Button>
      <Button onClick={fcmPush} size='mini' className='subscribe-btn'>FCM推送</Button>
      <div className='recent-news-box'>
        <div className='title'>最近浏览</div>
        <div className='news-list'>
          {
            recentNews.map((item, index) => {
              return (
                <div key={index} className='news-item' onClick={() => toDetail(item.id)}>
                    <div className='text-info'>
                      <div className='news-title'>{item.title}</div>
                      <div className='desc'>{item.desc}</div>
                    </div>
                    {
                      item.imgs.length > 0 ? <img src={item.imgs[0]} alt='图片' className='img' /> : null
                    }
                </div>
              );
            })
          }
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Me;