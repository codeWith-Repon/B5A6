import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useResetPasswordMutation } from '@/redux/features/auth/auth.api';
import { AuthShell } from '@/components/modules/Authentication/AuthShell';

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[!@#$%^&*]/, 'Must contain a special character !@#$%^&*'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [resetPassword] = useResetPasswordMutation();
  const [show, setShow] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const tokenMissing = useMemo(() => token.length === 0, [token]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await resetPassword({ newPassword: values.newPassword, token }).unwrap();
      toast.success('Password updated — please sign in');
      navigate('/login', { replace: true });
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Could not reset password');
    }
  };

  if (tokenMissing) {
    return (
      <AuthShell title='Invalid link'>
        <p className='text-sm text-muted-foreground text-center'>
          This reset link is missing its token. Request a new one from the
          forgot-password page.
        </p>
        <Button asChild variant='outline' className='w-full mt-4'>
          <Link to='/forgot-password'>Get a new link</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title='Set a new password' subtitle='Use something memorable.'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={show ? 'text' : 'password'}
                      autoComplete='new-password'
                      placeholder='At least 8 characters'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShow((s) => !s)}
                      className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground'
                      aria-label={show ? 'Hide password' : 'Show password'}
                    >
                      {show ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type={show ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='Repeat the password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='gap-2'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <ShieldCheck className='w-4 h-4' />
            )}
            Update password
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
};

export default ResetPassword;
