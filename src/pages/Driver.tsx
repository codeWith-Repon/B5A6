import DriverForm from '@/components/modules/Driver/DriverForm';
import { VehicleForm } from '@/components/modules/Driver/VehicleForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useSearchParams } from 'react-router';

const Driver = () => {
  const { isLoading: userLoading } = useUserInfoQuery(undefined);
  const [searchParams] = useSearchParams();

  const isVehicleRegistered = searchParams.get('vehicleRegistered') === 'true';

  return (
    <div>
      <div className='content-center flex flex-col items-center mt-20 mb-20'>
        <div className='w-full max-w-xl'>
          {userLoading ? (
            <div className='flex flex-col items-center justify-center space-y-3'>
              <Skeleton className='h-[300px] w-full rounded-xl' />
            </div>
          ) : !isVehicleRegistered ? (
            <VehicleForm />
          ) : (
            <DriverForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default Driver;
