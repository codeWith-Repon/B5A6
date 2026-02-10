import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import type { IRole } from '@/types';
import type { ComponentType } from 'react';
import { Navigate, useLocation } from 'react-router';

export const WithAuth = (Component: ComponentType, requiredRole?: IRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);
    const location = useLocation();

    if (!data?.data?.email) {
      const fullPath = `${location.pathname}${location.search}`;
      return <Navigate to='/login' state={{ from: fullPath }} replace />;
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to={'/unauthorized'} replace />;
    }

    return <Component />;
  };
};
