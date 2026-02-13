import { BookingMapSection } from '@/components/modules/HomePage/Ride/BookingMapSection';
import { useGetCurrentRideQuery } from '@/redux/features/Rider/rider.api';
import {
  ChevronLeft,
  Navigation,
  ShieldCheck,
  User,
  Mail,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function CurrentRidePage() {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetCurrentRideQuery(undefined);
  const ride = response?.data;

  if (isLoading)
    return (
      <div className='h-screen flex items-center justify-center font-black animate-pulse text-primary italic'>
        TRACKING YOUR JOURNEY...
      </div>
    );

  if (!ride)
    return (
      <div className='h-screen flex flex-col items-center justify-center space-y-4'>
        <p className='text-xl font-bold opacity-50 uppercase italic'>
          No Active Ride Found
        </p>
        <button
          onClick={() => navigate(-1)}
          className='text-primary underline font-black'
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className='min-h-screen bg-background p-4 lg:p-8'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header with Status */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 font-black uppercase text-xs hover:text-primary transition-colors'
          >
            <ChevronLeft className='w-4 h-4' /> Back to History
          </button>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-black uppercase text-muted-foreground italic'>
              Ride Status:
            </span>
            <Badge className='bg-primary text-white rounded-full px-4 italic font-black uppercase tracking-tighter'>
              {ride.rideStatus}
            </Badge>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          <div className='lg:col-span-7'>
            <BookingMapSection
              pickupLocation={ride.pickupLocation}
              dropLocation={ride.dropLocation}
            />
          </div>


          <div className='lg:col-span-5 space-y-6'>
            {/* Driver Information Card */}
            {ride.driver && (
              <div className='bg-card border p-6 rounded-4xl shadow-sm relative overflow-hidden'>
                <div className='absolute -top-4 -right-4 opacity-5 text-primary'>
                  <User size={120} />
                </div>
                <h3 className='text-xs font-black uppercase text-muted-foreground mb-4 flex items-center gap-2'>
                  <ShieldCheck size={14} className='text-primary' /> Driver
                  Details
                </h3>
                <div className='flex items-center gap-4'>
                  <Avatar className='w-20 h-20 border-4 border-primary/10'>
                    <AvatarImage src={ride.driver.user.image} />
                    <AvatarFallback className='bg-primary text-white font-black'>
                      {ride?.driver?.user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className='text-xl font-black uppercase italic leading-none'>
                      {ride?.driver?.user?.name}
                    </h2>
                    <p className='text-xs font-bold text-muted-foreground mt-1 flex items-center gap-1'>
                      <Mail size={12} /> {ride.driver.user.email}
                    </p>
                    <div className='mt-2 flex gap-2 flex-wrap'>
                      <Badge
                        variant='outline'
                        className='text-[9px] font-bold uppercase'
                      >
                        Exp: {ride.driver.experience} Year
                      </Badge>
                      <Badge
                        variant='outline'
                        className='text-[9px] font-bold uppercase'
                      >
                        License: {ride.driver.licenseNumber}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Journey & Fare Details */}
            <div className='bg-card border p-6 rounded-4xl shadow-sm space-y-6'>
              <h2 className='text-2xl font-black italic uppercase tracking-tighter text-primary border-b pb-2'>
                Journey Details
              </h2>

              {/* Timeline Style Locations */}
              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='w-3 h-3 rounded-full bg-primary' />
                    <div className='w-0.5 h-10 bg-border' />
                  </div>
                  <div>
                    <p className='text-[9px] font-black uppercase text-muted-foreground'>
                      Pickup Point
                    </p>
                    <p className='text-sm font-bold leading-tight'>
                      {ride.pickupLocation}
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <div className='flex flex-col items-center'>
                    <Navigation className='w-4 h-4 text-red-500 fill-red-500' />
                  </div>
                  <div>
                    <p className='text-[9px] font-black uppercase text-muted-foreground'>
                      Drop-off Point
                    </p>
                    <p className='text-sm font-bold leading-tight'>
                      {ride.dropLocation}
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
                <div>
                  <p className='text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1'>
                    <CreditCard size={12} /> Total Fare
                  </p>
                  <p className='text-3xl font-black text-foreground italic'>
                    ৳{ride.fare}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-[10px] font-black text-muted-foreground uppercase'>
                    Distance
                  </p>
                  <p className='text-2xl font-black text-primary italic'>
                    {ride.distance}{' '}
                    <span className='text-xs uppercase'>km</span>
                  </p>
                </div>
              </div>

              <div className='bg-muted/50 p-4 rounded-2xl flex justify-between items-center'>
                <div>
                  <p className='text-[9px] font-black text-muted-foreground uppercase'>
                    Payment Method
                  </p>
                  <p className='text-sm font-black italic'>
                    {ride.paymentMethod}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-[9px] font-black text-muted-foreground uppercase'>
                    Status
                  </p>
                  <p
                    className={`text-sm font-black italic ${ride.paymentStatus === 'UNPAID' ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {ride.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
