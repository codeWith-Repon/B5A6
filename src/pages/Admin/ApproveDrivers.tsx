import DataTable from '@/components/modules/Admin/DataTable';
import { driverStatus } from '@/constants/driverStatus';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';

const ApproveDrivers = () => {
  const { data: drivers, isLoading: driverLoading } = useGetDriversQuery({
    status: driverStatus.approved,
  });

  return (
    <div>
      <DataTable drivers={drivers} driverLoading={driverLoading} approved />
    </div>
  );
};

export default ApproveDrivers;
