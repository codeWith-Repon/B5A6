/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  useGetVehicleQuery,
  useRegisterDriverMutation,
} from '@/redux/features/driver/driver.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const driverSchema = z.object({
  licenseNumber: z
    .string()
    .min(8, { message: 'License number must be at least 8 characters' }),
  experience: z
    .number({ message: 'Experience must be a number' })
    .min(0)
    .max(30, { message: 'Experience must be between 0 and 30' })
    .nonnegative(),
});
const DriverForm = () => {
  const navigate = useNavigate();
  const { data: userData } = useUserInfoQuery(undefined);
  const [userId, setUserId] = useState<string>('');
  const { data: vehicleData } = useGetVehicleQuery(
    {
      driver: userId,
      fields: 'driver _id',
    },
    { skip: !userId }
  );
  const [registerDriver, { isLoading: isRegisteringDriver }] =
    useRegisterDriverMutation();

  useEffect(() => {
    if (userData?.success) {
      setUserId(userData?.data?._id);
      console.log(userId);
    }
  }, [userData, userId]);

  const form = useForm<z.infer<typeof driverSchema>>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      licenseNumber: '',
      experience: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof driverSchema>) => {
    const driverInfo = {
      user: vehicleData?.data[0].driver,
      vehicle: vehicleData?.data[0]._id,
      licenseNumber: data.licenseNumber,
      experience: data.experience,
    };

    try {
      const res = await registerDriver(driverInfo).unwrap();
      if (res.success) {
        toast.success(res.message);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.data.message);
      console.log('Failed to register driver', error);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Register Driver</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
                id='driver-form'
              >
                <FormField
                  control={form.control}
                  name='licenseNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driving License</FormLabel>
                      <FormControl>
                        <Input placeholder='NY12345678' {...field} />
                      </FormControl>
                      <FormDescription className='sr-only'>
                        brand name.
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
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className='sr-only'>
                        vehicle license.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {isRegisteringDriver ? (
              <Button type='submit' form='vehicle-form' disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button
                type='submit'
                form='driver-form'
                className='w-full cursor-pointer'
              >
                Register
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverForm;
