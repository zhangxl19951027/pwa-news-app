import React from 'react';
import BottomBar from '../../components/BottomBar';
import { useNavigate } from 'react-router-dom';
import { newsList } from '../../common/mock/newsList';
import './index.less';

const Home = () => {
  const navigate = useNavigate();

  const toDetail = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className='home-container'>
      <div className='page-title'>新闻推荐</div>
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