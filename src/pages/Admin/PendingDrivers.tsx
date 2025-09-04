import DataTable from '@/components/modules/Admin/DataTable';
import { driverStatus } from '@/constants/driverStatus';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';

const PendingDrivers = () => {
  const { data: drivers, isLoading: driverLoading } = useGetDriversQuery({
    status: driverStatus.pending,
  });

  return (
    <div>
      <DataTable drivers={drivers} driverLoading={driverLoading} pending />
    </div>
  );
};

export default PendingDrivers;
