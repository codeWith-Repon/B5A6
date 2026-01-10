// import DataTable from '@/components/modules/Admin/DataTable';
import { driverColumns } from '@/components/modules/Admin/DriverManagement/DriverColumn';
import ManagementTable from '@/components/shared/ManagementTable';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';

const AllDriver = () => {
  const { data: drivers, isLoading: driverLoading } =
    useGetDriversQuery(undefined);

  return (
    <div className='w-full mx-auto '>
      <h1 className='text-4xl font-bold mb-3'>Drivers List</h1>
      {/* <DataTable drivers={drivers} driverLoading={driverLoading} allDrivers /> */}
      <ManagementTable
        data={drivers?.data || []}
        columns={driverColumns}
        getRowKey={(row) => row._id}
        isRefreshing={driverLoading}
      />
    </div>
  );
};

export default AllDriver;
