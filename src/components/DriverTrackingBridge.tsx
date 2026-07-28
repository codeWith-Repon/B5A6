import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import {
  useGetDriversQuery,
  useUpdateDriverLocationMutation,
} from '@/redux/features/driver/driver.api';
import { role } from '@/constants/role';
import { driverOnlineStatus } from '@/constants/driverStatus';
import config from '@/config';

const UPDATE_INTERVAL_MS = 12_000; // every 12s while ONLINE
const GEO_TIMEOUT_MS = 10_000;

/**
 * Runs the driver-side location broadcast loop while:
 *   - VITE_LIVE_TRACKING is true (backend must expose PATCH /driver/me/location)
 *   - signed in as a DRIVER
 *   - the driver record exists and availabilityStatus === ONLINE
 *
 * Reads geolocation every UPDATE_INTERVAL_MS and PATCHes /driver/me/location.
 * No-ops for other roles; surfaces a toast if geolocation is denied/unsupported
 * so the driver knows why riders aren't seeing their live position.
 */
export function DriverTrackingBridge() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const isDriver = userInfo?.data?.role === role.driver;

  // Subscribe to the driver's own record so this auto-starts/stops with the toggler
  const { data: driverData } = useGetDriversQuery(
    { user: userInfo?.data?._id },
    { skip: !config.liveTracking || !isDriver || !userInfo?.data?._id }
  );

  const [updateLocation] = useUpdateDriverLocationMutation();
  const intervalRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const isOnline =
    config.liveTracking &&
    isDriver &&
    driverData?.data?.[0]?.availabilityStatus === driverOnlineStatus.online;

  useEffect(() => {
    if (!isOnline) {
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
            console.warn('[tracking] update failed', err);
          } finally {
            inFlightRef.current = false;
          }
        },
        (err) => {
          inFlightRef.current = false;
          console.warn('[tracking] geo error', err.code, err.message);
          if (err.code === err.PERMISSION_DENIED) {
            toast.error('Location permission denied', {
              description:
                "Riders won't see your live position until you allow location access for this site.",
            });
            // Stop the loop until next status change — no point retrying every
            // 12s against a permission the browser will keep denying.
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          } else {
            toast.error('Live tracking hiccup', {
              description: 'Could not get your current location. Retrying shortly.',
            });
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
  }, [isOnline, updateLocation]);

  return null;
}
