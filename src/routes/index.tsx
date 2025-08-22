import App from '@/App';
import About from '@/pages/About';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    Component: App,
    path: '/',
    children: [
      {
        Component: HomePage,
        index: true,
      },
      {
        Component: About,
        path: 'about',
      },
    ],
  },
  {
    Component: Login,
    path: '/login',
  },
  {
    Component: Register,
    path: '/register',
  },
]);
