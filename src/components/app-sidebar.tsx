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
import { Link } from 'react-router';
import Logo from '@/assets/icon/Logo';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { getSidebarItems } from '@/utils/getSidebarItems';
import AvatarComponent from './modules/Rider/avater';
import DriverStatusToggler from './modules/Driver/DriverStatusToggler';
import Sos from './modules/Driver/Sos';
import { role } from '@/constants/role';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const data = {
    navMain: getSidebarItems(userData?.data?.role),
  };
  return (
    <Sidebar {...props}>
      <SidebarContent className='mt-4'>
        <div className='ml-3'>
          <Link to={'/'}>
            <Logo />
          </Link>
        </div>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
