import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { driverStatus } from '@/constants/driverStatus';
import { role } from '@/constants/role';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import { Outlet } from 'react-router';
import { SuspendDialog } from '../modules/Driver/SuspendDialog';
import { PendingDialog } from '../modules/Driver/PendingDialog';

const DashboardLayout = () => {
  const { data: userInfo } = useUserInfoQuery(undefined);

  const isDriver = userInfo?.data?.role === role.driver;

  const { data: driver } = useGetDriversQuery(
    { user: userInfo?.data?._id },
    {
      skip: !isDriver,
    }
  );

  const isSuspended =
    isDriver && driver?.data?.[0]?.status === driverStatus.suspended;
  const isPending =
    isDriver && driver?.data?.[0]?.status === driverStatus.pending;


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 bg-background border-b border-border px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 md:p-6'>
          {isSuspended ? (
            <SuspendDialog open={isSuspended} />
          ) : isPending ? (
            <PendingDialog open={isPending} />
          ) : (
            <Outlet />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
