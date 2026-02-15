import { RegisterForm } from '@/components/modules/Authentication/RegisterForm';
import { Car } from 'lucide-react';
import { Link } from 'react-router';

const Register = () => {
  return (
    <div className='min-h-svh content-center'>
      <div className=''>
        <div className='flex flex-col gap-4 items-center md:p-0 p-4 mt-4 '>
          <Link
            to='/'
            className='text-primary hover:text-primary/90 flex items-center gap-1 '
          >
            <div className='p-2 rounded-lg bg-primary text-primary-foreground'>
              <Car className='w-5 h-5' />
            </div>
            <span className='font-bold text-lg dark:text-white'>RideFlow</span>
          </Link>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
