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
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { IDriverResponse, IGetResponse } from '@/types/driver.types';
import { useUpdateDriverMutation } from '@/redux/features/driver/driver.api';
import { useEffect } from 'react';

// Pretend we have initial image files

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  driverInfo: IGetResponse<IDriverResponse> | undefined;
}

const formSchema = z.object({
  licenseNumber: z
    .string()
    .min(2, {
      message: 'Driving License must be at least 8 characters.',
    })
    .optional()
    .or(z.literal('')),
  experience: z
    .number({ message: 'Experience must be a number' })
    .min(0)
    .max(30, { message: 'Experience must be between 0 and 30' })
    .nonnegative(),
});

export default function EditDriverInfoDialog({
  open,
  setOpen,
  driverInfo,
}: IProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseNumber: '',
      experience: 0,
    },
  });
  const [updateDriver] = useUpdateDriverMutation();

  useEffect(() => {
    if (driverInfo?.data?.[0]) {
      form.reset({
        licenseNumber: driverInfo.data[0].licenseNumber || '',
        experience: driverInfo.data[0].experience || 0,
      });
    }
  }, [driverInfo, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const id = toast.loading('Updating profile...');
    try {
      console.log(data, 'driving data');
      await updateDriver({
        id: driverInfo?.data[0]?._id as string,
        data,
      }).unwrap();
      setOpen(false);
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
                    name='licenseNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driving License</FormLabel>
                        <FormControl>
                          <Input placeholder='Driving License' {...field} />
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
                    name='experience'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Years of experience'
                            min={0}
                            max={30}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className='sr-only'>
                          This is your public phone number.
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
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
