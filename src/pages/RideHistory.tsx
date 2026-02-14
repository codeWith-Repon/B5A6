/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { MapPin, Search, ChevronLeft, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useGetRideHistoryQuery } from '@/redux/features/ride/ride.api';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import OtpVerification from '@/components/modules/Ride/Otpverification';
import { ActiveRideSidebarCard } from '@/components/modules/Ride/ActiveRideSidebarCard';

export default function RideHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null);
  const [currenRide, setCurrenRide] = useState(false);

  const { data: rideHistoryResponse, isLoading } =
    useGetRideHistoryQuery(undefined);
  const { data: userInfo } = useUserInfoQuery(undefined);

  const rides = rideHistoryResponse?.data || [];
  const role = userInfo?.data?.role;

  const filteredRides = rides.filter((ride: any) => {
    const displayName =
      role === 'DRIVER' ? ride.user?.name : ride.driver?.user?.name;
    const matchesSearch =
      (displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'ALL' || ride.rideStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className='p-10 text-center font-bold animate-pulse uppercase tracking-widest'>
        Loading Your Rides...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background text-foreground '>
      <div className='py-8'>
        <div className='container max-w-7xl mx-auto px-4'>
          {/* Header */}
          <div className='flex items-center gap-4 mb-8'>
            <button
              onClick={() => navigate(-1)}
              className='p-2 hover:bg-muted rounded-full border border-border transition-colors'
            >
              <ChevronLeft className='w-6 h-6' />
            </button>
            <div>
              <h1 className='text-3xl font-black uppercase italic tracking-tighter'>
                Ride History ({role})
              </h1>
              <p className='text-muted-foreground text-sm font-medium'>
                Tracking {rides.length} journey{rides.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
            <div className='lg:col-span-1 lg:sticky lg:top-37.5 order-2 lg:order-1'>
              <ActiveRideSidebarCard setCurrenRide={setCurrenRide} />
            </div>

            <div
              className={`lg:col-span-3 ${!currenRide ? 'lg:col-span-4' : ''}`}
            >
              {/* Filters and Search */}
              <div className='bg-card border border-border rounded-3xl p-5 mb-8 shadow-sm'>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <input
                      type='text'
                      placeholder={
                        role === 'DRIVER'
                          ? 'Search passenger...'
                          : 'Search driver...'
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-full pl-10 pr-4 py-2.5 bg-muted/50 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm'
                    />
                  </div>
                  <div className='flex gap-2 overflow-x-auto pb-1 md:pb-0'>
                    {[
                      'ALL',
                      'COMPLETED',
                      'ACCEPTED',
                      'REQUESTED',
                      'CANCELLED',
                      'REJECTED',
                    ]
                      .filter((status) =>
                        role === 'DRIVER' ? status !== 'REQUESTED' : true,
                      )
                      .map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                            filterStatus === status
                              ? 'bg-primary text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Rides list */}
              <div className='space-y-4'>
                {filteredRides.length === 0 ? (
                  <div className='bg-card border border-dashed border-border rounded-4xl p-16 text-center'>
                    <MapPin className='w-12 h-12 text-muted-foreground/20 mx-auto mb-4' />
                    <p className='text-lg font-bold uppercase tracking-tighter'>
                      No rides found
                    </p>
                  </div>
                ) : (
                  filteredRides.map((ride: any) => {
                    const partyName =
                      role === 'DRIVER'
                        ? ride.user?.name
                        : ride.driver?.user?.name;
                    const partyImage =
                      role === 'DRIVER'
                        ? ride.user?.image
                        : ride.driver?.user?.image;
                    const partyLabel =
                      role === 'DRIVER' ? 'Passenger' : 'Driver';

                    return (
                      <div
                        key={ride._id}
                        className={`bg-card border border-border rounded-3xl overflow-hidden transition-all duration-300 ${
                          expandedRideId === ride._id
                            ? 'ring-2 ring-primary'
                            : ''
                        }`}
                      >
                        {/* Main Summary */}
                        <div
                          onClick={() =>
                            setExpandedRideId(
                              expandedRideId === ride._id ? null : ride._id,
                            )
                          }
                          className='p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                        >
                          <div className='flex items-center gap-4'>
                            <Avatar className='w-14 h-14 border-2 border-muted'>
                              <AvatarImage src={partyImage} />
                              <AvatarFallback className='bg-primary text-white'>
                                {(partyName || 'U').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='text-[9px] font-bold text-primary uppercase'>
                                {partyLabel}
                              </p>
                              <h3 className='font-black text-sm uppercase'>
                                {partyName || 'N/A'}
                              </h3>
                              <div className='flex items-center gap-2 mt-1'>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    ride.rideStatus === 'COMPLETED'
                                      ? 'bg-green-100 text-green-700'
                                      : ride.rideStatus === 'CANCELLED' ||
                                          ride.rideStatus === 'REJECTED'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                  }`}
                                >
                                  {ride.rideStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-xl font-black text-primary'>
                              ৳{ride.fare}
                            </div>
                            <div className='text-[10px] font-bold text-muted-foreground uppercase'>
                              {ride.distance} KM
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedRideId === ride._id && (
                          <div className='px-5 pb-5 pt-2 border-t border-border/50 bg-muted/10'>
                            {role === 'RIDER' &&
                              ride.rideStatus === 'ACCEPTED' &&
                              !ride.isOtpVerified && (
                                <OtpVerification rideId={ride._id} />
                              )}

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                              <div className='space-y-4'>
                                <div className='flex items-start gap-3'>
                                  <div className='mt-1 space-y-1 flex flex-col items-center'>
                                    <div className='w-2 h-2 rounded-full bg-primary' />
                                    <div className='w-0.5 h-8 bg-muted-foreground/20' />
                                    <div className='w-2 h-2 rounded-full bg-red-500' />
                                  </div>
                                  <div className='space-y-3'>
                                    <div>
                                      <p className='text-[9px] uppercase font-bold text-muted-foreground'>
                                        Pickup
                                      </p>
                                      <p className='text-sm font-bold'>
                                        {ride.pickupLocation}
                                      </p>
                                    </div>
                                    <div>
                                      <p className='text-[9px] uppercase font-bold text-muted-foreground'>
                                        Drop-off
                                      </p>
                                      <p className='text-sm font-bold'>
                                        {ride.dropLocation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className='bg-background rounded-2xl p-4 border border-border grid grid-cols-2 gap-4'>
                                <div>
                                  <p className='text-[9px] font-black uppercase text-muted-foreground'>
                                    Payment
                                  </p>
                                  <p className='text-xs font-bold'>
                                    {ride.paymentStatus}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-[9px] font-black uppercase text-muted-foreground'>
                                    OTP Status
                                  </p>
                                  <p className='text-xs font-bold text-primary'>
                                    {ride.isOtpVerified
                                      ? 'VERIFIED'
                                      : 'PENDING'}
                                  </p>
                                </div>
                                <div className='col-span-2 pt-2 border-t flex justify-between items-center'>
                                  <div className='flex items-center gap-1 text-[10px] font-bold'>
                                    <Calendar className='w-3 h-3' />{' '}
                                    {format(
                                      new Date(ride.createdAt),
                                      'dd MMM yyyy',
                                    )}
                                  </div>
                                  {ride.completedAt && (
                                    <div className='flex items-center gap-1 text-[10px] font-bold'>
                                      <Clock className='w-3 h-3' />{' '}
                                      {format(
                                        new Date(ride.completedAt),
                                        'hh:mm a',
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
