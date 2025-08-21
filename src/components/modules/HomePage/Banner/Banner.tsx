import { banner } from '@/assets';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const Banner = () => {
  return (
    <div className='mt-20'>
      <div className='w-full relative'>
        <div className='absolute top-0 left-0 w-full h-full bg-black/30'></div>
        <img src={banner} alt='' className='w-full max-w-full ' />
        <div className='absolute top-1/2 left-[317px] -translate-y-1/2 w-[500px]'>
          <h1 className='text-5xl font-bold text-white mb-3'>Love to drive?</h1>
          <p className='text-white mb-4 text-2xl'>
            Be your own boss and track your earnings as you cruise down the
            streets.
          </p>
          <Button className='primary rounded-bl-[20px] rounded-tl-none'>
            <Link to='/register'>Register as a Driver</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
