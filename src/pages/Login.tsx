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
    <div className='relative min-h-svh overflow-hidden flex items-center justify-center px-4 py-10'>
      <div className='aurora' aria-hidden />
      <div className='relative z-10 w-full max-w-md flex flex-col items-center gap-6'>
        <Link
          to='/'
          className='group flex items-center gap-2 transition-opacity hover:opacity-90'
        >
          <div className='p-2.5 rounded-xl gradient-brand text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow'>
            <Car className='w-5 h-5' />
          </div>
          <span className='font-extrabold text-xl gradient-brand-text'>
            RideFlow
          </span>
        </Link>
        <div className='w-full glass-strong rounded-3xl border border-border/40 shadow-2xl shadow-primary/10 p-6 md:p-8'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl md:text-3xl font-extrabold tracking-tight text-foreground'>
              Welcome back
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Sign in to continue your journey
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
