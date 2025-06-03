import React from 'react';
import { useParams } from 'react-router-dom';
import { newsList } from '../../common/mock/newsList';
import './index.less';

const NewsDetail = () => {
  const { id } = useParams();
  const newsInfo = newsList.find((item) => item.id === Number(id));

  return (
    <div className='news-detail-container'>
      <div className='title-box'>
        <div className='title'>{newsInfo.title}</div>
        <div className='author-info'>
          <div className='author'>{newsInfo.author}</div>
          <div className='time'>{newsInfo.create_time}</div>
        </div>
      </div>
      <div className='content-box'>
        <div className='imgs'>
          {
            newsInfo.imgs.map((img, index) => (
              <img key={img} src={img} alt='' />
            ))
          }
        </div>
        <div className='content'>
          {newsInfo.content}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;