import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { rideSocket } from '@/lib/socket';
import { tokenStorage } from '@/lib/tokenStorage';
import { useAppDispatch } from '@/redux/hook';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { baseApi } from '@/redux/baseApi';
import { chatApi } from '@/redux/features/Chat/chat.api';

/**
 * Bridges the WebSocket to RTK Query:
 *  - connects on login / disconnects on logout
 *  - invalidates relevant tags on incoming events
 *  - patches the chat cache live without refetch
 *  - refetches current ride + open chat on reconnect
 */
export function SocketBridge() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const dispatch = useAppDispatch();
  const wasOpenRef = useRef(false);
  const userId = userInfo?.data?._id;

  // (1) Connect/disconnect with auth state
  useEffect(() => {
    if (!userInfo?.success) {
      rideSocket.close();
      return;
    }
    rideSocket.connect(tokenStorage.get());
  }, [userInfo?.success, userInfo?.data?._id]);

  // (2) Route incoming frames
  useEffect(() => {
    if (!userInfo?.success) return;

    return rideSocket.on((msg) => {
      switch (msg.type) {
        case 'notification:new': {
          const n = (msg as { notification?: { title: string; message: string } })
            .notification;
          if (n) {
            toast(n.title, { description: n.message });
          }
          dispatch(baseApi.util.invalidateTags(['Notifications']));
          break;
        }

        case 'ride:status': {
          dispatch(
            baseApi.util.invalidateTags([
              'CurrentRide',
              'RideRequest',
              'RideHistory',
            ])
          );
          break;
        }

        case 'ride:otp-verified': {
          dispatch(baseApi.util.invalidateTags(['CurrentRide']));
          break;
        }

        case 'chat:new': {
          const m = msg as {
            rideId?: string;
            message?: import('@/lib/socket').IRideMessage;
          };
          if (m.rideId && m.message) {
            const rideId = m.rideId;
            const message = m.message;
            dispatch(
              chatApi.util.updateQueryData('getRideMessages', rideId, (draft) => {
                if (!draft.some((d) => d._id === message._id)) {
                  draft.push(message);
                }
              })
            );
          }
          break;
        }

        case 'chat:read': {
          const m = msg as { rideId?: string; by?: string; readAt?: string };
          if (m.rideId && m.by && m.readAt) {
            const rideId = m.rideId;
            const by = m.by;
            const readAt = m.readAt;
            dispatch(
              chatApi.util.updateQueryData('getRideMessages', rideId, (draft) => {
                draft.forEach((d) => {
                  if (d.sender?._id !== by && d.readAt == null) {
                    d.readAt = readAt;
                  }
                });
              })
            );
          }
          break;
        }

        case 'error': {
          const err = (msg as { message?: string }).message;
          if (err) console.warn('[ws] error:', err);
          break;
        }
      }
    });
  }, [userInfo?.success, dispatch, userId]);

  // (3) Refetch on reconnect — invalidate tags so any subscribed query refetches
  useEffect(() => {
    if (!userInfo?.success) return;
    return rideSocket.onStatus((status) => {
      if (status === 'open' && wasOpenRef.current) {
        // reconnect (not initial open)
        dispatch(
          baseApi.util.invalidateTags([
            'CurrentRide',
            'Notifications',
            'Chat',
          ])
        );
      }
      wasOpenRef.current = status === 'open';
    });
  }, [userInfo?.success, dispatch]);

  return null;
}
