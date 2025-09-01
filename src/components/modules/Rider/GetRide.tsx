/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBookRideMutation } from '@/redux/features/Rider/rider.api';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const formSchema = z.object({
  pickupLocation: z.string().min(1, {
    message: 'Pickup location is required.',
  }),
  dropLocation: z.string().min(1, {
    message: 'Drop location is required.',
  }),
  driver: z.string().min(1, {
    message: 'Driver is required.',
  }),
});

const GetRide = () => {
  const { data: driverData } = useGetDriversQuery({
    status: 'APPROVED',
    availabilityStatus: 'ONLINE',
  });

  //   console.log(driverData);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: '',
      dropLocation: '',
      driver: '',
    },
  });

  const [bookRide, { isLoading: bookRideLoading }] = useBookRideMutation();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await bookRide(data).unwrap();
      toast.success('Ride Request Sent Successfully');
      navigate('/rider/current-ride');
    } catch (error: any) {
      toast.error(error?.data?.message);
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className='cursor-pointer'>
          Get Ride
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Get Ride</DialogTitle>
          <DialogDescription className='sr-only'>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <Form {...form}>
            <form
              id='ride-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='pickupLocation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input
                        className='pl-4 py-6'
                        placeholder='Enter pickup location'
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
                name='dropLocation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop Location</FormLabel>
                    <FormControl>
                      <Input
                        className='pl-4 py-6'
                        placeholder='Enter drop location'
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
                name='driver'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full pl-4 py-6'>
                          <SelectValue placeholder='Select driver' />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {driverData?.data?.map((driver) => (
                          <SelectItem key={driver?._id} value={driver?._id}>
                            {driver?.user?.name}
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

          {!bookRideLoading && (
            <Button
              form='ride-form'
              type='submit'
              className='w-full cursor-pointer'
            >
              Book Ride
            </Button>
          )}
          {bookRideLoading && (
            <Button form='ride-form' type='submit' className='w-full' disabled>
              <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> Book Ride
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetRide;
