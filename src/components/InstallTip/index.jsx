import { useState, useEffect } from 'react';
import './index.less';
import { Button } from 'antd-mobile';

const InstallTip = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt', e);
      e.preventDefault(); // 阻止自动弹窗
      setDeferredPrompt(e); // 存起来
      setShowInstallButton(true); // 显示“安装”按钮
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // 手动触发提示
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('用户接受安装');
      } else {
        console.log('用户取消安装');
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <>
      {
        showInstallButton ? <div className='install-tip'>
          <Button onClick={handleInstallClick} color='primary' fill='none' size='small'>📲 安装 App</Button>
        </div> : null
      }
    </>
  )
}

export default InstallTip;  