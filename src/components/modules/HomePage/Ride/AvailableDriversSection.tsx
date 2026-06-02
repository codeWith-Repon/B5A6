/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShieldCheck, Car, MapPin, Loader2, Inbox } from 'lucide-react';
import type { IGetFreeDrivers } from '@/types/driver.types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AvailableDriversSectionProps {
  drivers: IGetFreeDrivers[] | [];
  selectedDriver: string | null;
  onSelectDriver: (driverId: string) => void;
  pickupLocation: string;
  dropLocation: string;
  isLoading?: boolean;
  /** Kept for API compatibility — the parent's sticky bar handles submit now. */
  onSubmit?: (data: any) => void;
  onSubmitLoading?: boolean;
  distance?: string;
}

export function AvailableDriversSection({
  drivers,
  selectedDriver,
  onSelectDriver,
  pickupLocation,
  dropLocation,
  isLoading,
  distance,
}: AvailableDriversSectionProps) {
  const hasRoute = pickupLocation && dropLocation;
  const routeBroken = distance === 'Route not found';

  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex items-center justify-between px-1'>
        <h3 className='text-sm font-semibold text-foreground'>
          Nearby drivers
        </h3>
        <span className='text-xs text-muted-foreground tabular-nums'>
          {hasRoute && !routeBroken ? drivers.length : 0} available
        </span>
      </div>

      {/* States */}
      {isLoading ? (
        <AvailableDriversSkeleton />
      ) : routeBroken ? (
        <EmptyState
          icon={<MapPin className='w-5 h-5 text-destructive' />}
          title='Route not available'
          subtitle='Try a more specific pickup or drop address.'
          tone='destructive'
        />
      ) : !hasRoute ? (
        <EmptyState
          icon={<Inbox className='w-5 h-5 text-muted-foreground' />}
          title='Pick a destination'
          subtitle='Drivers will appear once both locations are set.'
        />
      ) : drivers.length === 0 ? (
        <EmptyState
          icon={<Car className='w-5 h-5 text-muted-foreground' />}
          title='No drivers nearby'
          subtitle="We'll auto-match when you book."
        />
      ) : (
        <ul className='space-y-2'>
          {drivers.map((driver) => {
            const selected = selectedDriver === driver._id;
            return (
              <li key={driver._id}>
                <button
                  type='button'
                  onClick={() => onSelectDriver(driver._id)}
                  className={cn(
                    'group w-full text-left p-3 rounded-xl border transition-colors flex items-center gap-3',
                    selected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/40'
                  )}
                >
                  {/* Avatar */}
                  <div className='relative shrink-0'>
                    <img
                      src={driver.user.image}
                      alt={driver.user.name}
                      className='w-11 h-11 rounded-full object-cover border border-border'
                    />
                    <span
                      className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                        driver.availabilityStatus === 'ONLINE'
                          ? 'bg-emerald-500'
                          : 'bg-muted-foreground'
                      )}
                    />
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <h4 className='font-semibold text-sm text-foreground truncate'>
                        {driver.user.name}
                      </h4>
                      {driver.status === 'APPROVED' && (
                        <ShieldCheck className='w-3.5 h-3.5 text-primary shrink-0' />
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground truncate mt-0.5'>
                      {driver.vehicle.brand} {driver.vehicle.model}
                      <span className='text-muted-foreground/60 mx-1.5'>•</span>
                      {driver.experience}y exp
                    </p>
                  </div>

                  {/* Selected indicator */}
                  <div
                    className={cn(
                      'shrink-0 w-4 h-4 rounded-full border transition-colors',
                      selected
                        ? 'bg-primary border-primary'
                        : 'border-border group-hover:border-primary/40'
                    )}
                  >
                    {selected && (
                      <svg
                        viewBox='0 0 16 16'
                        className='w-full h-full text-primary-foreground'
                      >
                        <path
                          d='M4 8.5l2.5 2.5L12 5.5'
                          stroke='currentColor'
                          strokeWidth='2'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Trust line */}
      <div className='flex items-center gap-2 px-1 pt-1 text-[11px] text-muted-foreground'>
        <ShieldCheck className='w-3.5 h-3.5' />
        All drivers are background-verified.
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone?: 'destructive';
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed p-6 text-center space-y-2',
        tone === 'destructive'
          ? 'border-destructive/40 bg-destructive/5'
          : 'border-border bg-secondary/30'
      )}
    >
      <div className='mx-auto w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center'>
        {icon}
      </div>
      <p className='text-sm font-medium text-foreground'>{title}</p>
      <p className='text-xs text-muted-foreground'>{subtitle}</p>
    </div>
  );
}

export function AvailableDriversSkeleton() {
  return (
    <ul className='space-y-2'>
      {[1, 2, 3].map((i) => (
        <li
          key={i}
          className='p-3 rounded-xl border border-border bg-card flex items-center gap-3'
        >
          <Skeleton className='w-11 h-11 rounded-full shrink-0' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-3 w-40' />
          </div>
          <Loader2 className='w-3 h-3 animate-spin text-muted-foreground' />
        </li>
      ))}
    </ul>
  );
}
