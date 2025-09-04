import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  authApi,
  useLogOutMutation,
  useUserInfoQuery,
} from '@/redux/features/auth/auth.api';
import { useAppDispatch } from '@/redux/hook';
import { BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AvatarComponent() {
  const navigate = useNavigate();
  const [logOut] = useLogOutMutation();
  const dispatch = useAppDispatch();

  const { data: userInfo } = useUserInfoQuery(undefined);

  const handleLogout = () => {
    logOut(undefined);
    dispatch(authApi.util.resetApiState());
    toast.success('Logout successful');
  };

  const avatarName = userInfo?.data?.name
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='w-10 h-10 cursor-pointer'>
          <AvatarImage src={userInfo?.data?.image} />
          <AvatarFallback className='bg-primary'>{avatarName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[300px] mt-[10px] flex flex-col items-center justify-center'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup className='w-full'>
          <div className='flex justify-center my-2'>
            <Avatar className='w-[90px] h-[90px]'>
              <AvatarImage src={userInfo?.data?.image} />
              <AvatarFallback>
                <img src='/image.png' alt='User Avatar' />
              </AvatarFallback>
            </Avatar>
          </div>
          <DropdownMenuItem className='cursor-pointer'>
            <Button
              className='cursor-pointer flex items-center gap-1 w-full'
              onClick={() => {
                navigate(`/profile`);
              }}
            >
              <BadgeCheck className='text-white' />
              <span>Account</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              onClick={handleLogout}
              size='sm'
              className='text-sm cursor-pointer w-full'
              variant='outline'
            >
              Log Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
