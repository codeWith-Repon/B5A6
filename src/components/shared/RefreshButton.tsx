import { RefreshCcw } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { useLocation, useNavigate } from 'react-router';

interface RefreshButtonProps {
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showLabel?: boolean;
}

const RefreshButton = ({
  size = 'default',
  variant = 'default',
  showLabel = true,
}: RefreshButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      // re-navigate to same path + search → acts like refresh
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
      });
    });
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleRefresh}
      disabled={isPending}
      className='cursor-pointer'
    >
      <RefreshCcw
        className={`h-4 w-4 ${isPending ? 'animate-spin' : ''} ${
          showLabel ? 'mr-2' : ''
        }`}
      />
      {showLabel && 'Refresh'}
    </Button>
  );
};

export default RefreshButton;
