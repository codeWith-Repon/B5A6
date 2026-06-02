import { useParams, useNavigate } from 'react-router';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetRideDetailsQuery } from '@/redux/features/ride/ride.api';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';

export default function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: rideResponse, isLoading: rideLoading } =
    useGetRideDetailsQuery(id ?? '', { skip: !id });
  const { data: userResponse, isLoading: userLoading } =
    useUserInfoQuery(undefined);

  const ride = rideResponse?.data;
  const currentUserRole = userResponse?.data?.role;

  if (rideLoading || userLoading) {
    return (
      <div className='h-screen flex items-center justify-center animate-pulse font-black text-primary'>
        LOADING DETAILS...
      </div>
    );
  }

  if (!ride) return <div className='p-10 text-center'>Ride not found!</div>;

  return (
    <div className='min-h-screen p-4 lg:p-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Navigation & Status */}
        <div className='flex items-center justify-between'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 text-xs font-black uppercase'
          >
            <ChevronLeft size={16} /> Back
          </button>
          <Badge
            className={`${ride.rideStatus === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'} italic font-black`}
          >
            {ride.rideStatus}
          </Badge>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Section 1: Journey Details */}
          <div className='glass border border-border/40 p-6 rounded-3xl shadow-xl shadow-primary/5 space-y-6'>
            <h2 className='text-xl font-extrabold uppercase tracking-tight gradient-brand-text'>
              Journey Summary
            </h2>

            <div className='space-y-4'>
              <div className='flex gap-3'>
                <div className='flex flex-col items-center gap-1'>
                  <div className='w-3 h-3 rounded-full bg-primary' />
                  <div className='w-0.5 h-12 bg-border' />
                </div>
                <div>
                  <p className='text-[10px] font-black uppercase text-muted-foreground'>
                    Pickup
                  </p>
                  <p className='text-sm font-bold leading-tight'>
                    {ride.pickupLocation}
                  </p>
                </div>
              </div>

              <div className='flex gap-3'>
                <MapPin className='text-red-500' size={18} />
                <div>
                  <p className='text-[10px] font-black uppercase text-muted-foreground'>
                    Drop-off
                  </p>
                  <p className='text-sm font-bold leading-tight'>
                    {ride.dropLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className='pt-4 border-t grid grid-cols-2 gap-4'>
              <div>
                <p className='text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1'>
                  <Calendar size={12} /> Date
                </p>
                <p className='text-sm font-bold'>
                  {new Date(ride.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1'>
                  <Clock size={12} /> Time
                </p>
                <p className='text-sm font-bold'>
                  {new Date(ride.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Conditional User/Driver Info */}
          <div className='glass border border-border/40 p-6 rounded-3xl shadow-xl shadow-primary/5 space-y-6'>
            <h2 className='text-xl font-extrabold uppercase tracking-tight gradient-brand-text'>
              {currentUserRole === 'RIDER' ? 'Driver Details' : 'Rider Details'}
            </h2>

            {currentUserRole === 'RIDER' ? (
              // If Current User is RIDER, show DRIVER info
              <div className='flex items-center gap-4'>
                <Avatar className='w-16 h-16 border-2 border-primary/20'>
                  <AvatarImage src={ride.driver?.user?.image} />
                  <AvatarFallback className='font-black'>
                    {ride.driver?.user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='font-black uppercase italic text-lg'>
                    {ride.driver?.user?.name}
                  </h3>
                  <p className='text-xs text-muted-foreground font-bold'>
                    {ride.driver?.user?.email}
                  </p>
                  <div className='flex gap-2 mt-2'>
                    <Badge variant='outline' className='text-[9px]'>
                      EXP: {ride.driver?.experience} YR
                    </Badge>
                    <Badge variant='outline' className='text-[9px]'>
                      LIC: {ride.driver?.licenseNumber}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              // If Current User is DRIVER, show RIDER (User) info
              <div className='flex items-center gap-4'>
                <Avatar className='w-16 h-16 border-2 border-primary/20'>
                  <AvatarFallback className='font-black bg-primary text-white'>
                    {ride.user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='font-black uppercase italic text-lg'>
                    {ride.user?.name}
                  </h3>
                  <p className='text-xs text-muted-foreground font-bold'>
                    {ride.user?.email}
                  </p>
                  <Badge className='mt-2 bg-blue-500/10 text-blue-600 text-[10px] border-none'>
                    PREMIUM RIDER
                  </Badge>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className='pt-6 border-t'>
              <div className='flex justify-between items-end'>
                <div>
                  <p className='text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1'>
                    <CreditCard size={12} /> Fare Paid via {ride.paymentMethod}
                  </p>
                  <p className='text-4xl font-black italic'>৳{ride.fare}</p>
                </div>
                <div className='text-right'>
                  <p className='text-[10px] font-black text-muted-foreground uppercase'>
                    Distance
                  </p>
                  <p className='text-xl font-black text-primary italic'>
                    {ride.distance} KM
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 p-3 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${ride.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                Payment Status: {ride.paymentStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Security Info */}
        <div className='glass-subtle border border-border/40 p-4 rounded-2xl flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
          <div className='flex items-center gap-2'>
            <ShieldCheck size={14} className='text-primary' />
            Ride ID: {ride._id}
          </div>
          <div>OTP Verified: {ride.isOtpVerified ? 'YES' : 'NO'}</div>
        </div>
      </div>
    </div>
  );
}
