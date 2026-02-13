import { useNavigate } from 'react-router';
import { Navigation, ArrowRight } from 'lucide-react';
import { useGetCurrentRideQuery } from '@/redux/features/Rider/rider.api';
import { useEffect } from 'react';

interface ActiveRideSidebarCardProps {
  setCurrenRide: (val: boolean) => void;
}

export const ActiveRideSidebarCard = ({
  setCurrenRide,
}: ActiveRideSidebarCardProps) => {
  const navigate = useNavigate();
  const { data: currentRideResponse, isSuccess } =
    useGetCurrentRideQuery(undefined);
  const ride = currentRideResponse?.data;

  useEffect(() => {
    if (isSuccess) {
      setCurrenRide(!!ride);
    }
    console.log(currentRideResponse);
  }, [currentRideResponse, isSuccess, ride, setCurrenRide]);

  if (!ride) return null;

  return (
    <div className='bg-primary text-white rounded-3xl p-5 shadow-xl shadow-primary/20 border border-white/10 animate-in slide-in-from-right-8 duration-500'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='p-2 bg-white/20 rounded-lg animate-pulse'>
          <Navigation className='w-5 h-5 text-white' />
        </div>
        <div>
          <p className='text-[10px] font-black uppercase opacity-70 tracking-widest'>
            Active Ride
          </p>
          <h4 className='font-bold text-sm'>Ongoing Journey</h4>
        </div>
      </div>

      <div className='space-y-2 mb-5'>
        <div className='flex items-center gap-2'>
          <div className='w-1.5 h-1.5 rounded-full bg-white' />
          <p className='text-[11px] font-medium truncate opacity-90'>
            {ride.pickupLocation}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-1.5 h-1.5 rounded-full bg-red-400' />
          <p className='text-[11px] font-medium truncate opacity-90'>
            {ride.dropLocation}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/current-ride')}
        className='w-full bg-white text-primary py-3 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all active:scale-95'
      >
        Show Details
        <ArrowRight className='w-4 h-4' />
      </button>
    </div>
  );
};
