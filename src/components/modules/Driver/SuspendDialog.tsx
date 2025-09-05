import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { useNavigate } from 'react-router';

export function SuspendDialog({ open }: { open: boolean }) {
  const navigate = useNavigate();

  const handleSupportClick = () => {
    navigate('/support');
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Account Suspended</AlertDialogTitle>
          <AlertDialogDescription>
            Your driver account has been suspended. Please contact support to
            resolve this issue before you can continue using the service.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button className='cursor-pointer' onClick={handleSupportClick}>
              {' '}
              Contact Support
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
