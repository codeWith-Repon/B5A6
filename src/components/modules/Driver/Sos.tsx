import { Button } from '@/components/ui/button';
import { rideStatus } from '@/constants/rideStatus';
import { useGetCurrentRideQuery } from '@/redux/features/Rider/rider.api';
import { useSendEmergencyMessageMutation } from '@/redux/features/SOS/sos.api';
import { toast } from 'sonner';

const Sos = () => {
  const { data: currentRideData } = useGetCurrentRideQuery(undefined);
  const [sendEmergencyMessage] = useSendEmergencyMessageMutation();

  const handleSendEmergencyMessage = async () => {
    const rideId = currentRideData?.data?._id;
    if (!rideId) {
      toast.error('No active ride');
      return;
    }

    const location = await new Promise<string>((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve('Unknown location');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve(`Lat ${pos.coords.latitude}, Lng ${pos.coords.longitude}`),
        () => resolve('Unknown location'),
        { timeout: 5000 }
      );
    });

    try {
      await sendEmergencyMessage({
        rideId,
        location,
        message: 'SOS triggered from active ride',
      }).unwrap();

      toast.success('Emergency message sent successfully');
    } catch (error) {
      toast.error('Failed to send emergency message');
      console.log('Failed to send emergency message', error);
    }
  };

  return (
    <div className='ml-1 mb-1'>
      {currentRideData?.success && (
        <>
          {[rideStatus.inTransit, rideStatus.pickedUp].includes(
            currentRideData.data.rideStatus
          ) && (
            <Button
              onClick={handleSendEmergencyMessage}
              className='bg-green-600 '
            >
              Send SOS
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Sos;
