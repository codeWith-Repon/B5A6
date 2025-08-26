import { map } from '@/assets';
import GetRide from '../../Rider/GetRide';

const HeroSection = () => {
  return (
    <section className='mt-15'>
      <div className='flex md:flex-row flex-col items-start justify-between '>
        <div className='flex gap-4 flex-col max-w-[600px]'>
          <h1 className='text-7xl font-semibold'>
            Get ready for your first trip
          </h1>
          <p className='mt-5 mb-4 text-muted-foreground'>
            Discover the convenience of Uber. Request a ride now, or schedule
            one for later directly from your browser.
          </p>
          <div className=' '>
            <GetRide />
          </div>
        </div>
        <div className='mt-[16px]'>
          <img src={map} alt='' />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
