import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from '../../components/BottomBar';
import avatar from '../../assets/avatar.jpeg';
import { newsList } from '../../common/mock/newsList';
import './index.less';

const Me = () => {
  const navigate = useNavigate();
  const recentNews = newsList.slice(0, 5);

  const toDetail = (id) => {
    navigate(`/news/${id}`);
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