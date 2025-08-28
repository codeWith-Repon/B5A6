/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import GetRide from './GetRide';

interface GetRideModalProps {
  isError?: boolean;
  rideData: any;
}

const GetRideModal = ({ isError, rideData }: GetRideModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {(isError || !rideData) && (
        <DialogTrigger asChild>
          <Button variant='outline' className='cursor-pointer'>
            Book Ride
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Book a Ride</DialogTitle>
          <DialogDescription className='sr-only'>
            Fill in your ride details to request a driver.
          </DialogDescription>
        </DialogHeader>
        <GetRide />
      </DialogContent>
    </Dialog>
  );
};

export default GetRideModal;
