import { LoginForm } from '@/components/modules/Authentication/LoginForm';
import Loader from '@/components/shared/Loader';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { Car, HatGlasses } from 'lucide-react';
import { Link, Navigate } from 'react-router';

const Login = () => {
  const { data, isLoading } = useUserInfoQuery(undefined);
  if (data?.success) {
    return <Navigate to='/' replace />;
  }

  if (isLoading) {
    return (
      <Loader
        animate={false}
        icon={HatGlasses}
        iconSize={27}
        fullPage={true}
        text='Authenticating...'
      />
    );
  }
  return (
    <div className='min-h-svh content-center'>
      <div className='flex flex-col items-center justify-center'>
        <div className='min-w-xs flex flex-col gap-4 items-center md:p-0 p-4'>
          <Link
            to='/'
            className='text-primary hover:text-primary/90 flex items-center gap-1 '
          >
            <div className='p-2 rounded-lg bg-primary text-primary-foreground'>
              <Car className='w-5 h-5' />
            </div>
            <span className='font-bold text-lg dark:text-white'>RideFlow</span>
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
