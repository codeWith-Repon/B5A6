import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetRidesQuery } from '@/redux/features/Rider/rider.api';
import { useEffect, useState } from 'react';

const CurrentRide = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: rideData } = useGetRidesQuery(
    { user: userId },
    { skip: !userId }
  );
  console.log(rideData);

  useEffect(() => {
    if (userData?.data?._id) {
      setUserId(userData.data._id);
    }
  }, [userData]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold mb-3'>Current Ride</h1>
        <Button className='primary cursor-pointer'>Cancel Ride</Button>
      </div>
      <Card className='w-full '>
        <CardContent>
          <div className=''>
            <p className='text-lg'>
              Pickup Location :{' '}
              <span className='font-bold text-sm'>
                {rideData?.data[0]?.pickupLocation}
              </span>
            </p>
            <p className='text-lg'>
              Drop Location :{' '}
              <span className='font-bold text-sm'>
                {rideData?.data[0]?.dropLocation}
              </span>
            </p>
            <p>
              Status :{' '}
              <span className='font-bold text-sm'>
                {rideData?.data[0]?.rideStatus}
              </span>
            </p>
            <div className='flex items-center gap-4'>
              <p>
                Is OTP Verified :{' '}
                <span className='font-bold text-sm'>
                  {rideData?.data[0]?.isOtpVerified ? 'true' : 'false'}
                </span>
              </p>
              <Button
                className='primary cursor-pointer'
                variant={'outline'}
                size={'sm'}
              >
                Verify OTP
              </Button>
            </div>
            <p>
              Fare :{' '}
              <span className='font-bold text-sm'>
                {rideData?.data[0]?.fare}
              </span>
            </p>
            <p>
              Payment :{' '}
              <span className='font-bold text-sm'>
                {rideData?.data[0]?.payment?.status}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentRide;
