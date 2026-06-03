import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
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
import { useForgotPasswordMutation } from '@/redux/features/auth/auth.api';
import { AuthShell } from '@/components/modules/Authentication/AuthShell';

const schema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
});

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await forgotPassword({ email: values.email }).unwrap();
      setSent(true);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Could not send reset link');
    }
  };

  if (sent) {
    return (
      <AuthShell title='Check your inbox'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center'>
            <MailCheck className='w-6 h-6' />
          </div>
          <p className='text-sm text-muted-foreground'>
            If an account exists for{' '}
            <span className='font-medium text-foreground'>
              {form.getValues('email')}
            </span>
            , a password reset link is on the way.
          </p>
          <Button asChild variant='outline' className='w-full mt-2'>
            <Link to='/login'>Back to sign in</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title='Forgot password?'
      subtitle="Enter the email tied to your account and we'll send you a link to reset it."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    autoComplete='email'
                    placeholder='you@example.com'
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
            {form.formState.isSubmitting && (
              <Loader2 className='w-4 h-4 animate-spin' />
            )}
            Send reset link
          </Button>

          <Button asChild variant='ghost' className='gap-1 -mt-1'>
            <Link to='/login'>
              <ArrowLeft className='w-4 h-4' /> Back to sign in
            </Link>
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
};

export default ForgotPassword;
