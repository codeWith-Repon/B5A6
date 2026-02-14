/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router';
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from '@/redux/features/Notification/notification.api';

export function NotificationDropdown() {
  const navigate = useNavigate();

  const { data: response, isLoading } = useGetNotificationsQuery(undefined, {
    refetchOnFocus: true,
    pollingInterval: 10000,
  });
  const notifications = response?.data || [];

  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [markSingleAsRead] = useMarkAsReadMutation();

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markSingleAsRead(notification._id);
    }
    navigate(`/ride/${notification.ride?._id || notification.ride}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' className='relative group'>
          <Bell className='w-6 h-6 text-foreground/80' />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 flex h-4 w-4'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold ring-2 ring-background'>
                {unreadCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-80 p-0 shadow-xl' align='end'>
        <div className='p-3 border-b flex items-center justify-between bg-muted/20'>
          <h3 className='font-bold text-sm'>Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead(undefined)}
              className='text-[10px] text-primary font-bold hover:underline flex items-center gap-1'
            >
              <CheckCheck className='w-3 h-3' /> Mark all read
            </button>
          )}
        </div>

        <div className='max-h-80 overflow-y-auto'>
          {isLoading ? (
            <div className='p-4 text-center text-xs italic'>Loading...</div>
          ) : notifications.length === 0 ? (
            <div className='p-8 text-center text-xs opacity-50'>
              No notifications
            </div>
          ) : (
            notifications.map((notification: any) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 border-b border-border/40 cursor-pointer transition-colors ${
                  !notification.isRead
                    ? 'bg-primary/5'
                    : 'bg-transparent opacity-70'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <p
                    className={`text-[12px] ${!notification.isRead ? 'font-bold' : 'font-medium'}`}
                  >
                    {notification.title}
                  </p>
                  {!notification.isRead && (
                    <div className='h-2 w-2 rounded-full bg-primary mt-1' />
                  )}
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5 line-clamp-2'>
                  {notification.message}
                </p>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
