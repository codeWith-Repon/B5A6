import DataTable from '@/components/modules/Admin/DataTable';
import { driverStatus } from '@/constants/driverStatus';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';

const SuspendedDrivers = () => {
  const { data: drivers, isLoading: driverLoading } = useGetDriversQuery({
    status: driverStatus.suspended,
  });

  return (
    <div>
      <DataTable drivers={drivers} driverLoading={driverLoading} suspended />
    </div>
  );
};

export default SuspendedDrivers;
