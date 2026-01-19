/* eslint-disable @typescript-eslint/no-explicit-any */
import { AvailableDriversSection } from '@/components/modules/HomePage/Ride/AvailableDriversSection';
import { BookingMapSection } from '@/components/modules/HomePage/Ride/BookingMapSection';
import { LocationInputSection } from '@/components/modules/HomePage/Ride/LocationInputSection';
import { useGetFreeDriversQuery } from '@/redux/features/driver/driver.api';
import { useBookRideMutation } from '@/redux/features/Rider/rider.api';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const GetRide = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useGetFreeDriversQuery(undefined);

  const [bookRide, { isLoading: bookRideLoading }] = useBookRideMutation();

  const onSubmit = async (data: string) => {
    const bookingData = {
      pickupLocation,
      dropLocation,
      driver: data,
    };
    try {
      await bookRide(bookingData);
      toast.success('Ride Request Sent Successfully');
      navigate('/rider/current-ride');
    } catch (error: any) {
      toast.error(error?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='py-8'>
        <div className='container mx-auto px-4 max-w-342.5'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>Get a ride</h1>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left side - Location inputs and map */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Location Inputs */}
              <LocationInputSection
                pickupLocation={pickupLocation}
                dropLocation={dropLocation}
                onPickupChange={setPickupLocation}
                onDropChange={setDropLocation}
              />

              {/* Map Section */}
              <BookingMapSection
                pickupLocation={pickupLocation}
                dropLocation={dropLocation}
              />
            </div>

            {/* Right side - Available Drivers */}
            <div>
              <AvailableDriversSection
                drivers={data || []}
                selectedDriver={selectedDriver}
                onSelectDriver={setSelectedDriver}
                pickupLocation={pickupLocation}
                dropLocation={dropLocation}
                isLoading={isLoading}
                onSubmitLoading={bookRideLoading}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetRide;
