import { createBrowserRouter } from 'react-router-dom';
import Home from '../views/Home';
import Me from '../views/Me';
import NewsDetail from '../views/NewsDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/me',
    element: <Me />,
  },
  {
    path: '/news/:id',
    element: <NewsDetail />,
  },
]);

export default router;