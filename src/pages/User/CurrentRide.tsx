import GetRideModal from '@/components/modules/Rider/GetRideModal';
import { VerifyRideOtp } from '@/components/modules/Rider/VerifyRideOtp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { rideStatus } from '@/constants/rideStatus';
import {
  useGetCurrentRideQuery,
  useUpdateRideStatusMutation,
} from '@/redux/features/Rider/rider.api';
import { toast } from 'sonner';

const CurrentRide = () => {
  const {
    data: rideData,
    isLoading: rideLoading,
    isError,
  } = useGetCurrentRideQuery(undefined);

  const [updateRideStatus] = useUpdateRideStatusMutation();

  const handleCancelRide = async () => {
    if (!rideData?.data?._id) return;
    try {
      const res = await updateRideStatus({
        rideId: rideData?.data?._id,
        rideStatus: rideStatus.cancelled,
      }).unwrap();
      console.log(res);
      toast.success('Ride cancelled successfully');

    } catch (error) {
      toast.error('Failed to cancel ride');
      console.log('Failed to cancel ride', error);
    }
  };

  console.log(rideData);

  if (rideLoading) {
    // Skeleton Loading State
    return (
      <div className='flex flex-col gap-4 w-full max-w-4xl mx-auto animate-pulse'>
        <div className='flex items-center justify-between'>
          <div className='h-6 w-32 bg-gray-300 rounded'></div>
          <div className='h-8 w-24 bg-gray-300 rounded'></div>
        </div>
        <Card className='w-full'>
          <CardContent className='space-y-3'>
            <div className='h-4 w-1/2 bg-gray-300 rounded'></div>
            <div className='h-4 w-1/3 bg-gray-300 rounded'></div>
            <div className='h-4 w-1/4 bg-gray-300 rounded'></div>
            <div className='h-4 w-1/3 bg-gray-300 rounded'></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 w-full max-w-4xl mx-auto'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold mb-3'>Current Ride</h1>

        {rideData?.data?.rideStatus === rideStatus.requested && (
          <Button className='primary cursor-pointer' onClick={handleCancelRide}>
            Cancel Ride
          </Button>
        )}

        {(isError || !rideData) && (
          <GetRideModal isError={isError} rideData={rideData} />
        )}
      </div>
      <Card className='w-full '>
        <CardContent>
          {!isError || rideData ? (
            <div className=''>
              <p className='text-lg'>
                Pickup Location :{' '}
                <span className='font-bold text-sm'>
                  {rideData?.data?.pickupLocation}
                </span>
              </p>
              <p className='text-lg'>
                Drop Location :{' '}
                <span className='font-bold text-sm'>
                  {rideData?.data?.dropLocation}
                </span>
              </p>
              <p>
                Status :{' '}
                <span className='font-bold text-sm'>
                  {rideData?.data?.rideStatus}
                </span>
              </p>
              <div className='flex items-center gap-4'>
                <p>
                  Is OTP Verified :{' '}
                  <span className='font-bold text-sm'>
                    {rideData?.data?.isOtpVerified ? 'true' : 'false'}
                  </span>
                </p>
                <Button
                  className='primary cursor-pointer'
                  variant={'outline'}
                  size={'sm'}
                  asChild
                >
                  <VerifyRideOtp />
                </Button>
              </div>
              <p>
                Fare :{' '}
                <span className='font-bold text-sm'>
                  {rideData?.data?.fare}
                </span>
              </p>
              <p>
                Payment :{' '}
                <span className='font-bold text-sm'>
                  {rideData?.data?.payment?.status}
                </span>
              </p>
            </div>
          ) : (
            <div className=''>No rides found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentRide;
