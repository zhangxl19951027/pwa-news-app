import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StarOutline, LikeOutline } from 'antd-mobile-icons';
import './index.less';
import { openDB } from 'idb';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsInfo, setNewsInfo] = useState({});
  const [isCollect, setIsCollect] = useState(false);

  useEffect(() => {
    getNewsDetail();
  }, [id]);

  const getNewsDetail = async () => {
    const res = await fetch('/mock/news.json');
    const data = await res.json();
    const detail = data.find(item => item.id === +id);
    console.log('news detail fetch', detail);
    setNewsInfo(detail);
  };

  const collect = async () => {
    console.log('collect');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      console.log('当前网络类型:', connection.effectiveType); // 如 '4g', '3g', '2g', 'slow-2g'
      console.log('网络是否节流模式:', connection.saveData); // true 表示用户开启了流量节省
    }

    if (navigator.onLine) {
      // 网络好，直接请求服务端
      const res = await fetch('https://pwa-push-server-production.up.railway.app/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const resData = await res.json();
      if (resData.success) {
        console.log('👍 收藏成功');
        setIsCollect(!isCollect);
      }
    } else {
      // 网络慢，后台同步
      // 存储到 IndexedDB，等会在 SW 中读取（也可用 localstorage）
      const db = await openDB('pwa-news-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('collect')) {
            db.createObjectStore('collect', { keyPath: 'id' });
          }
        },
      });
      await db.put('collect', { id, timestamp: Date.now() });

      // 注册后台同步任务
      const registration = await navigator.serviceWorker.ready;
      console.log('注册后台同步任务', registration);
      if ('sync' in registration) {
        try {
          await registration.sync.register('sync-collect');
          console.log('👍 收藏已保存，将在联网后自动同步');
        } catch (e) {
          console.error('后台同步注册失败', e);
        }
      } else {
        console.warn('当前浏览器不支持 Background Sync，考虑降级处理');
        const handler = async () => {
          console.log('网络已恢复，开始执行同步');
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
        window.addEventListener('online', () => {
          handler();
        });
        // 页面从后台返回时
        document.addEventListener('visibilitychange', () => {
          console.log('document.visibilityState', document.visibilityState);
          if (document.visibilityState === 'visible') {
            if (navigator.onLine) {
              console.log('🚀 网络正常，准备同步');
              handler();
            } else {
              console.log('📴 当前离线，等待网络恢复');
            }
          }
        });
      }
    }
  };

  const like = () => {
    console.log('like');
  };

  return (
    <div className='news-detail-container'>
      <div className='title-box'>
        <div className='title'>{newsInfo?.title}</div>
        <div className='author-info'>
          <div className='author'>{newsInfo?.author}</div>
          <div className='time'>{newsInfo?.create_time}</div>
        </div>
      </div>
      <div className='content-box'>
        <div className='imgs'>
          {
            newsInfo?.imgs?.map((img, index) => (
              <img key={img} src={img} alt='' />
            ))
          }
        </div>
        <div className='content'>
          {newsInfo?.content}
        </div>
      </div>
      <div className='op-box'>
        <div className='op-item' onClick={collect}>
          <StarOutline fontSize={200} style={{color: isCollect ? 'red' : ''}} />
          <div className='text'>{isCollect ? '取消' : ''}收藏</div>
        </div>
        <div className='op-item' onClick={like}>
          <LikeOutline />
          <div className='text'>点赞</div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;