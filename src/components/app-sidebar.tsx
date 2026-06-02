import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Link, NavLink } from 'react-router';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { getSidebarItems } from '@/utils/getSidebarItems';
import DriverStatusToggler from './modules/Driver/DriverStatusToggler';
import Sos from './modules/Driver/Sos';
import { role } from '@/constants/role';
import { Car } from 'lucide-react';
import { UserProfileDropdown } from './modules/Rider/UserProfileDropdown';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const data = {
    navMain: getSidebarItems(userData?.data?.role),
  };

  return (
    <Sidebar {...props} className='glass-strong border-r border-border/40'>
      <SidebarContent className='mt-4 gap-0'>
        <div className='border-b border-border/40 pb-4 px-4'>
          <Link
            to='/'
            className='group flex items-center gap-2 transition-opacity hover:opacity-90'
          >
            <div className='p-2 rounded-xl gradient-brand text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow'>
              <Car className='w-5 h-5' />
            </div>
            <span className='font-extrabold text-lg gradient-brand-text'>
              RideFlow
            </span>
          </Link>
        </div>
        <div className='py-2'>
          <div className='mb-3 px-3'>
            <div className='flex items-center gap-3 px-4 py-2.5 rounded-xl glass-subtle border border-primary/20'>
              <div className='relative'>
                <div className='w-2 h-2 rounded-full bg-emerald-400' />
                <div className='absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping' />
              </div>
              <span className='text-[10px] font-bold uppercase tracking-widest text-foreground/80'>
                {userData?.data?.role ?? 'GUEST'}
              </span>
            </div>
          </div>

          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel className='mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70'>
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className='space-y-1'>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className='px-0'>
                          {({ isActive }) => (
                            <div
                              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 w-full overflow-hidden ${
                                isActive
                                  ? 'gradient-brand-soft text-foreground border border-primary/30 shadow-md shadow-primary/10'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
                              }`}
                            >
                              {isActive && (
                                <div className='absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full gradient-brand' />
                              )}
                              <span className='text-sm font-medium'>
                                {item.title}
                              </span>

                              {isActive && (
                                <div className='ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow' />
                              )}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>
      <div className='flex flex-col gap-2 p-3 border-t border-border/40'>
        {userData?.data?.role === role.driver && (
          <>
            <Sos />
            <DriverStatusToggler userData={userData} loading={isLoading} />
          </>
        )}
        <div className='flex items-center gap-3 px-3 py-2 rounded-xl glass-subtle border border-border/40'>
          <UserProfileDropdown />
          <span className='text-sm font-medium text-foreground/80'>
            Profile
          </span>
        </div>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
