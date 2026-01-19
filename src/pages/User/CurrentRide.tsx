import { VerifyRideOtp } from '@/components/modules/Rider/VerifyRideOtp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { rideStatus } from '@/constants/rideStatus';
import {
  useGetCurrentRideQuery,
  useUpdateRideStatusMutation,
} from '@/redux/features/Rider/rider.api';
import { useSendEmergencyMessageMutation } from '@/redux/features/SOS/sos.api';
import Spinner from '@/utils/spinner';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const CurrentRide = () => {
  const {
    data: rideData,
    isLoading: rideLoading,
    isError,
  } = useGetCurrentRideQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  const navigate = useNavigate();

  const [updateRideStatus] = useUpdateRideStatusMutation();
  const [sendEmergencyMessage, { isLoading: sosLoading }] =
    useSendEmergencyMessageMutation();

  if (rideLoading) {
    return <Spinner />;
  }

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

  const handleSendEmergencyMessage = async () => {
    console.log(rideData?.data?._id);
    try {
      const res = await sendEmergencyMessage({
        rideId: rideData?.data?._id,
      }).unwrap();
      console.log(res);
      toast.success('Emergency message sent successfully');
    } catch (error) {
      toast.error('Failed to send emergency message');
      console.log('Failed to send emergency message', error);
    }
  };

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

        {rideData?.data ? (
          rideData.data.rideStatus === rideStatus.requested && (
            <Button
              className='primary cursor-pointer'
              onClick={handleCancelRide}
            >
              Cancel Ride
            </Button>
          )
        ) : (
          <Button
            size='lg'
            onClick={() => navigate('/get-ride')}
            className={`border bg-primary border-primary text-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer`}
          >
            Get Ride
          </Button>
        )}

        {rideData?.data &&
          rideData.data.rideStatus === rideStatus.pickedUp &&
          rideData.data.rideStatus !== rideStatus.inTransit && (
            <Button
              className='bg-green-600 cursor-pointer'
              onClick={handleSendEmergencyMessage}
              disabled={sosLoading}
            >
              {sosLoading ? 'Sending SOS...' : 'Send SOS'}
            </Button>
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
