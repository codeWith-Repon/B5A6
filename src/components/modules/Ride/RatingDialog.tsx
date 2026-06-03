import { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRateRideMutation } from '@/redux/features/Rider/rider.api';
import { cn } from '@/lib/utils';

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  rideId: string;
  driverName?: string;
}

export function RatingDialog({
  open,
  onOpenChange,
  rideId,
  driverName,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [rateRide, { isLoading }] = useRateRideMutation();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Tap a star first');
      return;
    }
    try {
      await rateRide({
        rideId,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();
      toast.success('Thanks for the feedback');
      onOpenChange(false);
      setRating(0);
      setComment('');
    } catch (e) {
      const err = e as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Could not save rating');
    }
  };

  const display = hover || rating;
  const helperText =
    display === 0
      ? 'Tap a star to rate this ride'
      : display === 1
      ? 'Poor — what went wrong?'
      : display === 2
      ? 'Below expectations'
      : display === 3
      ? 'It was fine'
      : display === 4
      ? 'Good ride'
      : 'Excellent — thanks for sharing!';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your ride</DialogTitle>
          <DialogDescription>
            {driverName
              ? `Help other riders know what to expect from ${driverName}.`
              : 'Help other riders know what to expect.'}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center gap-2 py-2'>
          <div className='flex items-center gap-1'>
            {[1, 2, 3, 4, 5].map((n) => {
              const active = display >= n;
              return (
                <button
                  key={n}
                  type='button'
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className='p-1 transition-transform hover:scale-110'
                  aria-label={`Rate ${n} ${n === 1 ? 'star' : 'stars'}`}
                >
                  <Star
                    className={cn(
                      'w-9 h-9 transition-colors',
                      active
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
              );
            })}
          </div>
          <p className='text-sm text-muted-foreground'>{helperText}</p>
        </div>

        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Anything you want to add? (optional)'
          maxLength={500}
          rows={3}
        />

        <DialogFooter>
          <Button
            type='button'
            variant='ghost'
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
          <Button
            type='button'
            className='gap-2'
            onClick={handleSubmit}
            disabled={isLoading || rating === 0}
          >
            {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
            Submit rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
