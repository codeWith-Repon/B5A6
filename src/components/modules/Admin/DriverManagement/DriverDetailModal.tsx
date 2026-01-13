import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import type { IDriverResponse, IUser } from '@/types/driver.types';
import { role } from '@/constants/role';

interface DetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IDriverResponse | IUser | null;
  isLoading?: boolean;
}

export function DriverDetailModal({
  open,
  onOpenChange,
  data,
  isLoading,
}: DetailModalProps) {
  const [imageIndex, setImageIndex] = useState(0);

  if (!data) return null;

  const isDriver = (data as IDriverResponse).user.role === role.driver;
  const isRider = (data as IDriverResponse).user.role === role.rider;

  const user = isDriver ? (data as IDriverResponse).user : (data as IUser);
  const driver = isDriver ? (data as IDriverResponse) : null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'ONLINE':
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'OFFLINE':
      case 'INACTIVE':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    const upperStatus = status?.toUpperCase();
    if (
      upperStatus === 'APPROVED' ||
      upperStatus === 'ONLINE' ||
      upperStatus === 'ACTIVE'
    ) {
      return <CheckCircle2 className='w-4 h-4' />;
    }
    if (upperStatus === 'PENDING') {
      return <AlertCircle className='w-4 h-4' />;
    }
    if (upperStatus === 'REJECTED') {
      return <AlertCircle className='w-4 h-4' />;
    }
    return null;
  };

  const vehicleImages = driver?.vehicle.images || [];
  const hasImages = vehicleImages.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[40vw] max-h-[90vh] overflow-y-auto'>
        {isLoading && (
          <div className='flex justify-center items-center h-full absolute inset-0 backdrop-blur-3xl'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            <UserPlus className='absolute size-5 text-primary opacity-65' />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {isDriver
              ? 'Driver Details'
              : isRider
              ? 'Rider Details'
              : 'Admin Details'}
          </DialogTitle>
          <DialogDescription>
            Complete profile information for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* User Profile Header */}
          <div className='flex items-start gap-4 pb-6 border-b border-border'>
            <Avatar className='h-24 w-24 shrink-0'>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className='text-lg font-bold'>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex flex-col  gap-3 mb-4 flex-wrap'>
                <p className='text-2xl font-bold text-foreground'>
                  {user.name}
                </p>

                <div className='flex gap-3 items-center'>
                  {user.isVerified && (
                    <Badge className='bg-green-500/10 text-green-700 border border-green-200'>
                      ✓ Verified
                    </Badge>
                  )}
                  {driver && (
                    <Badge
                      className={`border ${getStatusColor(driver.status)}`}
                    >
                      <span className='flex items-center gap-1'>
                        {getStatusIcon(driver.status)}
                        {driver.status}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
              

              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Mail className='w-4 h-4' />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Phone className='w-4 h-4' />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <MapPin className='w-4 h-4' />
                    <span>{user.address}</span>
                  </div>
                )}
              </div>

              <div className='flex gap-6 mt-4 pt-4 border-t border-border'>
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                    Role
                  </p>
                  <p className='font-semibold text-foreground capitalize mt-1'>
                    {user.role?.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                    Status
                  </p>
                  <p className='font-semibold text-foreground capitalize mt-1'>
                    {user.isActive}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Emails */}
          {user.emergencyContactEmail &&
            user.emergencyContactEmail.length > 0 && (
              <div className='bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4'>
                <h4 className='font-semibold text-foreground mb-3 flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4 text-amber-600' />
                  Emergency Contact Emails
                </h4>
                <div className='space-y-2'>
                  {user.emergencyContactEmail.map((email, idx) => (
                    <div key={idx} className='flex items-center gap-2 text-sm'>
                      <Mail className='w-4 h-4 text-amber-600' />
                      <a
                        href={`mailto:${email}`}
                        className='text-amber-700 dark:text-amber-400 hover:underline break-all'
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Driver Specific Info */}
          {driver && (
            <>
              {/* Vehicle Images Gallery */}
              {hasImages && (
                <div>
                  <h4 className='font-semibold text-foreground mb-3'>
                    Vehicle Photos
                  </h4>
                  <div className='relative w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden'>
                    <img
                      src={vehicleImages[imageIndex]}
                      alt={`Vehicle ${imageIndex + 1}`}
                      className='w-full h-72 object-cover'
                    />
                    {vehicleImages.length > 1 && (
                      <>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800'
                          onClick={() =>
                            setImageIndex(
                              (imageIndex - 1 + vehicleImages.length) %
                                vehicleImages.length
                            )
                          }
                        >
                          <ChevronLeft className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800'
                          onClick={() =>
                            setImageIndex(
                              (imageIndex + 1) % vehicleImages.length
                            )
                          }
                        >
                          <ChevronRight className='w-4 h-4' />
                        </Button>
                        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
                          {vehicleImages.map((_, idx) => (
                            <button
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === imageIndex
                                  ? 'bg-white w-6'
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              onClick={() => setImageIndex(idx)}
                              aria-label={`View image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Driver Statistics */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4'>
                  <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                    License Number
                  </p>
                  <p className='text-lg font-bold text-foreground mt-2'>
                    {driver.licenseNumber}
                  </p>
                </div>
                <div className='bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg p-4'>
                  <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                    Experience
                  </p>
                  <p className='text-lg font-bold text-foreground mt-2'>
                    {driver.experience} years
                  </p>
                </div>
                <div className='bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg p-4'>
                  <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                    Total Rides
                  </p>
                  <p className='text-lg font-bold text-foreground mt-2'>
                    {driver.totalRides}
                  </p>
                </div>
                <div className='bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg p-4'>
                  <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                    Total Earnings
                  </p>
                  <p className='text-lg font-bold text-foreground mt-2'>
                    ${driver.totalEarnings.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Availability Status */}
              <div className='bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4'>
                <h4 className='font-semibold text-foreground mb-3'>
                  Current Status
                </h4>
                <div className='flex flex-wrap gap-3'>
                  <div>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                      Availability
                    </p>
                    <Badge
                      className={`border ${getStatusColor(
                        driver.availabilityStatus
                      )}`}
                    >
                      <span className='flex items-center gap-1'>
                        {getStatusIcon(driver.availabilityStatus)}
                        {driver.availabilityStatus}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h4 className='font-semibold text-foreground mb-4'>
                  Vehicle Details
                </h4>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  <div className='border border-border rounded-lg p-4'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                      Type
                    </p>
                    <p className='font-semibold text-foreground'>
                      {driver.vehicle.vehicleType}
                    </p>
                  </div>
                  <div className='border border-border rounded-lg p-4'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                      Brand
                    </p>
                    <p className='font-semibold text-foreground'>
                      {driver.vehicle.brand}
                    </p>
                  </div>
                  <div className='border border-border rounded-lg p-4'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                      Model
                    </p>
                    <p className='font-semibold text-foreground'>
                      {driver.vehicle.model}
                    </p>
                  </div>
                  <div className='border border-border rounded-lg p-4 md:col-span-3'>
                    <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                      Vehicle License Plate
                    </p>
                    <p className='font-mono text-lg font-bold text-foreground'>
                      {driver.vehicle.vehicleLicense}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className='bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-xs text-muted-foreground'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='uppercase tracking-wide font-semibold mb-1'>
                      Created
                    </p>
                    <p>
                      {new Date(driver.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' at '}
                      {new Date(driver.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className='uppercase tracking-wide font-semibold mb-1'>
                      Last Updated
                    </p>
                    <p>
                      {new Date(driver.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' at '}
                      {new Date(driver.updatedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
