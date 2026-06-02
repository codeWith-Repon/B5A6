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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type {
  IDriverResponse,
  IGetResponse,
  IVehicle,
} from '@/types/driver.types';
import { vehicleTypeOptions } from '@/constants/VehicleType';
import UploadMultipleFile from './uploadMultipleFile';
import type { FileMetadata } from '@/hooks/use-file-upload';
import { useUpdateVehicleMutation } from '@/redux/features/driver/driver.api';

// Pretend we have initial image files

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicleInfo: IGetResponse<IDriverResponse> | undefined;
}

const formSchema = z.object({
  vehicleLicense: z
    .string()
    .min(8, {
      message: 'Vehicle license number must be at least 8 characters long.',
    })
    .max(100),
  brand: z
    .string()
    .min(3, { message: 'Brand must be at least 3 characters long.' })
    .max(100),
  model: z
    .string()
    .min(3, { message: 'Model must be at least 3 characters long.' })
    .max(100),
  vehicleType: z
    .string()
    .min(2, { message: 'Vehicle type must be at least 2 characters long.' })
    .max(100),
});

export default function EditVehicleInfo({
  open,
  setOpen,
  vehicleInfo,
}: IProps) {
  const [updateVehicle, { isLoading }] = useUpdateVehicleMutation();
  const [images, setImages] = useState<(File | FileMetadata)[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleLicense: '',
      model: '',
      brand: '',
      vehicleType: '',
    },
  });
  useEffect(() => {
    if (vehicleInfo) {
      form.reset({
        vehicleLicense: vehicleInfo?.data[0]?.vehicle?.vehicleLicense,
        model: vehicleInfo?.data[0]?.vehicle?.model,
        brand: vehicleInfo?.data[0]?.vehicle?.brand,
        vehicleType: vehicleInfo?.data[0]?.vehicle?.vehicleType,
      });
    }
  }, [vehicleInfo, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const id = toast.loading('Updating profile...');

    try {
      let payload: IVehicle | FormData;

      if (images && images.length > 0) {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        images.forEach((image) => formData.append('files', image as File));
        payload = formData;
      } else {
        payload = { ...data } as IVehicle;
      }

      await updateVehicle({
        id: vehicleInfo?.data[0].vehicle?._id as string,
        data: payload,
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
          <UploadMultipleFile setImages={setImages} />
          <div className='px-6 pt-4 pb-6'>
            <div className='space-y-2'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                  id='edit-vehicle-form'
                >
                  <FormField
                    control={form.control}
                    name='vehicleLicense'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle License Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Vehicle License Number'
                            {...field}
                          />
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
                    name='brand'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder='Brand' {...field} />
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
                    name='model'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder='Model' {...field} />
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
                    name='vehicleType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select a vehicle type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleTypeOptions.map((option, label) => (
                              <SelectItem value={option.value} key={label}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
            form='edit-vehicle-form'
            type='submit'
            className='cursor-pointer'
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
