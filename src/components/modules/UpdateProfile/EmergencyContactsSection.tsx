import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, ShieldAlert, UserPlus } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useAddEmergencyContactMutation } from '@/redux/features/SOS/sos.api';

const schema = z.object({
  emergencyContactEmail: z.email({ message: 'Enter a valid email' }),
});

export function EmergencyContactsSection() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const contacts = userInfo?.data?.emergencyContactEmail ?? [];
  const [addContact] = useAddEmergencyContactMutation();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { emergencyContactEmail: '' },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await addContact({
        emergencyContactEmail: values.emergencyContactEmail,
      }).unwrap();
      toast.success('Contact added');
      form.reset();
      setOpen(false);
    } catch (e) {
      const err = e as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Could not add contact');
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between border-b border-border/40 pb-3 mb-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
            Emergency contacts
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            We email these people when you trigger SOS during a ride.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='gap-2'>
              <UserPlus className='w-4 h-4' /> Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add an emergency contact</DialogTitle>
              <DialogDescription>
                We'll email this address with your live location if you tap SOS.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='emergencyContactEmail'>Email</Label>
                <Input
                  id='emergencyContactEmail'
                  type='email'
                  autoComplete='off'
                  placeholder='friend@example.com'
                  {...form.register('emergencyContactEmail')}
                />
                {form.formState.errors.emergencyContactEmail && (
                  <p className='text-xs text-destructive'>
                    {form.formState.errors.emergencyContactEmail.message}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => setOpen(false)}
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
                  Add contact
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <div className='rounded-xl border border-dashed border-border p-6 text-center bg-secondary/30'>
          <div className='mx-auto w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center mb-2'>
            <ShieldAlert className='w-5 h-5 text-muted-foreground' />
          </div>
          <p className='text-sm font-medium text-foreground'>
            No contacts yet
          </p>
          <p className='text-xs text-muted-foreground'>
            Add at least one so SOS can reach someone who can help.
          </p>
        </div>
      ) : (
        <ul className='space-y-2'>
          {contacts.map((email) => (
            <li
              key={email}
              className='flex items-center gap-3 p-3 rounded-md border border-border bg-card'
            >
              <span className='w-8 h-8 rounded-md bg-secondary text-foreground flex items-center justify-center shrink-0'>
                <Mail className='w-4 h-4' />
              </span>
              <span className='flex-1 text-sm font-medium text-foreground truncate'>
                {email}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
