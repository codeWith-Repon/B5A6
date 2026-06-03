/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertTriangle,
  Bell,
  Car,
  CheckCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  type INotification,
} from '@/redux/features/Notification/notification.api';
import { cn } from '@/lib/utils';

const Notifications = () => {
  const { data: response, isLoading, isFetching } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllAsReadMutation();

  const items: INotification[] = (response as any)?.data ?? [];
  const unreadCount = items.filter((n) => !n.isRead).length;

  const handleMarkAll = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllAsRead().unwrap();
      toast.success('All caught up');
    } catch {
      toast.error('Could not mark all as read');
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch {
      /* silent */
    }
  };

  return (
    <div className='container mx-auto max-w-3xl px-4 py-10 space-y-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2'>
            <Bell className='w-6 h-6' />
            Notifications
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={handleMarkAll}
          disabled={unreadCount === 0 || isMarkingAll}
          className='gap-2'
        >
          {isMarkingAll ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <CheckCheck className='w-4 h-4' />
          )}
          Mark all read
        </Button>
      </header>

      {isLoading ? (
        <div className='space-y-2'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-16 w-full rounded-md' />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='rounded-xl border border-dashed border-border p-12 text-center bg-secondary/30'>
          <div className='mx-auto w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center mb-3'>
            <Bell className='w-5 h-5 text-muted-foreground' />
          </div>
          <p className='text-sm font-medium text-foreground'>
            No notifications yet
          </p>
          <p className='text-xs text-muted-foreground'>
            Updates about your rides will show up here.
          </p>
        </div>
      ) : (
        <ul
          className={cn(
            'space-y-2 transition-opacity',
            isFetching && 'opacity-70'
          )}
        >
          {items.map((n) => (
            <NotificationRow
              key={n._id}
              n={n}
              onMarkRead={() => handleMarkOne(n._id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

function NotificationRow({
  n,
  onMarkRead,
}: {
  n: INotification;
  onMarkRead: () => void;
}) {
  const Icon = iconFor(n.type);
  return (
    <li
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border transition-colors',
        n.isRead
          ? 'bg-card border-border'
          : 'bg-primary/5 border-primary/30'
      )}
    >
      <span
        className={cn(
          'w-9 h-9 rounded-md flex items-center justify-center shrink-0',
          n.isRead
            ? 'bg-secondary text-muted-foreground'
            : 'bg-primary/15 text-primary'
        )}
      >
        <Icon className='w-4 h-4' />
      </span>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold text-foreground'>{n.title}</p>
        <p className='text-sm text-muted-foreground'>{n.message}</p>
        <p className='text-xs text-muted-foreground/70 mt-1'>
          {new Date(n.createdAt).toLocaleString()}
        </p>
      </div>
      {!n.isRead && (
        <Button
          variant='ghost'
          size='sm'
          className='gap-1.5'
          onClick={onMarkRead}
          aria-label='Mark as read'
        >
          <CheckCircle2 className='w-3.5 h-3.5' />
          Mark read
        </Button>
      )}
    </li>
  );
}

function iconFor(type: string | undefined) {
  switch ((type || '').toUpperCase()) {
    case 'RIDE':
      return Car;
    case 'SOS':
      return AlertTriangle;
    default:
      return Bell;
  }
}

export default Notifications;
