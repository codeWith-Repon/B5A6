import App from '@/App';
import DashboardLayout from '@/components/layout/DashboardLayout';
import About from '@/pages/About';
import AllDriver from '@/pages/Admin/AllDriver';
import Analytics from '@/pages/Admin/Analytics';
import Driver from '@/pages/Driver';
import RideRequest from '@/pages/Driver/RideRequest';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Verify from '@/pages/Verify';
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
      {
        Component: Driver,
        path: 'driver',
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: '/admin',
    children: [
      {
        Component: Analytics,
        path: 'analytics',
      },
      {
        Component: AllDriver,
        path: 'all-driver',
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: '/driver',
    children: [
      {
        Component: RideRequest,
        path: 'ride-request',
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
  {
    Component: Verify,
    path: '/verify',
  },
]);
