/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '@/redux/features/auth/auth.api';
import { cn } from '@/lib/utils';

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
      console.log('timer', timer);
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
      console.log(res);
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

  return (
    <div className='relative grid place-content-center min-h-svh px-4 overflow-hidden'>
      <div className='aurora' aria-hidden />
      {confirmed ? (
        <Card className='relative z-10 w-full max-w-sm'>
          <CardHeader>
            <CardTitle>One-Time Password</CardTitle>
            <CardDescription className='sr-only'>
              Enter your otp below to verify to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-2/3 space-y-6'
                id='otp-form'
              >
                <FormField
                  control={form.control}
                  name='pin'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password sent to your email.{' '}
                        <Button
                          className={cn('p-0 m-0', {
                            'cursor-pointer': timer === 0,
                            'text-gray-500': timer !== 0,
                          })}
                          type='button'
                          variant={'link'}
                          onClick={handleSentOtp}
                          disabled={timer !== 0}
                        >
                          Resend OTP
                        </Button>
                        {timer > 0 && ` in ${timer} s`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <Button
              type='submit'
              className='w-full cursor-pointer'
              form='otp-form'
              disabled={verifyLoading}
            >
              Verify
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className='relative z-10 w-full max-w-sm'>
          <CardHeader>
            <CardTitle className='text-xl'>Verify your email</CardTitle>
            <CardDescription>
              We will send you an OTP at
              <span className='underline font-semibold'> {email}</span>
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex-col gap-2'>
            <Button
              type='submit'
              className='w-full'
              onClick={handleSentOtp}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
export default Verify;
