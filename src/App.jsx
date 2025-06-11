import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import InstallTip from './components/InstallTip';
import VConsole from 'vconsole';

new VConsole(); // 初始化

function App() {

  return (
    <>
      <InstallTip />
      <RouterProvider router={router} />
    </>
  )
}

export default App
