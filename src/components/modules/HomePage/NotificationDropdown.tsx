/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, Check, MapPin, Ban, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router';
import { useGetRideHistoryQuery } from '@/redux/features/ride/ride.api';


function getStatusConfig(status: string) {
  switch (status) {
    case 'COMPLETED':
      return {
        color:
          'bg-green-500/[0.03] border-l-4 border-green-500 hover:bg-green-500/[0.06]',
        iconColor: 'bg-green-500/20 text-green-600',
        icon: <Check className='w-3.5 h-3.5' />,
        title: 'Ride Completed',
      };
    case 'CANCELLED':
      return {
        color:
          'bg-red-500/[0.03] border-l-4 border-red-500 hover:bg-red-500/[0.06]',
        iconColor: 'bg-red-500/20 text-red-600',
        icon: <Ban className='w-3.5 h-3.5' />,
        title: 'Ride Cancelled',
      };
    case 'REJECTED':
      return {
        color:
          'bg-orange-500/[0.03] border-l-4 border-orange-500 hover:bg-orange-500/[0.06]',
        iconColor: 'bg-orange-500/20 text-orange-600',
        icon: <AlertCircle className='w-3.5 h-3.5' />,
        title: 'Ride Rejected',
      };
    default:
      return {
        color:
          'bg-blue-500/[0.03] border-l-4 border-blue-500 hover:bg-blue-500/[0.06]',
        iconColor: 'bg-blue-500/20 text-blue-600',
        icon: <MapPin className='w-3.5 h-3.5' />,
        title: 'Ride Update',
      };
  }
}


function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export function NotificationDropdown() {
  const navigate = useNavigate();

  const { data: response, isLoading } = useGetRideHistoryQuery(undefined);
  const rideHistory = response?.data || [];

  const unreadCount = rideHistory.filter((ride: any) => {
    const isRecent =
      new Date().getTime() - new Date(ride.updatedAt).getTime() <
      24 * 60 * 60000;
    return isRecent && ride.rideStatus !== 'COMPLETED';
  }).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='relative hover:bg-primary/10 transition-colors group'
        >
          <Bell className='w-6 h-6 text-foreground/80 group-hover:text-primary transition-transform group-hover:scale-110' />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 flex h-4 w-4'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold ring-2 ring-background'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-96 p-0 shadow-2xl border-primary/10'
        align='end'
      >
        <div className='p-4 border-b flex items-center justify-between bg-muted/30'>
          <h3 className='font-bold text-foreground'>Notifications</h3>
          {unreadCount > 0 && (
            <span className='bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase'>
              {unreadCount} New
            </span>
          )}
        </div>

        <div className='max-h-112.5 overflow-y-auto'>
          {isLoading ? (
            <div className='p-8 text-center animate-pulse text-sm italic'>
              Loading...
            </div>
          ) : rideHistory.length === 0 ? (
            <div className='p-8 text-center'>
              <Bell className='w-12 h-12 text-foreground/20 mx-auto mb-3' />
              <p className='text-sm text-foreground/60'>
                No notifications found
              </p>
            </div>
          ) : (
            rideHistory.map((ride: any) => {
              const config = getStatusConfig(ride.rideStatus);
              return (
                <div
                  key={ride._id}
                  onClick={() => navigate(`/ride/${ride._id}`)}
                  className={`p-4 border-b border-border/50 ${config.color} transition-all cursor-pointer relative group`}
                >
                  <div className='flex items-start gap-3'>
                    <div
                      className={`mt-1 p-2 rounded-full ${config.iconColor}`}
                    >
                      {config.icon}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='font-bold text-sm text-foreground'>
                          {config.title}
                        </p>
                        <span className='text-[10px] text-foreground/40 font-medium'>
                          {formatTime(ride.updatedAt)}
                        </span>
                      </div>
                      <p className='text-xs text-foreground/70 mt-1 line-clamp-2 leading-relaxed'>
                        {ride.rideStatus === 'COMPLETED'
                          ? `Ride from ${ride.pickupLocation.split(',')[0]} to ${ride.dropLocation.split(',')[0]} finished.`
                          : `Your ride request was ${ride.rideStatus.toLowerCase()}.`}
                      </p>
                      <div className='mt-2 flex items-center gap-2'>
                        <span className='text-[10px] font-black text-primary italic uppercase'>
                          ৳{ride.fare} • {ride.distance}km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {rideHistory.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/ride-history')}
              className='p-3 text-center text-xs font-bold text-primary justify-center cursor-pointer hover:bg-primary/5'
            >
              VIEW ALL RIDE HISTORY
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
