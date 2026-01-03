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
import AvatarComponent from './modules/Rider/avater';
import DriverStatusToggler from './modules/Driver/DriverStatusToggler';
import Sos from './modules/Driver/Sos';
import { role } from '@/constants/role';
import { Car } from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const data = {
    navMain: getSidebarItems(userData?.data?.role),
  };

  return (
    <Sidebar {...props}>
      <SidebarContent className='mt-4'>
        <div className='border-b pb-[11px]'>
          <Link
            to='/'
            className='text-primary hover:text-primary/90 flex items-center gap-1 px-4'
          >
            <div className='p-2 rounded-lg bg-primary text-primary-foreground'>
              <Car className='w-5 h-5' />
            </div>
            <span className='font-bold text-lg dark:text-white'>RideFlow</span>
          </Link>
        </div>
        <div className=''>
          <div className='mb-2 px-3'>
            <div className='flex items-center gap-3 px-4 py-3 rounded-lg text-blue-400 border border-blue-500/20'>
              <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
              <span className='text-xs font-semibold  uppercase'>
                {userData?.data?.role}
              </span>
            </div>
          </div>

          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel className='mb-1'>
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className='space-y-2'>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className="px-0">
                          {({ isActive }) => (
                            <div
                              className={`flex items-center gap-3 px-4 py-5 rounded-lg transition-all duration-200 w-full ${
                                isActive
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'text-slate-400 '
                              }`}
                            >
                              <span className='text-sm font-medium'>
                                {item.title}
                              </span>

                              {isActive && (
                                <div className='ml-auto w-2 h-2 rounded-full bg-blue-400' />
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
      <div className='flex flex-col gap-1'>
        {userData?.data?.role === role.driver && (
          <>
            <Sos />
            <DriverStatusToggler userData={userData} loading={isLoading} />
          </>
        )}
        <div className='flex items-center gap-4 px-4 mb-4 py-2 border'>
          <AvatarComponent />
          <span>Profile</span>
        </div>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
