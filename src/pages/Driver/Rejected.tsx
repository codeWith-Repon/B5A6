import RideHistoryTable from '@/components/modules/Driver/RideHistoryTable';
import { rideStatus } from '@/constants/rideStatus';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import { useGetRideRequestQuery } from '@/redux/features/ride/ride.api';

const Rejected = () => {
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: driver } = useGetDriversQuery(
    { user: userData?.data?._id },
    { skip: !userData?.data?._id }
  );
  const {
    data: rideData,
    isLoading,
    isFetching,
    isUninitialized,
  } = useGetRideRequestQuery(
    { driver: driver?.data[0]?._id, rideStatus: rideStatus.rejected },
    { skip: !driver?.data[0]?._id }
  );

  const loading = isLoading || isFetching || isUninitialized;

  return (
    <div>
      <RideHistoryTable rideData={rideData} isLoading={loading} />
    </div>
  );
};

export default Rejected;
