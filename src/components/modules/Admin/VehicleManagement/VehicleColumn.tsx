import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Car, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Column } from '@/components/shared/ManagementTable';
import type { IVehicle } from '@/types/vehicle.types';

export const vehicleColumns: Column<IVehicle>[] = [
  {
    header: 'Vehicle',
    accessor: (row) => (
      <div className='flex items-center gap-3'>
        <div className='relative h-12 w-20 overflow-hidden rounded-md border bg-muted'>
          {row.images?.[0] ? (
            <img
              src={row.images[0]}
              alt={row.model}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <Car className='h-6 w-6 text-muted-foreground' />
            </div>
          )}
        </div>
        <div className='flex flex-col'>
          <span className='font-bold text-sm text-foreground'>{row.brand}</span>
          <span className='text-xs text-muted-foreground'>{row.model}</span>
        </div>
      </div>
    ),
  },
  {
    header: 'Type',
    accessor: (row) => (
      <Badge variant='outline' className='font-semibold px-2 py-0.5'>
        {row.vehicleType}
      </Badge>
    ),
    sortKey: 'vehicleType',
  },
  {
    header: 'License Plate',
    accessor: (row) => (
      <div className='flex items-center gap-2'>
        <div className='bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700'>
          <span className='font-mono text-xs font-bold tracking-wider text-slate-700 dark:text-slate-300'>
            {row.vehicleLicense}
          </span>
        </div>
      </div>
    ),
    sortKey: 'vehicleLicense',
  },
  {
    header: 'Driver',
    accessor: (row) => (
      <div className='flex items-center gap-2'>
        <Avatar className='h-7 w-7'>
          <AvatarFallback className='bg-primary/10 text-[10px] font-bold'>
            {row.driver.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <span className='text-sm font-medium leading-none'>
            {row.driver.name}
          </span>
          <span className='text-[10px] text-muted-foreground mt-1'>
            {row.driver.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: 'Registration Date',
    accessor: (row) => (
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Calendar className='h-3.5 w-3.5' />
        <span className='text-xs'>
          {format(new Date(row.createdAt), 'MMM dd, yyyy')}
        </span>
      </div>
    ),
    sortKey: 'createdAt',
  },
];
