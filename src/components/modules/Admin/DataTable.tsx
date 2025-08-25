import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { IDriverResponse, IGetResponse } from '@/types/driver.types';
import { Check, X } from 'lucide-react';

interface DataTableProps {
  drivers?: IGetResponse<IDriverResponse>;
}
const DataTable = ({ drivers }: DataTableProps) => {
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
            <TableCell>{driver?.status}</TableCell>
            <TableCell className=' flex gap-2 items-center justify-end'>
              <Button size='sm' className='cursor-pointer' variant={'outline'}>
                <Check className='' />
              </Button>
              <Button
                size='sm'
                className='cursor-pointer bg-primary text-foreground'
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
