import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { IMeta } from '@/types/driver.types';
import type { IRideRequestResponse } from '@/types/rideRequest';

interface IRideHistoryTableProps {
  rideData?: {
    data: IRideRequestResponse[];
    meta?: IMeta;
  };
  isLoading: boolean;
}

const RideHistoryTable = ({ rideData, isLoading }: IRideHistoryTableProps) => {
  console.log(rideData, 'rideData');
  return (
    <div className='w-full max-w-7xl mx-auto overflow-hidden rounded border '>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='p-4'>Name</TableHead>
            <TableHead>Pickup Location</TableHead>
            <TableHead>Drop Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className='p-4'>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell className='p-4'>
                  <Skeleton className='h-4 w-40' />
                </TableCell>
                <TableCell className='p-4'>
                  <Skeleton className='h-4 w-40' />
                </TableCell>
              </TableRow>
            ))
          ) : rideData?.data && rideData.data.length > 0 ? (
            rideData.data.map((ride) => (
              <TableRow key={ride._id}>
                <TableCell className='font-medium px-4'>
                  {ride?.user?.name}
                </TableCell>
                <TableCell>{ride.pickupLocation}</TableCell>
                <TableCell>{ride.dropLocation}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className='text-center py-4'>
                No Rides Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RideHistoryTable;
