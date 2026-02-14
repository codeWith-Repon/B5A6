/* eslint-disable @typescript-eslint/no-explicit-any */
import { useVerifyRideOtpMutation } from '@/redux/features/Rider/rider.api';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const OtpVerification = ({ rideId }: { rideId: string }) => {
  const [verifyRideOtp] = useVerifyRideOtpMutation();
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return toast.error('Please enter a valid 6-digit OTP');
    }
    try {
      await verifyRideOtp({ otp, rideId }).unwrap();
      setOtp('');
      toast.success('OTP verified successfully');
    } catch (error: any) {
      toast.error(error?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className='mt-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl'>
      <div className='flex items-center gap-2 mb-3'>
        <ShieldCheck className='w-5 h-5 text-primary' />
        <h4 className='font-bold text-sm uppercase tracking-tight'>
          Verify Pickup OTP
        </h4>
      </div>
      <div className='flex gap-3 flex-wrap'>
        <input
          type='text'
          maxLength={6}
          placeholder='Enter 6-digit OTP'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className='flex-1 px-4 py-2 bg-background border border-border rounded-xl font-mono text-center tracking-widest text-lg focus:ring-2 focus:ring-primary outline-none'
        />
        <button
          onClick={handleVerify}
          className='bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity'
        >
          VERIFY
        </button>
      </div>
      <p className='text-[10px] text-muted-foreground mt-2 italic'>
        * Ask the passenger for the 6-digit code to start the ride.
      </p>
    </div>
  );
};

export default OtpVerification;
