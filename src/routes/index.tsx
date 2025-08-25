import App from '@/App';
import DashboardLayout from '@/components/layout/DashboardLayout';
import About from '@/pages/About';
import Driver from '@/pages/Driver';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Verify from '@/pages/Verify';
import { generateRoutes } from '@/utils/generateRoutes';
import { createBrowserRouter, Navigate } from 'react-router';
import { adminSidebarItems } from './adminSidebarItems';
import { driverSidebarItems } from './DriverSidebarItem';
import { userSidebarItems } from './userSidebarItems';
import Unauthorized from '@/pages/Unauthorized';

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
        path: 'driver/register',
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: '/admin',
    children: [
      { index: true, element: <Navigate to='/admin/analytics' /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: DashboardLayout,
    path: '/driver',
    children: [
      { index: true, element: <Navigate to='/driver/ride-request' /> },
      ...generateRoutes(driverSidebarItems),
    ],
  },
  {
    Component: DashboardLayout,
    path: '/rider',
    children: [
      { index: true, element: <Navigate to='/rider/ride-request' /> },
      ...generateRoutes(userSidebarItems),
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
  {
    Component: Unauthorized,
    path: '/unauthorized',
  },
]);
