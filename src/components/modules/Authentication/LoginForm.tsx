/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Link, useLocation, useNavigate } from 'react-router';
import GoogleSvg from '@/assets/googleSvg';
import { useForm } from 'react-hook-form';
import config from '@/config';
import Password from '@/components/ui/Password';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/redux/features/auth/auth.api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { tokenStorage } from '@/lib/tokenStorage';
import { rideSocket } from '@/lib/socket';

const signInSchema = z.object({
  email: z.email().min(1, { error: 'Email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*]/, {
      message: 'Password must contain at least one special character',
    }),
});

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [Login, { isLoading }] = useLoginMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    console.log('Current Location State:', location.state);
  }, [location]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await Login(data).unwrap();

      if (result.success) {
        const token = result.data?.accessToken;
        if (token) {
          tokenStorage.set(token);
          rideSocket.connect(token);
        }
        toast.success('Login successful');
        const redirectTo = location.state?.from || '/';

        navigate(redirectTo, { replace: true });
      }
      console.log('login result', result);
    } catch (error: any) {
      if (!error.success && error.data.message === 'User not verified!') {
        toast.error(error.data.message || 'Login failed');
        navigate('/verify', { state: data.email });
      } else if (
        !error.success &&
        error.data.message === 'User dos not exist'
      ) {
        toast.error(error.data.message || 'User dos not exist');
      } else if (
        !error.success &&
        error.data.message === 'Password does not match'
      ) {
        toast.error(error.data.message || 'Password does not match');
      } else if (error.data.message === 'User is deleted!') {
        toast.error(error.data.message || 'User is deleted!');
      } else if (error.data === 'Network Error') {
        toast.error('Network Error');
      } else {
        toast.error('Something went wrong');
      }
      console.log('login failed', error);
    }
  };

  const handleAutoLogin = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);

    onSubmit({ email, password });
  };

  const handleGoogleSignIn = () => {
    window.open(`${config.baseUrl}/auth/google`, '_self');
  };
  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <Button
        variant='outline'
        className='w-full h-11'
        onClick={handleGoogleSignIn}
      >
        <GoogleSvg />
        Sign in with Google
      </Button>

      <div className='relative text-center text-xs uppercase tracking-widest text-muted-foreground'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-border/40' />
        </div>
        <span className='relative bg-transparent px-3 backdrop-blur-sm'>
          Or continue with
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
          id='login-form'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='you@example.com'
                    type='email'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='sr-only'>
                  This is your email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Password {...field} />
                </FormControl>
                <FormDescription className='sr-only'>
                  This is your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className='flex justify-end -mt-1'>
        <Link
          to='/forgot-password'
          className='text-xs text-muted-foreground hover:text-primary transition-colors'
        >
          Forgot password?
        </Link>
      </div>

      {isLoading ? (
        <Button type='submit' form='login-form' className='w-full' disabled>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Signing in...
        </Button>
      ) : (
        <Button type='submit' form='login-form' className='w-full'>
          Sign in
        </Button>
      )}

      <div className='grid grid-cols-3 gap-2'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => handleAutoLogin('superadmin@super.com', 'Repon@123')}
          disabled={isLoading}
        >
          Admin
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => handleAutoLogin('repon7253@gmail.com', 'Repon@123')}
          disabled={isLoading}
        >
          User
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => handleAutoLogin('reponahmedofficial@gmail.com', 'Repon@123')}
          disabled={isLoading}
        >
          Driver
        </Button>
      </div>

      <div className='text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link
          to='/register'
          className='font-semibold text-primary hover:underline underline-offset-4'
        >
          Sign up
        </Link>
      </div>

      <div className='text-muted-foreground text-center text-[11px] text-balance leading-relaxed'>
        By continuing, you agree to our{' '}
        <a href='#' className='hover:text-foreground underline underline-offset-4'>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href='#' className='hover:text-foreground underline underline-offset-4'>
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
