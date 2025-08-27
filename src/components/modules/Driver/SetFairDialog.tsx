import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateRideStatusMutation } from '@/redux/features/Rider/rider.api';
import { useState } from 'react';
import { toast } from 'sonner';

export function SetFairDialog() {
  const [updateRideStatus] = useUpdateRideStatusMutation();
  const [Fare, setFare] = useState('');

  const handleSetFair = async () => {
    try {
      const fare = {
        fare: Number(Fare),
      };
      await updateRideStatus(fare).unwrap();
      toast.success('Fare set successfully');
    } catch (error) {
      toast.error('Failed to set fare');
      console.log(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='cursor-pointer'>
          Set Fair
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Set Fair</DialogTitle>
          <DialogDescription className='sr-only'>
            Set your fair.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center gap-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='fair' className='sr-only'>
              fair
            </Label>
            <Input
              id='fair'
              type='number'
              value={Fare}
              onChange={(e) => setFare(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button
              className='cursor-pointer'
              type='button'
              variant='secondary'
              onClick={handleSetFair}
            >
              Set
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
