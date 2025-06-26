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

    if (navigator.onLine && connection.effectiveType === '4g') {
      // 网络好，直接请求服务端
      const res = await fetch('http://localhost:4000/collect', {
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
      // 存储到 IndexedDB，等会在 SW 中读取（也可用 localforage）
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
      try {
        await registration.sync.register('sync-collect');
        console.log('👍 收藏已保存，将在联网后自动同步');
      } catch (e) {
        console.error('后台同步注册失败', e);
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