import OurServicesTabs from './OurServicesTabs';

const OurServices = () => {
  return (
    <div className='flex flex-col gap-10 mt-8 overflow-x-hidden'>
      <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold'>Your travel buddy</h1>
      <OurServicesTabs />
    </div>
  );
};

export default OurServices;
