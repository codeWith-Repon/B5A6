/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Mail } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '@/redux/features/auth/auth.api';
import { cn } from '@/lib/utils';
import { AuthShell } from '@/components/modules/Authentication/AuthShell';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(120);

  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyLoading }] = useVerifyOtpMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email || !confirmed) return;

    const timerId = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [email, confirmed, timer]);

  const handleSentOtp = async () => {
    const toastId = toast.loading('Sending OTP...');
    try {
      const res = await sendOtp({ email: email }).unwrap();
      if (res.success) {
        toast.success('OTP Sent!', { id: toastId });
        setTimer(120);
        setConfirmed(true);
      }
    } catch (error) {
      toast.error('Something went wrong', { id: toastId });
      console.log(error);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastId = toast.loading('Verifying OTP...');

    const userinfo = {
      email: email,
      otp: data.pin,
    };

    try {
      const res = await verifyOtp(userinfo).unwrap();
      if (res.success) {
        toast.success('OTP Verified!', { id: toastId });
        navigate('/');
      }
    } catch (error: any) {
      if (error.data.message) {
        toast.error(error.data.message, { id: toastId });
      }
      console.log(error);
    }
  };

  if (confirmed) {
    return (
      <AuthShell
        title='Enter verification code'
        subtitle={`We sent a 6-digit code to ${email}`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col items-center gap-6'
          >
            <FormField
              control={form.control}
              name='pin'
              render={({ field }) => (
                <FormItem className='flex flex-col items-center'>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className='text-center'>
                    <Button
                      className={cn('h-auto p-0', {
                        'cursor-pointer': timer === 0,
                        'text-muted-foreground': timer !== 0,
                      })}
                      type='button'
                      variant='link'
                      onClick={handleSentOtp}
                      disabled={timer !== 0 || isLoading}
                    >
                      Resend OTP
                    </Button>
                    {timer > 0 && ` in ${timer}s`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={verifyLoading}
            >
              Verify
            </Button>
          </form>
        </Form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title='Verify your email'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center'>
          <Mail className='w-6 h-6' />
        </div>
        <p className='text-sm text-muted-foreground'>
          We&apos;ll send a one-time code to
          <br />
          <span className='font-medium text-foreground break-all'>
            {email}
          </span>
        </p>
        <Button
          type='button'
          className='w-full mt-2'
          onClick={handleSentOtp}
          disabled={isLoading}
        >
          Confirm
        </Button>
      </div>
    </AuthShell>
  );
};
export default Verify;
