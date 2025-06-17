import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from '../../components/BottomBar';
import avatar from '../../assets/avatar.jpeg';
import { newsList } from '../../common/mock/newsList';
import './index.less';
import { Button } from 'antd-mobile';

const Me = () => {
  const navigate = useNavigate();
  const recentNews = newsList.slice(0, 5);

  useEffect(() => {
    console.log('App mounted', navigator);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Received message from service worker:', event.data);
        if (event.data && event.data.type === 'NAVIGATE') {
          navigate(event.data.url);
        }
      });
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
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker 不可用');
      return;
    }

    // 检查 Push 权限
    const permissionState = await navigator.permissions.query({ name: 'push' });
    if (permissionState.state !== 'granted') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') {
        console.error('用户未授权 Push 权限');
        return;
      }
    }
    console.log('permissionState', permissionState);

    try {
      const registration = await navigator.serviceWorker.ready;
      const publicVapidKey = 'BI5DkSF_y2i7ePRetT3LgV3RqUmr81ULV6TZUJ4-3-lBQXKEMdg3IU5-aNyoAS24GMdgS_cquGM2XE73b2yPI8k';
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      })
      const res = await fetch('https://pwa-push-server-production.up.railway.app/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      console.log('订阅成功：', res);
    } catch (error) {
      console.error('Push 订阅失败:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

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