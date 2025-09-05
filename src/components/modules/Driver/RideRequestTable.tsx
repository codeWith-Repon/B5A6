/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SetFairDialog } from './SetFairDialog';
import { Button } from '@/components/ui/button';
import {
  useGetCurrentRideQuery,
  useUpdateRideStatusMutation,
} from '@/redux/features/Rider/rider.api';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import Spinner from '@/utils/spinner';

const driverChangeableRideStatus = {
  accepted: 'ACCEPTED',
  pickedUp: 'PICKED UP',
  inTransit: 'IN TRANSIT',
  completed: 'COMPLETED',
  rejected: 'REJECTED',
};

const RideRequestTable = () => {
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const { data: rideRequestData, isLoading } =
    useGetCurrentRideQuery(undefined);

  const [updateRideStatus] = useUpdateRideStatusMutation();

  useEffect(() => {
    if (rideRequestData?.data) {
      setCurrentRideId(rideRequestData.data._id);
    }
  }, [rideRequestData]);

  if (isLoading) return <Spinner />;

  const handleUpdateRideStatus = async (status: string) => {
    const rideId = rideRequestData?.data?._id;
    if (!rideId) return;
    try {
      const res = await updateRideStatus({
        rideId,
        rideStatus: status,
      }).unwrap();
      toast.success('Ride status updated successfully');
      console.log(res);
    } catch (error: any) {
      toast.error(error.data.message);
      console.log(error);
    }
  };

  return (
    <div>
      <Table className='w-full max-w-7xl mx-auto'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[150px]'>Name</TableHead>
            <TableHead className='w-[200px]'>Pickup location</TableHead>
            <TableHead className='w-[200px]'>Drop location</TableHead>
            <TableHead className='w-[150px]'>Ride Status</TableHead>
            <TableHead className='w-[150px]'>Otp verified</TableHead>
            <TableHead className='w-[150px]'>Payment Status</TableHead>
            <TableHead className='text-right'>Set Fare</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rideRequestData ? (
            <TableRow>
              <TableCell className='font-medium'>
                {rideRequestData?.data?.user?.name}
              </TableCell>
              <TableCell>{rideRequestData?.data?.pickupLocation}</TableCell>
              <TableCell>{rideRequestData?.data?.dropLocation}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type='button' variant={'outline'} size={'sm'}>
                      {rideRequestData?.data?.rideStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Ride Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.values(driverChangeableRideStatus).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleUpdateRideStatus(status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                {rideRequestData?.data?.isOtpVerified ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>{rideRequestData?.data?.payment.status}</TableCell>
              <TableCell className=' flex gap-2 items-center justify-end'>
                <div className='flex items-center gap-2'>
                  <span>{rideRequestData?.data?.fare}</span>
                  <SetFairDialog currentRideId={currentRideId} />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RideRequestTable;
