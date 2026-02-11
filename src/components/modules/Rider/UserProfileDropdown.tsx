import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, History, LogOut, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/redux/hook';
import {
  authApi,
  useLogOutMutation,
  useUserInfoQuery,
} from '@/redux/features/auth/auth.api';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfileDropdown() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: userInfo } = useUserInfoQuery(undefined);
  const [logOut] = useLogOutMutation();

  const handleLogout = async () => {
    try {
      await logOut(undefined);
      await dispatch(authApi.util.resetApiState());
      toast.success('Logout successful');
    } catch (error) {
      console.error(error);
      toast.error('Logout failed');
    }
  };

  const avatarName = userInfo?.data?.name
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase();

  const user = userInfo?.data;

  console.log(userInfo, 'user in fo lfsa');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='w-10 h-10 cursor-pointer'>
            <AvatarImage src={user.image} />
            <AvatarFallback className='rounded-full w-10 h-10 p-0 bg-linear-to-br from-primary to-secondary'>
              {avatarName}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-56' align='end'>
          {/* User info */}
          <div className='p-4 border-b border-border'>
            <div className='flex items-center gap-3'>
              <Avatar className='w-10 h-10 cursor-pointer'>
                <AvatarImage src={user.image} />
                <AvatarFallback className='rounded-full w-10 h-10 p-0 bg-linear-to-br from-primary to-secondary'>
                  {avatarName}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-foreground truncate'>
                  {user.name}
                </p>
                <p className='text-xs text-foreground/60 truncate'>
                  {user.email}
                </p>
              </div>
            </div>

            {/* User stats */}
            <div className='mt-3 grid grid-cols-2 gap-2'>
              <div className='bg-muted rounded p-2 text-center'>
                <p className='text-xs text-foreground/60'>Rating</p>
                <div className='flex items-center justify-center gap-1 mt-1'>
                  <Star className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400' />
                  <p className='text-sm font-semibold'>{user.rating ?? 4.2}</p>
                </div>
              </div>
              <div className='bg-muted rounded p-2 text-center'>
                <p className='text-xs text-foreground/60'>Total Rides</p>
                <p className='text-sm font-semibold mt-1'>
                  {user.totalRides ?? 8}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <DropdownMenuItem
            onClick={() => {
              navigate(`/profile`);
            }}
            className='gap-2 cursor-pointer'
          >
            <User className='w-4 h-4' />
            <span>View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate('/ride-history')}
            className='gap-2 cursor-pointer'
          >
            <History className='w-4 h-4' />
            <span>Ride History</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className='gap-2 cursor-pointer text-red-600'>
            <div className='flex gap-2 items-center' onClick={handleLogout}>
              <LogOut className='w-4 h-4' />
              <span>Logout</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
