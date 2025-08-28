import { car, map } from '@/assets';

const HeroSection = () => {
  return (
    <section className='mt-15'>
      <div className='flex lg:flex-row flex-col items-start justify-between lg:items-center sm:items-center '>
        <div className='flex md:gap-4 flex-col lg:max-w-[600px] md:max-w-[776px]'>
          <h1 className='md:text-7xl font-semibold sm:text-5xl text-4xl'>
            Get ready for your first trip
          </h1>
          <p className='md:mt-5 sm:mt-3 mt-2 mb-4 text-muted-foreground'>
            Discover the convenience of Uber. Request a ride now, or schedule
            one for later directly from your browser.
          </p>
          <div className='w-full'>
            <img src={car} alt='' className='w-full h-full object-cover' />
          </div>
        </div>
        <div className='lg:mt-[16px] md:mt-15 sm:mt-10 mt-8  xl:w-[50%] md:w-full flex lg:justify-end md:justify-center'>
          <img src={map} alt='' className='lg:w-[90%]' />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
