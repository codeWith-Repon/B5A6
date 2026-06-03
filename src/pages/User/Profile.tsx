import EditDriverInfoDialog from '@/components/modules/UpdateProfile/EditDriverInfo';
import EditProfileDialog from '@/components/modules/UpdateProfile/EditProfileDialog';
import EditVehicleInfo from '@/components/modules/UpdateProfile/EditVehicleInfo';
import { SecuritySection } from '@/components/modules/UpdateProfile/SecuritySection';
import { Card } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { role } from '@/constants/role';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import Spinner from '@/utils/spinner';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function Profile() {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const navigate = useNavigate();
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);

  const isDriver = userInfo?.data?.role === role.driver;

  const { data: driverInfo } = useGetDriversQuery(
    {
      user: userInfo?.data?._id,
    },
    { skip: !isDriver }
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (!userInfo?.success) {
    navigate('/login');
  }
  // console.log(driverInfo);

  return (
    <Card className='w-full max-w-7xl mx-auto my-10 px-6 py-8'>
      <EditProfileDialog
        open={openProfileDialog}
        setOpen={setOpenProfileDialog}
        userInfo={userInfo}
      />
      <div>
        <div className='flex items-center justify-between border-b border-border/40 pb-3 mb-4'>
          <h1 className='text-2xl font-extrabold tracking-tight gradient-brand-text'>My Profile</h1>
          <SquarePen
            className='cursor-pointer'
            onClick={() => setOpenProfileDialog(true)}
          />
        </div>
        <div className='grid grid-cols-12 mb-4'>
          <div className='col-span-4 rounded-md overflow-hidden'>
            <h3 className='text-lg font-medium mb-2'>
              <span
                className={
                  userInfo?.data?.image?.length === 0 ? 'text-red-500' : ''
                }
              >
                Profile Picture
              </span>{' '}
              {userInfo?.data?.image?.length === 0 ? 'N/A' : ''}
            </h3>
            <img
              src={userInfo?.data?.image}
              className='w-full rounded-md'
              alt=''
            />
          </div>
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
            <h3 className='text-lg font-medium mb-2 break-words whitespace-normal'>
              {userInfo?.data?.email}
            </h3>
          </div>
          <div>
            <Label htmlFor='address' className='text-lg text-muted-foreground'>
              Address
            </Label>
            <h3 className='text-lg font-medium mb-2'>
              {userInfo?.data?.address ? userInfo?.data?.address : 'N/A'}
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
            <div className='flex items-center justify-between border-b border-border/40 pb-3 mb-4'>
              <h1 className='text-2xl font-extrabold tracking-tight gradient-brand-text'>Driver Information</h1>
              <SquarePen
                className='cursor-pointer'
                onClick={() => setOpenDriverDialog(true)}
              />
            </div>
            <EditDriverInfoDialog
              open={openDriverDialog}
              setOpen={setOpenDriverDialog}
              driverInfo={driverInfo}
            />
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
            <div className='flex items-center justify-between border-b border-border/40 pb-3 mb-4'>
              <h1 className='text-2xl font-extrabold tracking-tight gradient-brand-text'>Vehicle Information</h1>
              <SquarePen
                className='cursor-pointer'
                onClick={() => setOpenVehicleDialog(true)}
              />
            </div>
            <EditVehicleInfo
              open={openVehicleDialog}
              setOpen={setOpenVehicleDialog}
              vehicleInfo={driverInfo}
            />
            <div className='mb-4'>
              <div className=' rounded-md overflow-hidden'>
                <h3 className='text-lg font-medium mb-2'>Vehicle Images</h3>
                <div className='grid grid-cols-4 gap-3'>
                  {driverInfo?.data[0]?.vehicle?.images &&
                  driverInfo?.data[0]?.vehicle?.images.length > 0 ? (
                    driverInfo?.data[0]?.vehicle?.images?.map((image) => (
                      <img
                        key={image}
                        src={image}
                        className='w-full rounded-md'
                        alt=''
                      />
                    ))
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
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
              <div>
                <Label
                  htmlFor='model'
                  className='text-lg text-muted-foreground'
                >
                  Model
                </Label>
                <h3 className='text-lg font-medium mb-2'>
                  {driverInfo?.data[0]?.vehicle?.model}
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

      <Separator className='w-full' />
      <SecuritySection />
    </Card>
  );
}
