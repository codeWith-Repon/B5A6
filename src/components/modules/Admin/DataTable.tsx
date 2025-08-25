import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { driverStatus } from '@/constants/driverStatus';
import {
  useGetDriversQuery,
  useUpdateDriverMutation,
} from '@/redux/features/driver/driver.api';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

const DataTable = () => {
  const { data: drivers } = useGetDriversQuery(undefined);
  const [updateDriver] = useUpdateDriverMutation();

  const handleApprove = async (id: string) => {
    try {
      await updateDriver({ id, data: { status: 'APPROVED' } }).unwrap();

      toast.success('Driver approved successfully');
    } catch (error) {
      toast.error('Failed to approve driver');
      console.log(error);
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await updateDriver({ id, data: { status: 'SUSPENDED' } }).unwrap();

      toast.success('Driver suspended successfully');
    } catch (error) {
      toast.error('Failed to suspend driver');
      console.log(error);
    }
  };

  // console.log(drivers);
  return (
    <Table className=''>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[200px]'>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drivers?.data?.map((driver) => (
          <TableRow key={driver?._id}>
            <TableCell className='font-medium'>{driver?.user?.name}</TableCell>
            <TableCell>{driver?.user?.email}</TableCell>
            <TableCell
              className={clsx('text-xs font-semibold', {
                'text-yellow-500': driver?.status === driverStatus.pending,
                'text-green-500': driver?.status === driverStatus.approved,
                'text-red-500': driver?.status === driverStatus.suspended,
              })}
            >
              {driver?.status}
            </TableCell>
            <TableCell className=' flex gap-2 items-center justify-end'>
              <Button
                size='sm'
                className='cursor-pointer'
                variant={'outline'}
                onClick={() => handleApprove(driver?._id)}
              >
                <Check className='' />
              </Button>
              <Button
                size='sm'
                className='cursor-pointer bg-primary text-foreground'
                onClick={() => handleSuspend(driver?._id)}
              >
                <X className='' />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
