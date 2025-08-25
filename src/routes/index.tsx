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
import { WithAuth } from '@/utils/WithAuth';
import { role } from '@/constants/role';
import type { IRole } from '@/types';

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
        Component: WithAuth(Driver, role.rider as IRole),
        path: 'driver/register',
      },
    ],
  },
  {
    Component: WithAuth(DashboardLayout, role.superAdmin as IRole),
    path: '/admin',
    children: [
      { index: true, element: <Navigate to='/admin/analytics' /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: WithAuth(DashboardLayout, role.driver as IRole),
    path: '/driver',
    children: [
      { index: true, element: <Navigate to='/driver/ride-request' /> },
      ...generateRoutes(driverSidebarItems),
    ],
  },
  {
    Component: WithAuth(DashboardLayout, role.rider as IRole),
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
