import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link, useLocation } from 'react-router';
import { ModeToggle } from './ModeToggler';
import { useEffect, useState } from 'react';
import {
  authApi,
  useLogOutMutation,
  useUserInfoQuery,
} from '@/redux/features/auth/auth.api';
import { toast } from 'sonner';
import { useAppDispatch } from '@/redux/hook';
import { role } from '@/constants/role';
import { UserProfileDropdown } from '../modules/Rider/UserProfileDropdown';
import { Car } from 'lucide-react';
import Loader from '../shared/Loader';
import { NotificationDropdown } from '../modules/HomePage/NotificationDropdown';
import { tokenStorage } from '@/lib/tokenStorage';
import { rideSocket } from '@/lib/socket';

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/', label: 'Home', role: 'PUBLIC' },
  { href: '#services', label: 'Services', role: 'PUBLIC' },
  { href: '#features', label: 'Features', role: 'PUBLIC' },
  { href: '/about', label: 'About', role: 'PUBLIC' },
  { href: '#faq', label: 'Faq', role: 'PUBLIC' },
  { href: '/contact', label: 'Contact', role: 'PUBLIC' },
  { href: '/admin', label: 'Dashboard', role: role.admin },
  { href: '/admin', label: 'Dashboard', role: role.superAdmin },
];

export default function Navbar() {
  const { data: userInfo, isLoading, isFetching } = useUserInfoQuery(undefined);
  const [logOut] = useLogOutMutation();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { hash, pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logOut(undefined);
      tokenStorage.clear();
      rideSocket.close();
      await dispatch(authApi.util.resetApiState());
      toast.success('Logout successful');
    } catch (error) {
      console.error(error);
      toast.error('Logout failed');
    }
  };
  // console.log(userInfo, 'userinfo');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  if (isLoading || isFetching)
    return <Loader fullPage={true} text='Initializing System...' />;

  return (
    <header
      className={`sticky top-0 z-40 px-4 md:px-6 w-full bg-background border-b border-border transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div>
        <div className='flex h-14 items-center justify-between gap-4 mx-auto container max-w-342.5'>
          {/* Left side */}
          <div className='flex items-center gap-2'>
            {/* Main nav */}
            <div className='flex items-center gap-8'>
              <Link
                to='/'
                className='group flex items-center gap-2 transition-opacity hover:opacity-90'
              >
                <div className='p-1.5 rounded-md bg-primary text-primary-foreground'>
                  <Car className='w-4 h-4' />
                </div>
                <span className='font-semibold text-base tracking-tight text-foreground'>
                  RideFlow
                </span>
              </Link>
              {/* Navigation menu */}
              <NavigationMenu className='max-md:hidden'>
                <NavigationMenuList className='gap-2 flex-wrap md:flex-nowrap'>
                  {navigationLinks.map((link) => {
                    const isHashLink = link.href.startsWith('#');
                    const navigateLink = isHashLink
                      ? `/${link.href}`
                      : link.href;

                    if (
                      link.role === 'PUBLIC' ||
                      link.role === userInfo?.data?.role
                    ) {
                      return (
                        <NavigationMenuItem key={link.href}>
                          <NavigationMenuLink
                            asChild
                            className='text-sm text-muted-foreground hover:text-foreground py-1.5 px-2 font-medium transition-colors'
                          >
                            <Link to={navigateLink}>{link.label}</Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      );
                    }
                    return null;
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {/* Right side */}
          <div className='flex items-center gap-2'>
            <div className='hidden md:block'>
              <ModeToggle />
            </div>
            <div className='flex items-center gap-2'>
              {userInfo?.success ? (
                <>
                  <NotificationDropdown />
                  <UserProfileDropdown />
                </>
              ) : (
                <>
                  <Button asChild size='sm' className='text-sm'>
                    <Link to={'/login'}>Log In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className='group size-8 md:hidden'
                  variant='outline'
                  size='icon'
                >
                  <svg
                    className='pointer-events-none'
                    width={16}
                    height={16}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M4 12L20 12'
                      className='origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315'
                    />
                    <path
                      d='M4 12H20'
                      className='origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45'
                    />
                    <path
                      d='M4 12H20'
                      className='origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135'
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='w-44 p-2 md:hidden border-border rounded-lg'>
                <NavigationMenu className='max-w-none *:w-full'>
                  <NavigationMenuList className='flex-col items-start gap-0 md:gap-2'>
                    {navigationLinks.map((link, index) => (
                      <div key={index}>
                        {link.role === 'PUBLIC' && (
                          <NavigationMenuItem key={index}>
                            <NavigationMenuLink
                              asChild
                              className='text-muted-foreground hover:text-primary py-1.5 font-medium'
                            >
                              <Link to={link.href}>{link.label}</Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        )}
                        {link.role === userInfo?.data?.role && (
                          <NavigationMenuItem key={index}>
                            <NavigationMenuLink
                              asChild
                              className='text-muted-foreground hover:text-primary py-1.5 font-medium'
                            >
                              <Link to={link.href}>{link.label}</Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        )}
                      </div>
                    ))}
                    {userInfo?.success &&
                      userInfo?.data?.role !== 'DRIVER' &&
                      userInfo?.data?.role !== 'ADMIN' &&
                      userInfo?.data?.role !== 'SUPER_ADMIN' && (
                        <NavigationMenuItem>
                          <NavigationMenuLink className='text-muted-foreground hover:text-primary py-1.5 font-medium cursor-pointer'>
                            {/* Get ride */}
                            <Link to='/get-ride'>Get Ride</Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )}

                    <div className='ml-1 my-2'>
                      {userInfo?.data?.email ? (
                        <Button
                          onClick={handleLogout}
                          size='sm'
                          className='text-sm'
                          variant='outline'
                        >
                          Log Out
                        </Button>
                      ) : (
                        <Button asChild size='sm' className='text-sm'>
                          <Link to={'/login'}>Log In</Link>
                        </Button>
                      )}
                    </div>
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
