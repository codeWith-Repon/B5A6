/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>Sign in with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='flex flex-col gap-4'>
              <Button
                variant='outline'
                className='w-full cursor-pointer'
                onClick={handleGoogleSignIn}
              >
                <GoogleSvg />
                Sign in with Google
              </Button>
            </div>
            <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
              <span className='bg-card text-muted-foreground relative z-10 px-2'>
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
                          placeholder='jhonDoe@gmail.com'
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

            {isLoading ? (
              <Button
                type='submit'
                form='login-form'
                className='w-full cursor-pointer'
                disabled
              >
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Sign in
              </Button>
            ) : (
              <Button
                type='submit'
                form='login-form'
                className='w-full cursor-pointer'
              >
                Sign in
              </Button>
            )}

            <div className='flex flex-wrap items-center justify-center gap-3'>
              <Button
                variant='secondary'
                className='cursor-pointer'
                onClick={() =>
                  handleAutoLogin('superAdmin@gmail.com', 'R1234567@')
                }
                disabled={isLoading}
              >
                Login as Admin
              </Button>

              <Button
                variant='outline'
                className='cursor-pointer'
                onClick={() =>
                  handleAutoLogin('repon7253@gmail.com', 'R1234567@')
                }
                disabled={isLoading}
              >
                Login as User
              </Button>
              <Button
                variant='outline'
                className='cursor-pointer'
                onClick={() => handleAutoLogin('driver@gmail.com', 'R1234567@')}
                disabled={isLoading}
              >
                Login as Driver
              </Button>
            </div>

            <div className='text-center text-sm'>
              don&apos;t have an account?{' '}
              <Link to='/register' className='underline underline-offset-4'>
                sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
