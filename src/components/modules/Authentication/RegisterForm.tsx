/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router';
import GoogleSvg from '@/assets/googleSvg';
import { useForm } from 'react-hook-form';
import Password from '@/components/ui/Password';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from '@/redux/features/auth/auth.api';
import config from '@/config';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters' }),
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
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const userInfo = {
      name: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const result = await register(userInfo).unwrap();
      if (result.success) {
        toast.success('Registration successful');
        navigate('/verify');
      }
      console.log('registration result', result);
    } catch (error: any) {
      if (!error.success) {
        toast.error(error.data.message || 'Registration failed');
      }
      console.error('registration error', error);
    }
  };

  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <Button
        variant='outline'
        className='w-full h-11'
        onClick={() => window.open(`${config.baseUrl}/auth/google`)}
      >
        <GoogleSvg />
        Sign up with Google
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
          id='register-form'
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='your name' {...field} />
                </FormControl>
                <FormDescription className='sr-only'>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Password {...field} />
                </FormControl>
                <FormDescription className='sr-only'>
                  This is your confirm password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {isLoading ? (
        <Button type='submit' form='register-form' className='w-full' disabled>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Creating account...
        </Button>
      ) : (
        <Button type='submit' form='register-form' className='w-full'>
          Create account
        </Button>
      )}

      <div className='text-center text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='font-semibold text-primary hover:underline underline-offset-4'
        >
          Sign in
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
