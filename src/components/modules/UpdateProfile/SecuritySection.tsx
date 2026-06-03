import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useChangePasswordMutation,
  useSetPasswordMutation,
  useUserInfoQuery,
} from '@/redux/features/auth/auth.api';

const passwordRule = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[!@#$%^&*]/, 'Must contain a special character !@#$%^&*');

const changeSchema = z
  .object({
    oldPassword: z.string().min(1, 'Required'),
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

const setSchema = z
  .object({
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export function SecuritySection() {
  const { data: userInfo } = useUserInfoQuery(undefined);

  const auths = userInfo?.data?.auths ?? [];
  const hasCredentials = useMemo(
    () => auths.some((a) => a.provider === 'credentials'),
    [auths]
  );

  const [changeOpen, setChangeOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);

  return (
    <div>
      <div className='flex items-center justify-between border-b border-border/40 pb-3 mb-4'>
        <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
          Security
        </h1>
      </div>

      <div className='flex flex-col sm:flex-row gap-3 items-start'>
        {hasCredentials ? (
          <Button
            variant='outline'
            className='gap-2'
            onClick={() => setChangeOpen(true)}
          >
            <KeyRound className='w-4 h-4' /> Change password
          </Button>
        ) : (
          <Button
            variant='outline'
            className='gap-2'
            onClick={() => setSetOpen(true)}
          >
            <ShieldCheck className='w-4 h-4' /> Add a password
          </Button>
        )}
        <p className='text-sm text-muted-foreground self-center'>
          {hasCredentials
            ? 'Keep your password fresh to keep your account safe.'
            : "Set a password so you can sign in without Google."}
        </p>
      </div>

      <ChangePasswordDialog open={changeOpen} onOpenChange={setChangeOpen} />
      <SetPasswordDialog open={setOpen} onOpenChange={setSetOpen} />
    </div>
  );
}

/* ---------------- Dialogs ---------------- */

function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [changePassword] = useChangePasswordMutation();
  const form = useForm<z.infer<typeof changeSchema>>({
    resolver: zodResolver(changeSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: z.infer<typeof changeSchema>) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success('Password updated');
      form.reset();
      onOpenChange(false);
    } catch (e) {
      const err = e as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Could not update password');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='oldPassword'>Current password</Label>
            <Input
              id='oldPassword'
              type='password'
              autoComplete='current-password'
              {...form.register('oldPassword')}
            />
            {form.formState.errors.oldPassword && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.oldPassword.message}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='newPassword'>New password</Label>
            <Input
              id='newPassword'
              type='password'
              autoComplete='new-password'
              {...form.register('newPassword')}
            />
            {form.formState.errors.newPassword && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='confirmPassword'>Confirm new password</Label>
            <Input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='ghost'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='gap-2'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className='w-4 h-4 animate-spin' />
              )}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SetPasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [setPassword] = useSetPasswordMutation();
  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: z.infer<typeof setSchema>) => {
    try {
      await setPassword({ password: values.newPassword }).unwrap();
      toast.success('Password added');
      form.reset();
      onOpenChange(false);
    } catch (e) {
      const err = e as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Could not set password');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a password</DialogTitle>
          <DialogDescription>
            Set a password so you can sign in with email and password too.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='newPassword'>New password</Label>
            <Input
              id='newPassword'
              type='password'
              autoComplete='new-password'
              {...form.register('newPassword')}
            />
            {form.formState.errors.newPassword && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='confirmPassword'>Confirm</Label>
            <Input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <p className='text-xs text-destructive'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='ghost'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='gap-2'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className='w-4 h-4 animate-spin' />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
