import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, History, LogOut, Star, ChevronRight } from 'lucide-react';
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

  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);
  const [logOut] = useLogOutMutation();

  const handleLogout = async () => {
    try {
      await logOut(undefined).unwrap();
      await dispatch(authApi.util.resetApiState());
      toast.success('Logout successful');
      navigate('/login');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error('Logout failed');
    }
  };

  const user = userInfo?.data;

  // Loading state handling to prevent crashes
  if (isLoading || !user) {
    return <div className='w-10 h-10 rounded-full bg-muted animate-pulse' />;
  }

  const avatarName = user?.name
    ?.split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='relative group focus:outline-none'>
          <div className='absolute -inset-0.5 bg-linear-to-r from-primary to-secondary rounded-full opacity-30 group-hover:opacity-100 transition duration-300 blur-[2px]'></div>
          <Avatar className='w-10 h-10 cursor-pointer border-2 border-background relative'>
            <AvatarImage src={user.image} className='object-cover' />
            <AvatarFallback className='bg-primary text-white font-bold text-xs'>
              {avatarName}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-72 mt-2 p-2 rounded-[20px] shadow-2xl border-border/50'
        align='end'
      >
        {/* User Info Section with subtle background */}
        <div className='p-4 mb-2 rounded-xl bg-muted/30 border border-border/40'>
          <div className='flex items-center gap-3'>
            <Avatar className='w-12 h-12 border-2 border-background shadow-sm'>
              <AvatarImage src={user.image} />
              <AvatarFallback className='bg-primary text-white font-black text-sm'>
                {avatarName}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <p className='font-black text-foreground text-sm uppercase italic tracking-tighter truncate'>
                {user.name}
              </p>
              <p className='text-[11px] text-muted-foreground truncate font-medium'>
                {user.email}
              </p>
            </div>
          </div>

          <div className='mt-4 flex gap-2'>
            <div className='flex-1 bg-background rounded-lg p-2 border border-border/50 flex flex-col items-center justify-center shadow-sm'>
              <span className='text-[9px] font-black uppercase text-muted-foreground tracking-widest'>
                Rating
              </span>
              <div className='flex items-center gap-1 mt-0.5'>
                <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                <span className='text-xs font-bold'>
                  {user.rating ?? '4.2'}
                </span>
              </div>
            </div>
            <div className='flex-1 bg-background rounded-lg p-2 border border-border/50 flex flex-col items-center justify-center shadow-sm'>
              <span className='text-[9px] font-black uppercase text-muted-foreground tracking-widest'>
                Trips
              </span>
              <span className='text-xs font-bold mt-0.5'>
                {user.totalRides ?? '12'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className='space-y-1'>
          <DropdownMenuItem
            onClick={() => navigate(`/profile`)}
            className='flex items-center justify-between py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/5 group'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10 text-primary group-focus:bg-primary group-focus:text-white transition-colors duration-200'>
                <User className='w-4 h-4 group-focus:text-white' />
              </div>
              <span className='font-bold text-sm'>My Account</span>
            </div>
            <ChevronRight className='w-4 h-4 text-muted-foreground opacity-50' />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate('/ride-history')}
            className='flex items-center justify-between py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/5 group'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10 text-primary group-focus:bg-primary group-focus:text-white transition-colors'>
                <History className='w-4 h-4 group-focus:text-white' />
              </div>
              <span className='font-bold text-sm'>Ride History</span>
            </div>
            <ChevronRight className='w-4 h-4 text-muted-foreground opacity-50' />
          </DropdownMenuItem>

          <DropdownMenuSeparator className='my-2 bg-border/40' />

          <DropdownMenuItem
            onClick={handleLogout}
            className='flex items-center  py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/5 group'
          >
            <div className='p-2 rounded-lg bg-primary/10 text-primary group-focus:bg-primary group-focus:text-white transition-colors'>
              <LogOut className='w-4 h-4 group-focus:text-white' />
            </div>
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
