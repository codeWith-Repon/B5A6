import { RegisterForm } from '@/components/modules/Authentication/RegisterForm';
import { Car } from 'lucide-react';
import { Link } from 'react-router';

const Register = () => {
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
              Create your account
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Start riding in minutes
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
