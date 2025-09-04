import DataTable from '@/components/modules/Admin/DataTable';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';

const AllDriver = () => {
  const { data: drivers, isLoading: driverLoading } =
    useGetDriversQuery(undefined);

  return (
    <div className='w-full max-w-7xl mx-auto '>
      <h1 className='text-4xl font-bold mb-3'>Drivers List</h1>
      <DataTable drivers={drivers} driverLoading={driverLoading} allDrivers />
    </div>
  );
};

export default AllDriver;
