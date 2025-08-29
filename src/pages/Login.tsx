import Logo from '@/assets/icon/Logo';
import { LoginForm } from '@/components/modules/Authentication/LoginForm';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import Spinner from '@/utils/spinner';
import { Link, Navigate } from 'react-router';

const Login = () => {
  const { data, isLoading } = useUserInfoQuery(undefined);
  if (data?.success) {
    return <Navigate to='/' replace />;
  }

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className='min-h-svh content-center'>
      <div className='flex flex-col items-center justify-center'>
        <div className='min-w-xs flex flex-col gap-4 items-center'>
          <Link to={'/'}>
            <Logo />
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
