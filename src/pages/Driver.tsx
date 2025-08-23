import { VehicleForm } from '@/components/modules/Driver/VehicleForm';

const Driver = () => {
  return (
    <div>
      <div className='content-center flex flex-col items-center mt-20 mb-20'>
        <div className='w-full max-w-xl'>
          <VehicleForm />
        </div>
      </div>
    </div>
  );
};

export default Driver;
