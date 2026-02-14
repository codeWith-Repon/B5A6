/* eslint-disable @typescript-eslint/no-explicit-any */
import { AvailableDriversSection } from '@/components/modules/HomePage/Ride/AvailableDriversSection';
import { BookingMapSection } from '@/components/modules/HomePage/Ride/BookingMapSection';
import { LocationInputSection } from '@/components/modules/HomePage/Ride/LocationInputSection';
import { useGetFreeDriversQuery } from '@/redux/features/driver/driver.api';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const GetRide = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const [pickupLocation, setPickupLocation] = useState(
    searchParams.get('pickup') || '',
  );
  const [dropLocation, setDropLocation] = useState(
    searchParams.get('drop') || '',
  );
  const [distance, setDistance] = useState(searchParams.get('distance') || '');
  const [time, setTime] = useState(searchParams.get('time') || '');

  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useGetFreeDriversQuery(undefined);



  useEffect(() => {
    const params: any = {};
    if (pickupLocation) params.pickup = pickupLocation;
    if (dropLocation) params.drop = dropLocation;
    if (distance) params.distance = distance;
    if (time) params.time = time;
    if (selectedDriver) params.driver = selectedDriver;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupLocation, dropLocation, distance, selectedDriver]);

  const onSubmit = async () => {
    const currentParams = searchParams.toString();
    const targetUrl = `/confirm-booking?${currentParams}`;

    navigate(targetUrl);
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
                onPickupChange={setPickupLocation}
                onDropChange={setDropLocation}
                onRouteUpdate={(dist, dur) => {
                  setDistance(dist);
                  setTime(dur);
                }}
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
                onSubmit={onSubmit}
                distance={distance}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetRide;
