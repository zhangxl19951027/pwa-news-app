import React, { useEffect, useState } from 'react';
import BottomBar from '../../components/BottomBar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd-mobile';
import { openDB } from 'idb';
import './index.less';

const Home = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    getNewsList()
  }, []);

  const getNewsList = async () => {
    const res = await fetch('/mock/news.json');
    const data = await res.json();
    console.log('news fetch', data);
    setNewsList(data);
  };

  const toDetail = (id) => {
    navigate(`/news/${id}`);
  };

  const refresh = async () => {
    if (navigator.onLine) {
      getNewsList();
    } else {
      try {
        const db = await openDB('pwa-news-db', 1);
        const newsRecord = await db.get('newsList', 'latest');
        if (newsRecord) {
          console.log('cached news_list', newsRecord);
          setNewsList(newsRecord.data);
        } else {
          console.log('no cached news_list');
        }
      } catch (error) {
        console.error('❌ 读取 IndexedDB 失败:', error);
      }
    }
  };

  return (
    <div className='home-container'>
      <div className='page-title'>新闻推荐</div>
      <Button onClick={refresh} size='mini' className='refresh-btn'>刷新数据</Button>
      <div className='news-list'>
        {
          newsList.map((item) => (
            <div key={item.id} className='news-item' onClick={() => toDetail(item.id)}>
              <div className='news-title'>{item.title}</div>
              <div className='news-desc'>{item.desc}</div>
              {
                item.imgs.length > 0 && (
                  <div className={`news-imgs ${item.imgs.length === 1 ? 'single' : 'multiple'}`}>
                    {
                      item.imgs.map((img, index) => (
                        <img key={img} src={img} alt='' />
                      ))
                    }
                  </div>
                )
              }
              <div className='news-author-time'>
                <div className='news-author'>{item.author}</div>
                <div className='news-time'>{item.create_time}</div>
              </div>
            </div>
          ))
        }
      </div>
      <BottomBar />
    </div>
  );
};

export default Home;