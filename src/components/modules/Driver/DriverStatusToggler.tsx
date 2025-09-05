/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  useGetDriversQuery,
  useUpdateDriverMutation,
} from '@/redux/features/driver/driver.api';
import type { IUser } from '@/types/user.types';
import { toast } from 'sonner';
import { driverOnlineStatus } from '@/constants/driverStatus';
import { Skeleton } from '@/components/ui/skeleton';

interface StatusToggler {
  userData: {
    data: IUser;
  };
  loading?: boolean;
}
export default function DriverStatusToggler({
  userData,
  loading,
}: StatusToggler) {
  const id = useId();
  const { data: driver, isLoading: driverLoading } = useGetDriversQuery(
    { user: userData?.data?._id },
    { skip: !userData?.data?._id }
  );
  const [updateDriver, { isLoading }] = useUpdateDriverMutation();

  if (loading || driverLoading) {
    return <Skeleton className='h-13 w-full' />;
  }

  const handleStatusChange = async () => {
    try {
      await updateDriver({
        id: driver?.data[0]?._id as string,
        data: {
          availabilityStatus:
            driver?.data[0]?.availabilityStatus === driverOnlineStatus.online
              ? driverOnlineStatus.offline
              : driverOnlineStatus.online,
        },
      }).unwrap();

      toast.success("Driver's status updated successfully.");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className='border-input has-data-[state=checked]:border/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
      <Switch
        id={id}
        checked={
          driver?.data[0]?.availabilityStatus === driverOnlineStatus.online
        }
        disabled={isLoading}
        onClick={handleStatusChange}
        className='order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2 cursor-pointer'
        aria-describedby={`${id}-description`}
      />
      <div className='grid grow gap-2'>
        <Label htmlFor={id}>Driving Status </Label>
      </div>
    </div>
  );
}
