/* eslint-disable @typescript-eslint/no-explicit-any */
import { Phone, ShieldCheck, Car, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IGetFreeDrivers } from '@/types/driver.types';
import { Skeleton } from '@/components/ui/skeleton';

interface AvailableDriversSectionProps {
  drivers: IGetFreeDrivers[] | [];
  selectedDriver: string | null;
  onSelectDriver: (driverId: string) => void;
  pickupLocation: string;
  dropLocation: string;
  isLoading?: boolean;
  onSubmit: (data: any) => void;
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
  onSubmit,
  onSubmitLoading,
  distance,
}: AvailableDriversSectionProps) {
  return (
    <>
      {isLoading && <AvailableDriversSkeleton />}

      <div className='lg:max-w-md mx-auto space-y-6 p-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-extrabold tracking-tight text-foreground'>
            Nearby Drivers
          </h3>
          <Badge
            variant='secondary'
            className='bg-primary/10 text-primary hover:bg-primary/20'
          >
            {pickupLocation && dropLocation ? drivers.length : 0} found
          </Badge>
        </div>

        {distance === 'Route not found' ? (
          <div className='bg-red-500/10 border-2 border-dashed border-red-500/20 rounded-3xl p-6 text-center space-y-4'>
            <div className='bg-red-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto'>
              <Car className='text-red-500 w-6 h-6' />
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-red-500'>
                Route not found
              </p>
              <p className='text-xs text-red-500'>
                Please enter a valid address.
              </p>
            </div>
          </div>
        ) : !pickupLocation || !dropLocation ? (
          <div className='bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-3xl p-10 text-center space-y-4'>
            <div className='bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto'>
              <Car className='text-muted-foreground w-6 h-6' />
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-foreground'>
                Ready to head out?
              </p>
              <p className='text-xs text-muted-foreground'>
                Set your destination to view available drivers.
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-4 max-h-150 overflow-y-auto pr-2 driver-list-scrollbar [scrollbar-gutter:stable]'>
            {drivers.map((driver) => (
              <div
                key={driver._id}
                onClick={() => onSelectDriver(driver._id)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                  selectedDriver === driver._id
                    ? 'border-primary bg-primary/2 ring-2 ring-primary/20 shadow-xl -translate-y-0.5'
                    : 'border-border bg-card hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <div className='p-5'>
                  {/* Header: Driver Info (No Fare) */}
                  <div className='flex items-center gap-4'>
                    <div className='relative shrink-0'>
                      <img
                        src={driver.user.image}
                        alt={driver.user.name}
                        className='w-14 h-14 rounded-full object-cover border-2 border-background shadow-sm'
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-background rounded-full ${
                          driver.availabilityStatus === 'ONLINE'
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}
                      />
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <h4 className='font-bold text-lg text-foreground truncate uppercase tracking-tight'>
                          {driver.user.name}
                        </h4>
                        {driver.status === 'APPROVED' && (
                          <ShieldCheck className='w-4 h-4 text-blue-500 shrink-0' />
                        )}
                      </div>

                      <div className='flex items-center gap-2 mt-1'>
                        <Badge
                          variant='outline'
                          className='text-[10px] px-2 py-0 border-primary/20 text-primary uppercase italic font-black'
                        >
                          {driver.experience} Year Exp.
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details Section */}
                  <div className='mt-5 grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border/50'>
                    <div className='flex items-center gap-2'>
                      <div className='p-1.5 bg-background rounded-lg shadow-sm'>
                        <Car className='w-3.5 h-3.5 text-muted-foreground' />
                      </div>
                      <div>
                        <p className='text-[10px] uppercase text-muted-foreground font-semibold leading-none'>
                          Vehicle
                        </p>
                        <p className='text-xs font-bold truncate max-w-30'>
                          {driver.vehicle.brand} {driver.vehicle.model}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='p-1.5 bg-background rounded-lg shadow-sm'>
                        <Briefcase className='w-3.5 h-3.5 text-muted-foreground' />
                      </div>
                      <div>
                        <p className='text-[10px] uppercase text-muted-foreground font-semibold leading-none'>
                          License
                        </p>
                        <p className='text-xs font-bold'>
                          {driver.licenseNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Actions */}
                  {selectedDriver === driver._id && (
                    <div className='mt-5 flex gap-2 animate-in fade-in zoom-in-95 duration-300'>
                      <Button
                        className='flex-1 bg-primary text-primary-foreground font-bold h-12 rounded-xl shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => onSubmit(driver._id)}
                        disabled={onSubmitLoading}
                      >
                        {onSubmitLoading ? 'Loading...' : 'Request Ride'}
                      </Button>
                      <a href={`tel:${driver.user.phone}`} className='contents'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='w-12 h-12 rounded-xl border-2 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={onSubmitLoading}
                        >
                          <Phone className='w-5 h-5' />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Footer */}
        <div className='bg-linear-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-3'>
          <div className='bg-emerald-500/20 p-2 rounded-lg'>
            <ShieldCheck className='w-5 h-5 text-emerald-600' />
          </div>
          <div className='space-y-0.5'>
            <p className='text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wide'>
              Verified Drivers Only
            </p>
            <p className='text-[11px] text-emerald-700/70 dark:text-emerald-400/60 leading-tight'>
              Every driver in our network undergoes a rigorous background check
              for your security.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function AvailableDriversSkeleton() {
  return (
    <div className='lg:max-w-md mx-auto space-y-6 p-4'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-7 w-32 rounded-lg' />
        <Skeleton className='h-6 w-16 rounded-full' />
      </div>

      {/* Driver List Skeleton */}
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='rounded-2xl border border-border bg-card p-5 space-y-5'
          >
            {/* Driver Info Header */}
            <div className='flex items-center gap-4'>
              <Skeleton className='w-14 h-14 rounded-full shrink-0' />
              <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-5 w-24' />
                  <Skeleton className='h-4 w-4 rounded-full' />
                </div>
                <Skeleton className='h-4 w-20 rounded-md' />
              </div>
            </div>

            {/* Vehicle Details Section Skeleton */}
            <div className='grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border/50'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-7 w-7 rounded-lg shrink-0' />
                <div className='space-y-1 w-full'>
                  <Skeleton className='h-2 w-10' />
                  <Skeleton className='h-3 w-16' />
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-7 w-7 rounded-lg shrink-0' />
                <div className='space-y-1 w-full'>
                  <Skeleton className='h-2 w-10' />
                  <Skeleton className='h-3 w-16' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Footer Skeleton */}
      <div className='border border-border/50 rounded-2xl p-4 flex items-center gap-3'>
        <Skeleton className='w-9 h-9 rounded-lg shrink-0' />
        <div className='space-y-2 w-full'>
          <Skeleton className='h-3 w-32' />
          <Skeleton className='h-2 w-full' />
        </div>
      </div>
    </div>
  );
}
