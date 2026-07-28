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
  const userRole = userInfo?.data?.role;
  // Ride chat is a rider<->driver feature only. The backend's getCurrentRide
  // doesn't scope to the caller for ADMIN/SUPER_ADMIN (it returns the first
  // non-terminal ride system-wide), so querying it here would show an admin
  // some random ride's chat/avatar — never fetch for non-participant roles.
  const isParticipant = userRole === role.rider || userRole === role.driver;

  const { data: rideResponse } = useGetCurrentRideQuery(undefined, {
    skip: !isParticipant,
    pollingInterval: 15000,
  });

  const ride = rideResponse?.data;
  if (!ride || !ACTIVE_STATUSES.has(ride.rideStatus)) return null;

  const counterpart = userRole === role.rider ? ride.driver?.user : ride.user;

  return (
    <ChatPanel
      rideId={ride._id}
      rideStatus={ride.rideStatus}
      counterpart={counterpart}
    />
  );
}
