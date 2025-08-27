import { rideStatus } from '@/constants/rideStatus';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetRideRequestQuery } from '@/redux/features/ride/ride.api';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import { SetFairDialog } from './SetFairDialog';

const RideRequestTable = () => {
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: driverData } = useGetDriversQuery(
    { user: userData?.data?._id },
    { skip: !userData?.data?._id }
  );
  const { data: rideRequestData } = useGetRideRequestQuery(
    {
      rideStatus: rideStatus.requested,
      driver: driverData?.data[0]?._id,
    },
    { skip: !driverData?.data[0]?._id }
  );

  console.log('riderequest data', rideRequestData);
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
          {rideRequestData && rideRequestData?.data.length > 0 ? (
            <TableRow>
              <TableCell className='font-medium'>
                {rideRequestData?.data[0]?.user?.name}
              </TableCell>
              <TableCell>{rideRequestData?.data[0]?.pickupLocation}</TableCell>
              <TableCell>{rideRequestData?.data[0]?.dropLocation}</TableCell>
              <TableCell>{rideRequestData?.data[0]?.rideStatus}</TableCell>
              <TableCell>
                {rideRequestData?.data[0]?.isOtpVerified ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>{rideRequestData?.data[0]?.payment.status}</TableCell>
              <TableCell className=' flex gap-2 items-center justify-end'>
                <div className='flex items-center gap-2'>
                  <span>{rideRequestData?.data[0]?.fare}</span>
                  <SetFairDialog />
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
