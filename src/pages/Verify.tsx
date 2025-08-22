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

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);
  const [confirm, setConfirm] = useState<boolean>(false);

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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  console.log(email);
  return (
    <div className='grid place-content-center h-screen'>
      {confirm ? (
        <Card className='w-full max-w-sm'>
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
                        Please enter the one-time password sent to your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <Button type='submit' className='w-full'>
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className='w-[300px] '>
          <CardHeader>
            <CardTitle>Verify your email address.</CardTitle>
            <CardDescription>
              We will send you an OTP at
              <span className='underline font-semibold'> {email}</span>
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex-col gap-2'>
            <Button
              type='submit'
              className='w-full'
              onClick={() => setConfirm(true)}
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
