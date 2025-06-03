import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import {
  AppOutline,
  UserOutline,
} from 'antd-mobile-icons';
import './index.less';

const tabs = [
  {
    key: '/',
    title: '首页',
    icon: <AppOutline />,
  },
  {
    key: '/me',
    title: '我的',
    icon: <UserOutline />,
  },
]
const BottomBar = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = React.useState(location.pathname);

  const onChange = (key) => {
    navigate(key);
    setActiveKey(key);
  };

  return (
    <TabBar className='bottom-bar' activeKey={activeKey} onChange={onChange}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

export default BottomBar;