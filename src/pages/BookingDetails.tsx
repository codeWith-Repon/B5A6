/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { useGetDriverByIdQuery } from '@/redux/features/driver/driver.api';
import { useBookRideMutation } from '@/redux/features/Rider/rider.api';
import {
  Clock,
  CreditCard,
  MapPin,
  Wallet,
  Star,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import type { PaymentMethod } from '@/types';
import type { IBookRide } from '@/types/ride.types';

const BookingDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('CASH');

  const pickupLocation = searchParams.get('pickup');
  const dropLocation = searchParams.get('drop');
  const distance = searchParams.get('distance') || '';
  const time = searchParams.get('time');
  const driverId = searchParams.get('driver');
  const isAutoMatch = searchParams.get('autoMatch') === '1';
  const pickupLat = Number(searchParams.get('pickupLat'));
  const pickupLng = Number(searchParams.get('pickupLng'));

  const { data: driverResponse, isLoading: isDriverLoading } =
    useGetDriverByIdQuery(driverId as string, {
      skip: !driverId,
    });

  const driver = driverResponse?.data;

  const [bookRide, { isLoading: bookRideLoading }] = useBookRideMutation();

  const handleConfirmBooking = async () => {
    if (!pickupLocation || !dropLocation) {
      toast.error('Missing booking details. Please try again.');
      return;
    }
    if (!driverId && !isAutoMatch) {
      toast.error('Missing booking details. Please try again.');
      return;
    }

    const bookingData: IBookRide = {
      pickupLocation,
      dropLocation,
      distance: Number(distance.split(' ')[0]),
      paymentMethod: selectedPayment,
    };
    if (driverId) {
      bookingData.driver = driverId;
    } else if (isAutoMatch && Number.isFinite(pickupLat) && Number.isFinite(pickupLng)) {
      bookingData.pickupCoordinates = { lat: pickupLat, lng: pickupLng };
    }

    try {
      const r = await bookRide(bookingData).unwrap();
      console.log(r);
      toast.success('Ride Request Sent Successfully');
      navigate('/current-ride');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to book ride');
    }
  };

  if (isDriverLoading) {
    return (
      <div className='h-screen flex items-center justify-center font-bold'>
        Loading Ride Details...
      </div>
    );
  }

  if (!driver && !isAutoMatch) {
    return (
      <div className='h-screen flex items-center justify-center'>
        Driver not found!
      </div>
    );
  }

  const baseFare = distance ? parseFloat(distance) * 10 : 100;
  const tax = 0;
  const totalFare = baseFare + tax;

  return (
    <div className='py-8 min-h-screen'>
      <div className='container max-w-342.5 mx-auto px-4'>
        <div className='mb-6'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-xs font-semibold text-primary uppercase tracking-widest mb-3'>
            Step 2 — Confirm
          </div>
          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
            <span className='text-foreground'>Confirm</span>{' '}
            <span className='gradient-brand-text'>your ride</span>
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            {/* Ride & Driver Info */}
            <div className='glass rounded-3xl border border-border/40 p-6 shadow-xl shadow-primary/5'>
              <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <ShieldCheck className='text-primary' /> Ride Details
              </h2>

              <div className='mb-6 pb-6 border-b border-border'>
                {isAutoMatch && !driver ? (
                  <div className='flex items-start gap-4'>
                    <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary'>
                      <Sparkles className='w-7 h-7' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-lg font-bold text-foreground'>
                        We'll auto-match you
                      </h3>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Our matcher picks the best nearby driver the moment you
                        confirm — usually within seconds.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-start gap-4'>
                    {driver?.user?.image ? (
                      <img
                        src={driver.user.image}
                        alt={driver.user.name}
                        className='w-16 h-16 rounded-2xl object-cover border-2 border-primary/20'
                      />
                    ) : (
                      <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl'>
                        {driver?.user?.name?.charAt(0)}
                      </div>
                    )}

                    <div className='flex-1'>
                      <h3 className='text-lg font-bold text-foreground capitalize'>
                        {driver?.user?.name}
                      </h3>
                      <div className='flex items-center gap-2 mt-1'>
                        <div className='flex items-center gap-0.5'>
                          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                          <span className='text-sm font-semibold'>4.2</span>
                        </div>
                        <span className='text-sm text-muted-foreground'>
                          ({driver?.totalRides || 0} rides completed)
                        </span>
                      </div>
                      <p className='text-sm font-medium text-primary mt-2'>
                        🚗 {driver?.vehicle?.brand} {driver?.vehicle?.model} •{' '}
                        <span className='uppercase'>
                          {driver?.vehicle?.vehicleLicense}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Path Visualization */}
              <div className='space-y-4 mb-6 pb-6 border-b border-border'>
                <div className='flex gap-4'>
                  <div className='flex flex-col items-center mt-1'>
                    <div className='w-3 h-3 rounded-full border-2 border-primary bg-background'></div>
                    <div className='w-0.5 h-14 bg-dashed border-l-2 border-dotted border-muted-foreground/40 my-1'></div>
                    <div className='w-3 h-3 rounded-full bg-red-500'></div>
                  </div>
                  <div className='flex-1 space-y-8'>
                    <div>
                      <p className='text-[10px] text-muted-foreground uppercase font-black mb-1'>
                        Pickup
                      </p>
                      <p className='text-sm font-semibold leading-tight'>
                        {pickupLocation}
                      </p>
                    </div>
                    <div>
                      <p className='text-[10px] text-muted-foreground uppercase font-black mb-1'>
                        Drop-off
                      </p>
                      <p className='text-sm font-semibold leading-tight'>
                        {dropLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='glass-subtle rounded-2xl p-4 border border-border/40'>
                  <div className='flex items-center gap-2 text-muted-foreground text-xs mb-1 font-bold uppercase tracking-wider'>
                    <Clock className='w-4 h-4 text-primary' />
                    <span>Est. Time</span>
                  </div>
                  <p className='text-lg font-extrabold'>{time || 'N/A'}</p>
                </div>
                <div className='glass-subtle rounded-2xl p-4 border border-border/40'>
                  <div className='flex items-center gap-2 text-muted-foreground text-xs mb-1 font-bold uppercase tracking-wider'>
                    <MapPin className='w-4 h-4 text-primary' />
                    <span>Distance</span>
                  </div>
                  <p className='text-lg font-extrabold'>{distance || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Payment Selection */}
            <div className='glass rounded-3xl border border-border/40 p-6'>
              <h2 className='text-xl font-bold mb-6'>Select Payment</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
                {[
                  {
                    id: 'STRIPE',
                    label: 'Stripe',
                    icon: <CreditCard />,
                    desc: 'Global Card',
                    disabled: true,
                  },
                  {
                    id: 'PAYPAL',
                    label: 'PayPal',
                    icon: (
                      <svg
                        className='w-5 h-5'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                      >
                        <path d='M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.723a.641.641 0 0 1 .63-.532h10.364c.435 0 .813.298.913.722l.142.603c.036.15-.084.29-.239.29h-4.275a.55.55 0 0 0-.54.453L10.323 11.23a.55.55 0 0 0 .54.647h1.49c.39 0 .73.267.817.647l1.043 4.54a.55.55 0 0 1-.537.674H10.16a.55.55 0 0 0-.54.453l-.936 3.935a.55.55 0 0 1-.54.453z' />
                      </svg>
                    ),
                    desc: 'Fast Checkout',
                    disabled: true,
                  },
                  {
                    id: 'SSLCOMMERZ',
                    label: 'SSLCommerz',
                    icon: <ShieldCheck />,
                    desc: 'BD Local Pay',
                    disabled: true,
                  },
                  {
                    id: 'CASH',
                    label: 'Cash',
                    icon: <Wallet />,
                    desc: 'Pay Driver',
                    disabled: false,
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    disabled={method.disabled}
                    onClick={() =>
                      !method.disabled && setSelectedPayment(method.id as PaymentMethod)
                    }
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 overflow-hidden ${
                      method.disabled
                        ? 'opacity-60 cursor-not-allowed border-border/40 bg-muted/30'
                        : selectedPayment === method.id
                          ? 'border-primary/50 gradient-brand-soft shadow-lg shadow-primary/20 scale-[1.02]'
                          : 'border-border/40 glass-subtle hover:border-primary/30 hover-lift'
                    }`}
                  >
                    {/* 'Coming Soon' Badge for disabled methods */}
                    {method.disabled && (
                      <span className='absolute top-1 right-1 bg-muted-foreground text-[8px] text-white px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter'>
                        Soon
                      </span>
                    )}

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        selectedPayment === method.id
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {method.icon}
                    </div>

                    <div className='text-center'>
                      <p className='font-bold text-sm tracking-tight'>
                        {method.label}
                      </p>
                      <p className='text-[10px] text-muted-foreground whitespace-nowrap'>
                        {method.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className='lg:col-span-1'>
            <div className='glass-strong rounded-3xl border border-primary/20 p-6 sticky top-24 shadow-2xl shadow-primary/15'>
              <h3 className='text-lg font-extrabold uppercase mb-6 tracking-tight gradient-brand-text'>
                Fare Summary
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between text-sm font-medium'>
                  <span className='text-muted-foreground'>Ride Fare</span>
                  <span>৳{baseFare.toFixed(0)}</span>
                </div>
                <div className='flex justify-between text-sm font-medium'>
                  <span className='text-muted-foreground'>Service Fee</span>
                  <span>৳{tax}</span>
                </div>
                <div className='border-t-2 border-dashed border-border pt-4 flex justify-between items-end'>
                  <span className='font-black uppercase text-xs'>
                    Total Amount
                  </span>
                  <span className='text-3xl font-black text-primary tracking-tighter'>
                    ৳{totalFare.toFixed(0)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleConfirmBooking}
                disabled={!selectedPayment || bookRideLoading}
                className={`w-full mt-8 font-black h-14 rounded-2xl text-lg uppercase tracking-widest transition-transform active:scale-95 ${
                  !selectedPayment || bookRideLoading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
                    : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                }`}
              >
                {bookRideLoading ? (
                  <div className='flex items-center gap-2'>
                    <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
                    <span>Booking...</span>
                  </div>
                ) : (
                  'Confirm Ride'
                )}
              </Button>
              <p className='text-[10px] text-center text-muted-foreground mt-4 leading-relaxed'>
                By confirming, you agree to our Terms of Service and understand
                the cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
