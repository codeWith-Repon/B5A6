import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationInputSectionProps {
  pickupLocation: string;
  dropLocation: string;
  onPickupChange: (location: string) => void;
  onDropChange: (location: string) => void;
}

export function LocationInputSection({
  pickupLocation,
  dropLocation,
  onPickupChange,
  onDropChange,
}: LocationInputSectionProps) {
  const [isPickupFocused, setIsPickupFocused] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const swapLocations = () => {
    const temp = pickupLocation;
    onPickupChange(dropLocation);
    onDropChange(temp);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    console.log('Fetching location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Coordinates found:', latitude, longitude);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;

          onPickupChange(address);
          setIsPickupFocused(false);
        } catch (error) {
          console.error('Reverse Geocoding Error:', error);
          onPickupChange(`${latitude}, ${longitude}`);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error('Geolocation Permission Denied/Error:', error);
        alert('Please enable location permissions in your browser.');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center'>
        <h2 className='text-2xl font-bold text-foreground'>
          Where are you going?
        </h2>
      </div>

      {/* Location inputs card */}
      <div className='bg-card border border-border rounded-2xl p-6 space-y-3'>
        {/* Pickup Location */}
        <div className='space-y-2'>
          <label className='block text-sm font-semibold text-foreground'>
            Pickup Location
          </label>
          <div className='relative'>
            <div className='flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background'>
              <MapPin className='w-5 h-5 text-primary shrink-0' />
              <input
                type='text'
                placeholder={
                  isLoadingLocation
                    ? 'Locating you...'
                    : 'Enter pickup location...'
                }
                value={
                  isLoadingLocation
                    ? 'Fetching current location...'
                    : pickupLocation
                }
                readOnly={isLoadingLocation}
                onChange={(e) => onPickupChange(e.target.value)}
                onFocus={() => setIsPickupFocused(true)}
                onBlur={() => setIsPickupFocused(false)}
                className='flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/50'
              />
            </div>

            {/* Suggestions dropdown for pickup */}
            {isPickupFocused && (
              <div className='absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10'>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleUseCurrentLocation();
                  }}
                  className='w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 cursor-pointer'
                >
                  <Navigation className='w-4 h-4 text-primary' />
                  <span className='text-sm font-medium'>
                    Use Current Location
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Swap button */}
        <div className='flex justify-center'>
          <button
            onClick={swapLocations}
            className='p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer'
            title='Swap locations'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
              />
            </svg>
          </button>
        </div>

        {/* Drop Location */}
        <div className='space-y-2'>
          <label className='block text-sm font-semibold text-foreground'>
            Drop Location
          </label>
          <div className='relative'>
            <div className='flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background'>
              <MapPin className='w-5 h-5 text-primary/50 shrink-0' />
              <input
                type='text'
                placeholder='Enter drop location or click on map'
                value={dropLocation}
                onChange={(e) => onDropChange(e.target.value)}
                className='flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/50'
              />
            </div>
          </div>
        </div>

        {/* Info text */}
        {(!pickupLocation || !dropLocation) && (
          <div className='bg-primary/5 border border-primary/20 rounded-lg p-3'>
            <p className='text-sm text-foreground/70'>
              💡 Tip: Click on the map to set your pickup and drop locations, or
              type them in manually.
            </p>
          </div>
        )}

        {pickupLocation && dropLocation && (
          <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-3'>
            <p className='text-sm text-green-700 dark:text-green-400'>
              ✓ Both locations set. Scroll down to see available drivers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
