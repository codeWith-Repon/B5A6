import { driverColumns } from '@/components/modules/Admin/DriverManagement/DriverColumn';
import ViewDriverDetails from '@/components/modules/Admin/DriverManagement/ViewDriverDetails';
import ManagementTable from '@/components/shared/ManagementTable';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TablePagination from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { driverStatus, VEHICLE_OPTIONS } from '@/constants/driverStatus';
import {
  useGetDriversQuery,
  useUpdateDriverMutation,
} from '@/redux/features/driver/driver.api';
import type { IDriverResponse } from '@/types/driver.types';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

const AllDriver = () => {
  const [searchParams] = useSearchParams();
  const [viewing, setViewing] = useState<string | null>(null);
  const [updateDriver] = useUpdateDriverMutation();

  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const searchTerm = searchParams.get('searchTerm');
  const status = searchParams.get('status');
  const licenseNumber = searchParams.get('licenseNumber');
  const vehicleType = searchParams.get('vehicleType');

  let sortQuery = '';
  if (sortBy) {
    sortQuery = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
  }

  const { data: drivers, isLoading: driverLoading } = useGetDriversQuery({
    searchTerm,
    sort: sortQuery,
    licenseNumber,
    vehicleType,
    status,
    page,
    limit,
  });

  const handleView = (driver: IDriverResponse) => {
    setViewing(driver._id);
  };

  const handleApprove = async (driver: IDriverResponse) => {
    const id = driver._id;
    try {
      await updateDriver({ id, data: { status: 'APPROVED' } }).unwrap();

      toast.success('Driver approved successfully');
    } catch (error) {
      toast.error('Failed to approve driver');
      console.log(error);
    }
  };

  const handleSuspend = async (driver: IDriverResponse) => {
    const id = driver._id;
    try {
      await updateDriver({ id, data: { status: 'SUSPENDED' } }).unwrap();
      toast.success('Driver suspended successfully');
    } catch (error) {
      toast.error('Failed to suspend driver');
      console.log(error);
    }
  };

  return (
    <div className='w-full mx-auto space-y-5'>
      <div className=''>
        <h1 className='text-4xl font-bold mb-3'>Driver Management</h1>
        <p className=''>Manage and oversee all drivers on the platform</p>
      </div>
      <div className='flex gap-3'>
        <SearchFilter />

        <div className='flex gap-3 items-center'>
          <span className='font-semibold'>Select Status :</span>
          <SelectFilter
            paramName='status'
            placeholder='Driver Status'
            options={Object.values(driverStatus).map((status) => ({
              label:
                status.charAt(0).toUpperCase() +
                status.slice(1).toLocaleLowerCase(),
              value: status,
            }))}
          />
        </div>
        <div className='flex gap-3 items-center'>
          <span className='font-semibold'>Select Vehicle :</span>
          <SelectFilter
            paramName='vehicleType'
            placeholder='Select Vehicle'
            options={VEHICLE_OPTIONS}
          />
        </div>
        <SearchFilter paramName='licenseNumber' placeholder='License Number' />
      </div>
      <RefreshButton />
      {driverLoading ? (
        <TableSkeleton columns={8} rows={10} />
      ) : (
        <>
          <ManagementTable
            data={drivers?.data || []}
            columns={driverColumns}
            getRowKey={(row) => row._id}
            isRefreshing={driverLoading}
            onView={handleView}
            onApprove={handleApprove}
            onSuspend={handleSuspend}
          />
          <TablePagination
            currentPage={drivers?.meta?.page || 1}
            totalPages={drivers?.meta?.totalPage || 1}
          />
        </>
      )}
      <ViewDriverDetails
        open={!!viewing}
        onClose={() => setViewing(null)}
        Id={viewing!}
      />
    </div>
  );
};

export default AllDriver;
