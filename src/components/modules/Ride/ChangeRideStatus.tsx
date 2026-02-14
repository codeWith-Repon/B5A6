/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUpdateRideStatusMutation } from '@/redux/features/Rider/rider.api';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, XCircle, CheckCircle, Navigation, Flag } from 'lucide-react';

interface ChangeRideStatusProps {
  rideId: string;
  currentStatus: string;
}

export const ChangeRideStatus = ({
  rideId,
  currentStatus,
}: ChangeRideStatusProps) => {
  const { data: userResponse } = useUserInfoQuery(undefined);
  const [updateStatus, { isLoading }] = useUpdateRideStatusMutation();

  const role = userResponse?.data?.role;

  const handleUpdate = async (newStatus: string) => {
    try {
      await updateStatus({ rideId, rideStatus: newStatus }).unwrap();
      toast.success(`Ride status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  // --- Rider Logic ---
  if (role === 'RIDER') {
    if (currentStatus === 'REQUESTED') {
      return (
        <Button
          className='w-full font-black uppercase italic py-6 rounded-2xl gap-2'
          onClick={() => handleUpdate('CANCELLED')}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='animate-spin' />
          ) : (
            <XCircle size={18} />
          )}
          Cancel Ride Request
        </Button>
      );
    }
    return null;
  }

  // --- Driver Logic ---
  if (role === 'DRIVER') {
    return (
      <div className='space-y-3'>
        {currentStatus === 'REQUESTED' && (
          <div className='flex gap-2'>
            <Button
              className='flex-1 bg-green-600 hover:bg-green-700 font-black uppercase rounded-2xl py-6 cursor-pointer'
              onClick={() => handleUpdate('ACCEPTED')}
              disabled={isLoading}
            >
              Accept Ride
            </Button>
            <Button
              variant='outline'
              className='flex-1 border-red-500 text-red-500 font-black uppercase rounded-2xl py-6 cursor-pointer'
              onClick={() => handleUpdate('REJECTED')}
              disabled={isLoading}
            >
              Reject
            </Button>
          </div>
        )}

        {currentStatus === 'ACCEPTED' && (
          <Button
            className='w-full bg-blue-600 hover:bg-blue-700 font-black uppercase rounded-2xl py-6 gap-2'
            onClick={() => handleUpdate('PICKED UP')}
            disabled={isLoading}
          >
            <CheckCircle size={18} /> Mark as Picked Up
          </Button>
        )}

        {currentStatus === 'PICKED UP' && (
          <Button
            className='w-full bg-orange-600 hover:bg-orange-700 font-black uppercase rounded-2xl py-6 gap-2'
            onClick={() => handleUpdate('IN TRANSIT')}
            disabled={isLoading}
          >
            <Navigation size={18} className='animate-pulse' /> Start Transit
          </Button>
        )}

        {currentStatus === 'IN TRANSIT' && (
          <Button
            className='w-full bg-green-600 hover:bg-green-700 font-black uppercase rounded-2xl py-6 gap-2'
            onClick={() => handleUpdate('COMPLETED')}
            disabled={isLoading}
          >
            <Flag size={18} /> Finish Ride
          </Button>
        )}
      </div>
    );
  }

  return null;
};
