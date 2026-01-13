/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Column } from '@/components/shared/ManagementTable';
import { Badge } from '@/components/ui/badge';
import type { IDriverResponse } from '@/types/driver.types';
import { format } from 'date-fns';

// 1. Setup colors for Status (Just like the Appointment code)
const statusConfig: Record<string, { variant: any; className?: string }> = {
  APPROVED: {
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600',
  },
  PENDING: {
    variant: 'secondary',
    className: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  REJECTED: {
    variant: 'destructive',
  },
};

export const driverColumns: Column<IDriverResponse>[] = [
  {
    header: 'Driver',
    accessor: (row) => (
      <div className='flex flex-col'>
        <p className='font-medium'>{row.user.name}</p>
        <p className='text-xs text-muted-foreground'>{row.user.email}</p>
      </div>
    ),
  },
  {
    header: 'Vehicle Info',
    accessor: (row) => (
      <div className='flex flex-col'>
        <p className='font-medium text-sm'>
          {row.vehicle.brand} {row.vehicle.model}
        </p>
        <p className='text-xs text-muted-foreground uppercase'>
          {row.vehicle.vehicleType} • {row.vehicle.vehicleLicense}
        </p>
      </div>
    )
  },
  {
    header: 'License',
    accessor: (row) => <p>{row.licenseNumber}</p>,
    sortKey: 'licenseNumber',
  },
  {
    header: 'Experience',
    accessor: (row) => (
      <div className='text-sm'>
        <p className='font-medium'>{row.experience} Years</p>
        <p className='text-xs text-muted-foreground'>{row.totalRides} rides</p>
      </div>
    ),
    sortKey: 'experience',
  },
  {
    header: 'Total Earnings',
    accessor: (row) => (
      <span className='font-bold text-emerald-600'>
        ${row.totalEarnings.toLocaleString()}
      </span>
    ),
    sortKey: 'totalEarnings',
  },
  {
    header: 'Availability',
    accessor: (row) => {
      const isOnline = row.availabilityStatus === 'ONLINE';
      return (
        <Badge
          variant={isOnline ? 'default' : 'outline'}
          className={isOnline ? 'bg-blue-500' : ''}
        >
          {row.availabilityStatus}
        </Badge>
      );
    }
  },
  {
    header: 'Status',
    accessor: (row) => {
      const config = statusConfig[row.status] || { variant: 'outline' };
      return (
        <Badge variant={config.variant} className={config.className}>
          {row.status}
        </Badge>
      );
    }
  },
  {
    header: 'Joined Date',
    accessor: (row) => (
      <span className='text-sm text-muted-foreground'>
        {format(new Date(row.createdAt), 'MMM d, yyyy')}
      </span>
    ),
    sortKey: 'createdAt',
  },
];
