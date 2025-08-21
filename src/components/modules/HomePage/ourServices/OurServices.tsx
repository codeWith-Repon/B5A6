import OurServicesTabs from './OurServicesTabs';

const OurServices = () => {
  return (
    <div className='flex flex-col gap-10 mt-8'>
      <h1 className='text-4xl font-bold'>Your travel buddy</h1>
      <OurServicesTabs />
    </div>
  );
};

export default OurServices;
