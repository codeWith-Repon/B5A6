import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import GetRide from './GetRide';
import { Button } from '@/components/ui/button';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useNavigate } from 'react-router';

const GetRideModal = () => {
  const { data } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (!data?.success) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='lg'
          onClick={handleClick}
          className='border bg-primary border-primary text-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer'
        >
          Get Ride
        </Button>
      </DialogTrigger>
      <GetRide />
    </Dialog>
  );
};

export default GetRideModal;
