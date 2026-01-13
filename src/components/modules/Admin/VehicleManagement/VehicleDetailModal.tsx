import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Car,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { IVehicle } from '@/types/vehicle.types';

interface VehicleDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IVehicle | null;
  isLoading?: boolean;
}

export function VehicleDetailModal({
  open,
  onOpenChange,
  data,
  isLoading,
}: VehicleDetailModalProps) {
  const [imageIndex, setImageIndex] = useState(0);

  if (!data) return null;

  const vehicleImages = data.images || [];
  const hasMultipleImages = vehicleImages.length > 1;

  console.log(data);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-150 max-h-[90vh] overflow-y-auto p-0 border'>
        {/* Loading Overlay */}
        {isLoading && (
          <div className='absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          </div>
        )}

        {/* Hero Image Section */}
        <div className='relative w-full aspect-video bg-muted group'>
          {vehicleImages.length > 0 ? (
            <img
              src={vehicleImages[imageIndex]}
              alt={data.model}
              className='h-full w-full object-cover transition-transform duration-500'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
              <Car className='h-20 w-20 opacity-20' />
            </div>
          )}

          {/* Image Navigation */}
          {hasMultipleImages && (
            <>
              <Button
                variant='secondary'
                size='icon'
                className='absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={() =>
                  setImageIndex((prev) =>
                    prev === 0 ? vehicleImages.length - 1 : prev - 1
                  )
                }
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='secondary'
                size='icon'
                className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={() =>
                  setImageIndex((prev) =>
                    prev === vehicleImages.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </>
          )}

          {/* Floating Plate Badge */}
          <div className='absolute bottom-4 left-4'>
            <div className='bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-sm shadow-2xl'>
              <span className='font-mono text-white text-sm font-bold tracking-widest uppercase'>
                {data.vehicleLicense}
              </span>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-6'>
          <div className='flex justify-between items-start'>
            <div>
              <h2 className='text-2xl font-bold text-foreground'>
                {data.brand}
              </h2>
              <p className='text-muted-foreground font-medium'>{data.model}</p>
            </div>
            <Badge className='bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors'>
              {data.vehicleType}
            </Badge>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Driver Info Card */}
            <div className='flex flex-col gap-3 p-4 rounded-xl bg-muted/50 border border-border'>
              <h4 className='text-xs font-bold uppercase text-muted-foreground flex items-center gap-2'>
                <User className='h-3 w-3' /> Assigned Driver
              </h4>
              <div className='space-y-1'>
                <p className='font-semibold text-sm'>{data.driver.name}</p>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <Mail className='h-3 w-3' />
                  {data.driver.email}
                </div>
              </div>
            </div>

            {/* Registration Details */}
            <div className='flex flex-col gap-3 p-4 rounded-xl bg-muted/50 border border-border'>
              <h4 className='text-xs font-bold uppercase text-muted-foreground flex items-center gap-2'>
                <Calendar className='h-3 w-3' /> System Info
              </h4>
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Registered on</p>
                <p className='text-xs text-muted-foreground'>
                  {format(new Date(data.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <div className='pt-4 border-t border-border flex flex-col gap-4'>
            <h4 className='text-sm font-bold flex items-center gap-2'>
              <Info className='h-4 w-4 text-primary' /> Specifications
            </h4>
            <div className='grid grid-cols-3 gap-2'>
              <div className='p-3 bg-background border rounded-lg text-center'>
                <p className='text-[10px] uppercase text-muted-foreground mb-1'>
                  Status
                </p>
                <p className='text-xs font-bold text-emerald-600'>Active</p>
              </div>
              <div className='p-3 bg-background border rounded-lg text-center'>
                <p className='text-[10px] uppercase text-muted-foreground mb-1'>
                  Year
                </p>
                <p className='text-xs font-bold'>
                  {data.model.match(/\d{4}/)?.[0] || 'N/A'}
                </p>
              </div>
              <div className='p-3 bg-background border rounded-lg text-center'>
                <p className='text-[10px] uppercase text-muted-foreground mb-1'>
                  License
                </p>
                <p className='text-xs font-bold text-primary uppercase'>
                  Verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
