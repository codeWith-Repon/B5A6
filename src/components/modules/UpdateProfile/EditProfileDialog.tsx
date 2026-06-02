/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import UploadSingleFile from './uploadSingleFile';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { IUser } from '@/types/user.types';
import { useUpdateProfileMutation } from '@/redux/features/auth/auth.api';

// Pretend we have initial image files

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userInfo:
    | {
        data: IUser;
      }
    | undefined;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .optional()
    .or(z.literal('')),
  email: z
    .email({
      message: 'Invalid email address.',
    })
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .min(5, {
      message: 'Address must be at least 5 characters.',
    })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, {
      message: 'Invalid Bangladeshi phone number format.',
    })
    .optional()
    .or(z.literal('')),
});

export default function EditProfileDialog({ open, setOpen, userInfo }: IProps) {
  const [updateProfile] = useUpdateProfileMutation();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userInfo?.data?.name || '',
      email: userInfo?.data?.email || '',
      address: userInfo?.data?.address || '',
      phone: userInfo?.data?.phone || '',
    },
  });


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const id = toast.loading('Updating profile...');
    try {
      const formData = new FormData();

      formData.append('data', JSON.stringify(data));
      if (image) {
        formData.append('file', image);
      }

      const res = await updateProfile(formData).unwrap();
      setOpen(false);
      console.log(res, 'ressss');
      toast.success('Profile updated successfully.', { id });
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || 'Failed to update profile. Please try again.',
        { id }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5'>
        <DialogHeader className='contents space-y-0 text-left'>
          <DialogTitle className='border-b px-6 py-4 text-base'>
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='sr-only'>
          Make changes to your profile here. You can change your photo and set a
          username.
        </DialogDescription>
        <div className='overflow-y-auto pt-5'>
          <UploadSingleFile onChange={setImage} />
          <div className='px-6 pt-4 pb-6'>
            <div className='space-y-2'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                  id='edit-profile-form'
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder='name' {...field} />
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
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. 01XXXXXXXXX' {...field} />
                        </FormControl>
                        <FormDescription className='sr-only'>
                          This is your public phone number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder='address' {...field} />
                        </FormControl>
                        <FormDescription className='sr-only'>
                          This is your public address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
        </div>
        <DialogFooter className='border-t px-6 py-4'>
          <DialogClose asChild>
            <Button type='button' variant='outline' className='cursor-pointer'>
              Cancel
            </Button>
          </DialogClose>

          <Button
            form='edit-profile-form'
            type='submit'
            className='cursor-pointer'
          >
            Update Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
