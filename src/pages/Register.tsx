import Logo from '@/assets/icon/Logo';
import { RegisterForm } from '@/components/modules/Authentication/RegisterForm';
import { Link } from 'react-router';

const Register = () => {
  return (
    <div className='min-h-svh content-center'>
      <div className=''>
        <div className='flex flex-col gap-4 items-center'>
          <Link to={'/'}>
            <Logo />
          </Link>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
