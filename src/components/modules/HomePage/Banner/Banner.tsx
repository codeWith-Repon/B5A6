import { banner } from '@/assets';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const Banner = () => {
  return (
    <div className='mt-20 relative'>
      <div className='w-full '>
        <div className='absolute top-0 left-0 w-full h-full bg-black/30'></div>
        <img src={banner} alt='' className='w-full max-w-full ' />
        <div className='absolute top-1/2 2xl:left-[250px]  sm:left-[80px] left-[20px] -translate-y-1/2 sm:w-[500px]'>
          <h1 className='lg:text-5xl md:text-4xl sm:text-3xl text-2xl  font-bold text-white md:mb-3 mb-0'>
            Love to drive?
          </h1>
          <p className='text-white mb-4 lg:text-2xl md:text-xl text-base sm:w-full w-xs'>
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
