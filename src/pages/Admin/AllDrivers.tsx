// import DataTable from '@/components/modules/Admin/DataTable';
import { driverColumns } from '@/components/modules/Admin/DriverManagement/DriverColumn';
import ManagementTable from '@/components/shared/ManagementTable';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TablePagination from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { driverStatus, VEHICLE_OPTIONS } from '@/constants/driverStatus';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import { useSearchParams } from 'react-router';

const AllDriver = () => {
  const [searchParams] = useSearchParams();

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
      {/* <DataTable drivers={drivers} driverLoading={driverLoading} allDrivers /> */}
      {driverLoading ? (
        <TableSkeleton columns={8} rows={10} />
      ) : (
        <>
          <ManagementTable
            data={drivers?.data || []}
            columns={driverColumns}
            getRowKey={(row) => row._id}
            isRefreshing={driverLoading}
          />
          <TablePagination
            currentPage={drivers?.meta?.page || 1}
            totalPages={drivers?.meta?.totalPage || 1}
          />
        </>
      )}
    </div>
  );
};

export default AllDriver;
