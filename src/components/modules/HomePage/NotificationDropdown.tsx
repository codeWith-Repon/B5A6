import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  type:
    | 'driver_accepted'
    | 'ride_started'
    | 'ride_completed'
    | 'payment_confirmed';
  title: string;
  message: string;
  driverName?: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'driver_accepted',
    title: 'Driver Accepted',
    message: 'Your ride has been accepted by Rahat Khan',
    driverName: 'Rahat Khan',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    read: false,
  },
  {
    id: '2',
    type: 'ride_started',
    title: 'Ride Started',
    message: 'Your ride with Fatima Ahmed has started',
    driverName: 'Fatima Ahmed',
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    read: true,
  },
  {
    id: '3',
    type: 'ride_completed',
    title: 'Ride Completed',
    message: 'Your ride has been completed. Rate your driver',
    timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    read: true,
  },
  {
    id: '4',
    type: 'payment_confirmed',
    title: 'Payment Confirmed',
    message: 'Payment of ৳245 has been processed successfully',
    timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    read: true,
  },
];

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getNotificationColor(type: string): string {
  switch (type) {
    case 'driver_accepted':
      return 'bg-blue-500/[0.03] border-l-4 border-blue-500 hover:bg-blue-500/[0.06]';
    case 'ride_started':
      return 'bg-green-500/[0.03] border-l-4 border-green-500 hover:bg-green-500/[0.06]';
    case 'ride_completed':
      return 'bg-purple-500/[0.03] border-l-4 border-purple-500 hover:bg-purple-500/[0.06]';
    case 'payment_confirmed':
      return 'bg-emerald-500/[0.03] border-l-4 border-emerald-500 hover:bg-emerald-500/[0.06]';
    default:
      return 'bg-muted';
  }
}

function getNotificationIconColor(type: string): string {
  switch (type) {
    case 'driver_accepted':
      return 'bg-blue-500/20 text-blue-600';
    case 'ride_started':
      return 'bg-green-500/20 text-green-600';
    case 'ride_completed':
      return 'bg-purple-500/20 text-purple-600';
    case 'payment_confirmed':
      return 'bg-emerald-500/20 text-emerald-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function NotificationDropdown() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleClearNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='relative hover:bg-primary/10 transition-colors group'
          aria-label='Notifications'
        >
          <Bell className='w-10 h-10 transition-transform group-hover:scale-110 group-active:scale-95 text-foreground/80 group-hover:text-primary' />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 flex h-4 w-4'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold ring-2 ring-background'>
                {unreadCount > 9 ? '9' : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-96 p-0 shadow-2xl border-primary/10'
        align='end'
      >
        {/* Header */}
        <div className='p-4 border-b border-border flex items-center justify-between bg-muted/30'>
          <div className='flex items-center gap-2'>
            <h3 className='font-bold text-foreground'>Notifications</h3>
            {unreadCount > 0 && (
              <span className='bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider'>
                {unreadCount} New
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className='text-xs text-primary hover:underline font-medium'
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className='max-h-100 overflow-y-auto'>
          {notifications.length === 0 ? (
            <div className='p-8 text-center'>
              <Bell className='w-12 h-12 text-foreground/20 mx-auto mb-3' />
              <p className='text-sm text-foreground/60'>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border/50 ${getNotificationColor(
                  notification.type,
                )} transition-all duration-200 cursor-pointer relative group ${notification.read ? 'opacity-80 hover:opacity-100' : 'opacity-100'}`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className='flex items-start gap-3'>
                  {/* Icon */}
                  <div
                    className={`mt-1 p-2 rounded-full ${getNotificationIconColor(notification.type)}`}
                  >
                    {notification.type === 'driver_accepted' && (
                      <Check className='w-3.5 h-3.5' />
                    )}
                    {notification.type === 'ride_started' && (
                      <Check className='w-3.5 h-3.5' />
                    )}
                    {notification.type === 'ride_completed' && (
                      <Check className='w-3.5 h-3.5' />
                    )}
                    {notification.type === 'payment_confirmed' && (
                      <Check className='w-3.5 h-3.5' />
                    )}
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between gap-2'>
                      <p
                        className={`font-semibold text-sm ${notification.read ? 'text-foreground/70' : 'text-foreground'}`}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className='flex h-2 w-2'>
                          <span className='animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75'></span>
                          <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-foreground/70 mt-1 line-clamp-2'>
                      {notification.message}
                    </p>
                    <p className='text-xs text-foreground/50 mt-2'>
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearNotification(notification.id);
                    }}
                    className='opacity-0 group-hover:opacity-100 transition-opacity shrink-0'
                    aria-label='Close notification'
                  >
                    <X className='w-4 h-4 text-foreground/50 hover:text-foreground' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='p-3 text-center text-sm text-primary hover:text-primary cursor-pointer'>
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
