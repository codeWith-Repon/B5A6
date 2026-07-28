import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import {
  useGetCurrentRideQuery,
  useUpdateRiderLocationMutation,
} from '@/redux/features/Rider/rider.api';
import { role } from '@/constants/role';
import { rideStatus } from '@/constants/rideStatus';
import config from '@/config';

const UPDATE_INTERVAL_MS = 12_000; // every 12s while trackable
const GEO_TIMEOUT_MS = 10_000;

// Only broadcast the rider's position up to pickup — once the driver has
// them in the car there's no more need to track where the rider is.
const TRACKABLE_STATUSES = new Set<string>([
  rideStatus.requested,
  rideStatus.accepted,
]);

/**
 * Mirrors DriverTrackingBridge.tsx but for the rider side, so the driver can
 * see the rider's live position on the map before pickup. Runs while:
 *   - VITE_LIVE_TRACKING is true
 *   - signed in as a RIDER
 *   - there's an active ride in REQUESTED/ACCEPTED status
 */
export function RiderTrackingBridge() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const isRider = userInfo?.data?.role === role.rider;

  const { data: rideResponse } = useGetCurrentRideQuery(undefined, {
    skip: !config.liveTracking || !isRider,
    pollingInterval: 15000,
  });

  const ride = rideResponse?.data;
  const [updateLocation] = useUpdateRiderLocationMutation();
  const intervalRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const isTrackable =
    config.liveTracking &&
    isRider &&
    !!ride &&
    TRACKABLE_STATUSES.has(ride.rideStatus);

  useEffect(() => {
    if (!isTrackable) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (!('geolocation' in navigator)) {
      toast.error('Live tracking unavailable', {
        description: "Your browser doesn't support geolocation.",
      });
      return;
    }

    const push = () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            await updateLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }).unwrap();
          } catch (err) {
            console.warn('[rider tracking] update failed', err);
          } finally {
            inFlightRef.current = false;
          }
        },
        (err) => {
          inFlightRef.current = false;
          console.warn('[rider tracking] geo error', err.code, err.message);
          if (err.code === err.PERMISSION_DENIED) {
            toast.error('Location permission denied', {
              description:
                "Your driver won't see your live position until you allow location access for this site.",
            });
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: GEO_TIMEOUT_MS,
          maximumAge: 0,
        }
      );
    };

    push(); // immediate first push
    intervalRef.current = window.setInterval(push, UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTrackable, updateLocation]);

  return null;
}
