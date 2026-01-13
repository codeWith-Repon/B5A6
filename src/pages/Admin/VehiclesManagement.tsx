import { vehicleColumns } from '@/components/modules/Admin/VehicleManagement/VehicleColumn';
import ManagementTable from '@/components/shared/ManagementTable';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TablePagination from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { VEHICLE_OPTIONS } from '@/constants/driverStatus';
import { useGetAllVehiclesQuery } from '@/redux/features/Vehicle/vehicle.api';
import { useSearchParams } from 'react-router';

const VehiclesManagement = () => {
  const [searchParams] = useSearchParams();

  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  const searchTerm = searchParams.get('searchTerm');
  const vehicleType = searchParams.get('vehicleType');

  let sortQuery = '';
  if (sortBy) {
    sortQuery = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
  }

  const { data, isLoading } = useGetAllVehiclesQuery({
    searchTerm,
    sort: sortQuery,
    vehicleType,
    page,
    limit,
  });

  return (
    <div className='w-full mx-auto space-y-5'>
      <div className=''>
        <h1 className='text-4xl font-bold mb-3'>User Management</h1>
        <p className=''>Manage and oversee all user on the platform</p>
      </div>

      <div className='md:max-w-md'>
        <SearchFilter />
      </div>

      <div className='flex gap-3 flex-wrap'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold'>Select Vehicle :</span>
          <SelectFilter
            paramName='vehicleType'
            placeholder='Select Vehicle'
            options={VEHICLE_OPTIONS}
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} rows={6} />
      ) : (
        <>
          <ManagementTable
            data={data?.data || []}
            columns={vehicleColumns}
            getRowKey={(row) => row._id}
            isRefreshing={isLoading}
            // onView={handleView}
          />
          <TablePagination
            currentPage={data?.meta?.page || 1}
            totalPages={data?.meta?.totalPage || 1}
          />
        </>
      )}
    </div>
  );
};

export default VehiclesManagement;
