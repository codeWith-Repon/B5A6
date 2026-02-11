/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { MapPin, Search, ChevronLeft, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useGetRideHistoryQuery } from '@/redux/features/ride/ride.api';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';

export default function RideHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null);

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
        <div className='container max-w-342.5 mx-auto px-4 '>
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
                Tracking your {rides.length} journey
                {rides.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className='bg-card border border-border rounded-3xl p-5 mb-8 shadow-sm'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <input
                  type='text'
                  placeholder={
                    role === 'DRIVER'
                      ? 'Search passenger or location...'
                      : 'Search driver or location...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2.5 bg-muted/50 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm'
                />
              </div>
              <div className='flex gap-2 overflow-x-auto pb-1 md:pb-0'>
                {['ALL', 'COMPLETED', 'REQUESTED', 'CANCELLED']
                  .filter((status) =>
                    role === 'DRIVER' ? status !== 'REQUESTED' : true,
                  )
                  .map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                        filterStatus === status
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                  role === 'DRIVER' ? ride.user?.name : ride.driver?.user?.name;
                const partyImage =
                  role === 'DRIVER'
                    ? ride.user?.image
                    : ride.driver?.user?.image;
                const partyLabel = role === 'DRIVER' ? 'Passenger' : 'Driver';

                return (
                  <div
                    key={ride._id}
                    className={`bg-card border border-border rounded-3xl overflow-hidden transition-all duration-300 ${
                      expandedRideId === ride._id
                        ? 'ring-2 ring-primary shadow-xl'
                        : 'hover:shadow-md'
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
                        <Avatar className='w-14 h-14 border-2 border-muted shadow-sm'>
                          <AvatarImage src={partyImage} />
                          <AvatarFallback className='font-bold bg-primary text-white text-xs'>
                            {(partyName || 'U').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-[9px] font-bold text-primary uppercase tracking-widest'>
                            {partyLabel}
                          </p>
                          <h3 className='font-black text-sm uppercase tracking-tight'>
                            {partyName ||
                              (role === 'RIDER' ? 'Assigning...' : 'Unknown')}
                          </h3>
                          <div className='flex items-center gap-2 mt-1'>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                ride.rideStatus === 'COMPLETED'
                                  ? 'bg-green-100 text-green-700'
                                  : ride.rideStatus === 'CANCELLED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {ride.rideStatus}
                            </span>
                            <span className='text-[10px] font-bold text-muted-foreground flex items-center gap-1'>
                              <Calendar className='w-3 h-3' />
                              {format(new Date(ride.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0'>
                        <div className='text-xl font-black text-primary tracking-tighter'>
                          ৳{ride.fare}
                        </div>
                        <div className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                          {ride.distance} KM • {ride.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedRideId === ride._id && (
                      <div className='px-5 pb-5 pt-2 border-t border-border/50 bg-muted/20 animate-in slide-in-from-top-2 duration-300'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
                          <div className='space-y-4'>
                            <div className='flex gap-3'>
                              <div className='flex flex-col items-center mt-1'>
                                <div className='w-3 h-3 rounded-full border-2 border-primary bg-background'></div>
                                <div className='w-0.5 h-10 bg-linear-to-b from-primary to-red-500 my-1'></div>
                                <div className='w-3 h-3 rounded-full border-2 border-red-500 bg-background'></div>
                              </div>
                              <div className='flex-1 space-y-4'>
                                <div>
                                  <p className='text-[10px] font-black text-muted-foreground uppercase tracking-widest'>
                                    Pickup
                                  </p>
                                  <p className='text-[14px] font-bold leading-tight mt-1'>
                                    {ride.pickupLocation}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-[10px] font-black text-muted-foreground uppercase tracking-widest'>
                                    Drop-off
                                  </p>
                                  <p className='text-[14px] font-bold leading-tight mt-1'>
                                    {ride.dropLocation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='bg-background rounded-2xl p-4 border border-border grid grid-cols-2 gap-4'>
                            <div>
                              <p className='text-[10px] font-black text-muted-foreground uppercase'>
                                Payment
                              </p>
                              <p
                                className={`text-xs font-bold mt-1 ${ride.paymentStatus === 'UNPAID' ? 'text-orange-500' : 'text-green-600'}`}
                              >
                                {ride.paymentStatus}
                              </p>
                            </div>
                            <div>
                              <p className='text-[10px] font-black text-muted-foreground uppercase'>
                                OTP Verified
                              </p>
                              <p className='text-xs font-bold mt-1'>
                                {ride.isOtpVerified ? 'YES' : 'NO'}
                              </p>
                            </div>
                            <div className='col-span-2 pt-2 border-t border-border'>
                              <p className='text-[10px] font-black text-muted-foreground uppercase'>
                                Completed At
                              </p>
                              <div className='flex items-center gap-1 mt-1 font-bold text-xs'>
                                <Clock className='w-3 h-3' />
                                {ride.completedAt
                                  ? format(
                                      new Date(ride.completedAt),
                                      'hh:mm a',
                                    )
                                  : 'N/A'}
                              </div>
                            </div>
                            {role === 'DRIVER' && (
                              <div className='col-span-2 pt-2 border-t border-border'>
                                <p className='text-[10px] font-black text-muted-foreground uppercase'>
                                  Passenger Email
                                </p>
                                <p className='text-xs font-bold mt-1'>
                                  {ride.user?.email}
                                </p>
                              </div>
                            )}
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
  );
}
