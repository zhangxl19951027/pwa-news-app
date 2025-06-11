import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.less';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsInfo, setNewsInfo] = useState({});

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
    </div>
  );
};

export default NewsDetail;