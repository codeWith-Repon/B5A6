import type { Column } from '@/components/shared/ManagementTable';
import type { IDriverResponse } from '@/types/driver.types';

// Columns definition
export const driverColumns: Column<IDriverResponse>[] = [
  {
    header: 'Driver Name',
    accessor: (row) => row.user.name,
    sortKey: 'user.name',
  },
  {
    header: 'Email',
    accessor: (row) => row.user.email,
    sortKey: 'user.email',
  },
  {
    header: 'Vehicle',
    accessor: (row) => `${row.vehicle.brand} ${row.vehicle.model}`,
    sortKey: 'vehicle.model',
  },
  {
    header: 'Vehicle Type',
    accessor: (row) => row.vehicle.vehicleType,
    sortKey: 'vehicle.vehicleType',
  },
  {
    header: 'Vehicle License',
    accessor: (row) => row.vehicle.vehicleLicense,
    sortKey: 'vehicle.vehicleLicense',
  },
  {
    header: 'License Number',
    accessor: 'licenseNumber',
    sortKey: 'licenseNumber',
  },
  {
    header: 'Experience (yrs)',
    accessor: 'experience',
    sortKey: 'experience',
  },
  {
    header: 'Total Rides',
    accessor: 'totalRides',
    sortKey: 'totalRides',
  },
  {
    header: 'Total Earnings',
    accessor: (row) => `$${row.totalEarnings.toLocaleString()}`,
    sortKey: 'totalEarnings',
  },
  {
    header: 'Availability',
    accessor: 'availabilityStatus',
    sortKey: 'availabilityStatus',
  },
  {
    header: 'Status',
    accessor: 'status',
    sortKey: 'status',
  },
  {
    header: 'Created At',
    accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
    sortKey: 'createdAt',
  },
];
