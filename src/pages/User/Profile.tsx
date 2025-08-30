import { Card } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { role } from '@/constants/role';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import Spinner from '@/utils/spinner';
import { SquarePen } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Profile() {
  const navigate = useNavigate();
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);

  const isDriver = userInfo?.data?.role === role.driver;

  const { data: driverInfo } = useGetDriversQuery(
    {
      user: userInfo?.data?._id,
    },
    { skip: !isDriver }
  );

  console.log(driverInfo);

  if (isLoading) {
    return <Spinner />;
  }

  if (!userInfo?.success) {
    navigate('/login');
  }
  return (
    <Card className='w-full max-w-7xl mx-auto my-10 px-6'>
      <div>
        <div className='flex items-center justify-between border-b-2 border-dashed pb-3 mb-3'>
          <h1 className='text-2xl font-bold'>My Profile</h1>
          <SquarePen className='cursor-pointer' />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className=''>
            <Label htmlFor='name' className='text-lg text-muted-foreground'>
              Full Name
            </Label>
            <h3 className='text-lg font-medium mb-2'>{userInfo?.data?.name}</h3>
          </div>
          <div className=''>
            <Label htmlFor='email' className='text-lg text-muted-foreground'>
              Email
            </Label>
            <h3 className='text-lg font-medium mb-2'>
              {userInfo?.data?.email}
            </h3>
          </div>
          <div>
            <Label htmlFor='phone' className='text-lg text-muted-foreground'>
              Phone Number
            </Label>
            <h3 className='text-lg font-medium mb-2'>
              {userInfo?.data?.phone ? userInfo?.data?.phone : 'N/A'}
            </h3>
          </div>
          <div>
            <Label htmlFor='role' className='text-lg text-muted-foreground'>
              Role
            </Label>
            <h3 className='text-lg font-medium mb-2'>{userInfo?.data?.role}</h3>
          </div>
        </div>
      </div>
      <Separator className='w-full' />

      {userInfo?.data?.role === role.driver && (
        <>
          <div>
            <div className='flex items-center justify-between border-b-2 border-dashed pb-3 mb-3'>
              <h1 className='text-2xl font-bold'>Driver Information</h1>
              <SquarePen className='cursor-pointer' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className=''>
                <Label
                  htmlFor='licenseNumber'
                  className='text-lg text-muted-foreground'
                >
                  Driving License Number
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.licenseNumber}
                </h3>
              </div>
              <div>
                <Label
                  htmlFor='experience'
                  className='text-lg text-muted-foreground'
                >
                  Experience
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.experience} years
                </h3>
              </div>
              <div className=''>
                <Label
                  htmlFor='totalEarnings'
                  className='text-lg text-muted-foreground'
                >
                  Total Earnings
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.totalEarnings} BDT
                </h3>
              </div>
              <div>
                <Label
                  htmlFor='totalRides'
                  className='text-lg text-muted-foreground'
                >
                  Total Rides
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.totalRides}
                </h3>
              </div>
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between border-b-2 border-dashed pb-3 mb-3'>
              <h1 className='text-2xl font-bold'>Vehicle Information</h1>
              <SquarePen className='cursor-pointer' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className=''>
                <Label
                  htmlFor='vehicleLicenseNumber'
                  className='text-lg text-muted-foreground'
                >
                  Vehicle License Number
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.vehicle?.vehicleLicense}
                </h3>
              </div>
              <div>
                <Label
                  htmlFor='brand'
                  className='text-lg text-muted-foreground'
                >
                  Brand
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.vehicle?.brand}
                </h3>
              </div>
              <div className=''>
                <Label
                  htmlFor='vehicleType'
                  className='text-lg text-muted-foreground'
                >
                  Vehicle Type
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.vehicle?.vehicleType}
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
