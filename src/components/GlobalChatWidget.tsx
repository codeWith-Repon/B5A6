import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetCurrentRideQuery } from '@/redux/features/Rider/rider.api';
import { role } from '@/constants/role';
import { rideStatus } from '@/constants/rideStatus';
import ChatPanel from '@/components/modules/Ride/Chat/ChatPanel';

const ACTIVE_STATUSES = new Set<string>([
  rideStatus.accepted,
  rideStatus.pickedUp,
  rideStatus.inTransit,
]);

/**
 * Mounted once at the app root (see main.tsx) so the chat bubble follows you
 * across every route — home, dashboards, wherever — for as long as you have
 * an active ride. CurrentRide.tsx no longer renders its own ChatPanel.
 */
export function GlobalChatWidget() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const isAuthed = !!userInfo?.success;

  const { data: rideResponse } = useGetCurrentRideQuery(undefined, {
    skip: !isAuthed,
    pollingInterval: 15000,
  });

  const ride = rideResponse?.data;
  if (!ride || !ACTIVE_STATUSES.has(ride.rideStatus)) return null;

  const isRider = userInfo?.data?.role === role.rider;
  const counterpart = isRider ? ride.driver?.user : ride.user;

  return (
    <ChatPanel
      rideId={ride._id}
      rideStatus={ride.rideStatus}
      counterpart={counterpart}
    />
  );
}
