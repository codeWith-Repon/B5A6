import RideHistoryTable from '@/components/modules/Driver/RideHistoryTable';
import { rideStatus } from '@/constants/rideStatus';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetRideRequestQuery } from '@/redux/features/ride/ride.api';

const Cancelled = () => {
  const { data: userData } = useUserInfoQuery(undefined);
  const {
    data: rideData,
    isLoading,
    isFetching,
    isUninitialized,
  } = useGetRideRequestQuery(
    {
      user: userData?.data?._id,
      rideStatus: rideStatus.cancelled,
    },
    { skip: !userData?.data?._id }
  );

  const loading = isLoading || isFetching || isUninitialized;

  return (
    <div>
      <RideHistoryTable rideData={rideData} isLoading={loading} />
    </div>
  );
};

export default Cancelled;
