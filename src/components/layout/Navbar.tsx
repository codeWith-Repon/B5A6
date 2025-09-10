import Logo from '@/assets/icon/Logo';
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
import { Link } from 'react-router';
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
import GetRide from '../modules/Rider/GetRide';
import AvatarComponent from '../modules/Rider/avater';

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/', label: 'Home', role: 'PUBLIC' },
  { href: '/about', label: 'About', role: 'PUBLIC' },
  { href: '/faq', label: 'Faq', role: 'PUBLIC' },
  { href: '/contact', label: 'Contact', role: 'PUBLIC' },
  { href: '/admin', label: 'Dashboard', role: role.admin },
  { href: '/rider', label: 'Dashboard', role: role.rider },
  { href: '/admin', label: 'Dashboard', role: role.superAdmin },
  { href: '/driver', label: 'Dashboard', role: role.driver },
];

export default function Navbar() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const [logOut] = useLogOutMutation();
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    logOut(undefined);
    dispatch(authApi.util.resetApiState());
    toast.success('Logout successful');
  };
  console.log(userInfo, 'userinfo')

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`border-b px-4 md:px-6 transition-all duration-500 top-0 z-40 bg-background  w-full ${
        isSticky ? 'sticky bg-background/80 backdrop-blur-md shadow-sm' : ''
      }`}
    >
      <div>
        <div className='flex h-16 items-center justify-between gap-4 mx-auto container max-w-[1370px]'>
          {/* Left side */}
          <div className='flex items-center gap-2'>
            {/* Main nav */}
            <div className='flex items-center gap-6'>
              <Link to='/' className='text-primary hover:text-primary/90'>
                <Logo />
              </Link>
              {/* Navigation menu */}
              <NavigationMenu className='max-md:hidden'>
                <NavigationMenuList className='gap-2 flex-wrap md:flex-nowrap'>
                  {navigationLinks.map((link) => {
                    if (
                      link.role === 'PUBLIC' ||
                      link.role === userInfo?.data?.role
                    ) {
                      return (
                        <NavigationMenuItem key={link.href}>
                          <NavigationMenuLink
                            asChild
                            className='text-muted-foreground hover:text-primary py-1.5 font-medium'
                          >
                            <Link to={link.href}>{link.label}</Link>
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
            <ModeToggle />
            <div className='hidden md:block'>
              {userInfo?.success ? (
                <AvatarComponent
                  
                />
              ) : (
                <Button asChild size='sm' className='text-sm'>
                  <Link to={'/login'}>Log In</Link>
                </Button>
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
                      className='origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]'
                    />
                    <path
                      d='M4 12H20'
                      className='origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45'
                    />
                    <path
                      d='M4 12H20'
                      className='origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]'
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='w-36 p-1 md:hidden'>
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
                            <GetRide />
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
