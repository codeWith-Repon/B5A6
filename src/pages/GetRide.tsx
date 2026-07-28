/* eslint-disable @typescript-eslint/no-explicit-any */
import { AvailableDriversSection } from '@/components/modules/HomePage/Ride/AvailableDriversSection';
import { BookingMapSection } from '@/components/modules/HomePage/Ride/BookingMapSection';
import { LocationInputSection } from '@/components/modules/HomePage/Ride/LocationInputSection';
import { Button } from '@/components/ui/button';
import { useGetFreeDriversQuery } from '@/redux/features/driver/driver.api';
import { ArrowRight, Clock, Loader2, Route, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import config from '@/config';

const GetRide = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pickupLocation, setPickupLocation] = useState(
    searchParams.get('pickup') || ''
  );
  const [dropLocation, setDropLocation] = useState(
    searchParams.get('drop') || ''
  );
  // Exact coords for the current pickup/drop text when known (autocomplete pick,
  // "use current location") — passed to the map so it doesn't have to re-geocode
  // the address text and risk drifting from the real point.
  const [pickupCoordsHint, setPickupCoordsHint] = useState<
    [number, number] | null
  >(null);
  const [dropCoordsHint, setDropCoordsHint] = useState<
    [number, number] | null
  >(null);

  const handlePickupChange = (location: string, coords?: [number, number]) => {
    setPickupLocation(location);
    setPickupCoordsHint(coords ?? null);
  };
  const handleDropChange = (location: string, coords?: [number, number]) => {
    setDropLocation(location);
    setDropCoordsHint(coords ?? null);
  };
  const [distance, setDistance] = useState(searchParams.get('distance') || '');
  const [time, setTime] = useState(searchParams.get('time') || '');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(
    searchParams.get('driver') || null
  );

  const navigate = useNavigate();
  const { data, isLoading } = useGetFreeDriversQuery(undefined);

  // Sync state → URL params
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

  const hasRoute = !!(pickupLocation && dropLocation);
  const routeReady = hasRoute && distance && distance !== 'Route not found';

  const step = useMemo(() => {
    if (!pickupLocation || !dropLocation) return 1;
    if (!selectedDriver) return 2;
    return 3;
  }, [pickupLocation, dropLocation, selectedDriver]);

  const [isAutoMatching, setIsAutoMatching] = useState(false);

  const onSubmit = () => {
    navigate(`/confirm-booking?${searchParams.toString()}`);
  };

  const onAutoMatch = async () => {
    if (!pickupLocation || !dropLocation) return;
    setIsAutoMatching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(pickupLocation)}`
      );
      const data = await res.json();
      if (!data?.[0]?.lat || !data?.[0]?.lon) {
        toast.error("Couldn't locate your pickup. Try a more specific address.");
        return;
      }
      const params = new URLSearchParams(searchParams);
      params.delete('driver');
      params.set('autoMatch', '1');
      params.set('pickupLat', data[0].lat);
      params.set('pickupLng', data[0].lon);
      navigate(`/confirm-booking?${params.toString()}`);
    } catch {
      toast.error('Network error while preparing auto-match');
    } finally {
      setIsAutoMatching(false);
    }
  };

  return (
    <div className='min-h-screen text-foreground pb-28'>
      <div className='container mx-auto px-4 max-w-6xl pt-6 md:pt-10 space-y-6'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-foreground'>
              Where to today?
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Set your route, pick a driver, and confirm — it takes seconds.
            </p>
          </div>
          <Stepper step={step} />
        </div>

        {/* Two-column layout: map + sidebar */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Left: location + map */}
          <div className='lg:col-span-8 space-y-3'>
            <LocationInputSection
              pickupLocation={pickupLocation}
              dropLocation={dropLocation}
              onPickupChange={handlePickupChange}
              onDropChange={handleDropChange}
            />

            <BookingMapSection
              pickupLocation={pickupLocation}
              dropLocation={dropLocation}
              onPickupChange={handlePickupChange}
              onDropChange={handleDropChange}
              pickupCoordsHint={pickupCoordsHint}
              dropCoordsHint={dropCoordsHint}
              onRouteUpdate={(dist, dur) => {
                setDistance(dist);
                setTime(dur);
              }}
            />
          </div>

          {/* Right: drivers */}
          <aside className='lg:col-span-4 space-y-3'>
            {/* Route summary card */}
            <div className='bg-card border border-border rounded-xl p-4 grid grid-cols-2 gap-3'>
              <Metric
                icon={<Route className='w-4 h-4' />}
                label='Distance'
                value={routeReady ? distance : '—'}
              />
              <Metric
                icon={<Clock className='w-4 h-4' />}
                label='Est. time'
                value={routeReady ? time : '—'}
              />
            </div>

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
          </aside>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className='fixed inset-x-0 bottom-0 z-30 bg-background/95 backdrop-blur-md border-t border-border'>
        <div className='container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4'>
          <div className='hidden sm:flex items-center gap-3 min-w-0'>
            <div className='w-9 h-9 rounded-md bg-secondary text-foreground flex items-center justify-center shrink-0'>
              <Sparkles className='w-4 h-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-foreground truncate'>
                {step === 1 && 'Set your pickup and drop locations'}
                {step === 2 &&
                  (config.matchingEnabled
                    ? 'Pick a driver from the list — or auto-match'
                    : 'Choose a driver from the list to continue')}
                {step === 3 && 'Looking good — confirm and book your ride'}
              </p>
              <p className='text-xs text-muted-foreground truncate'>
                {routeReady
                  ? `${distance} • ${time}`
                  : 'Live tracking once you confirm'}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 ml-auto'>
            {config.matchingEnabled && hasRoute && !selectedDriver && (
              <Button
                variant='outline'
                onClick={onAutoMatch}
                disabled={!routeReady || isAutoMatching}
                className='gap-2'
              >
                {isAutoMatching ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : null}
                Auto-match
              </Button>
            )}
            <Button
              onClick={onSubmit}
              disabled={!routeReady || !selectedDriver}
              className='gap-2'
            >
              Continue
              <ArrowRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = ['Route', 'Driver', 'Confirm'];
  return (
    <div className='hidden md:flex items-center gap-2'>
      {items.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className='flex items-center gap-2'>
            <div
              className={
                'flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ' +
                (active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : done
                  ? 'bg-secondary text-foreground border-border'
                  : 'bg-background text-muted-foreground border-border')
              }
            >
              <span
                className={
                  'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ' +
                  (active
                    ? 'bg-primary-foreground/20'
                    : done
                    ? 'bg-foreground/10'
                    : 'bg-muted')
                }
              >
                {n}
              </span>
              {label}
            </div>
            {i < items.length - 1 && (
              <span className='w-4 h-px bg-border' />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
        {icon}
        {label}
      </div>
      <p className='mt-1 text-base font-semibold text-foreground tabular-nums'>
        {value}
      </p>
    </div>
  );
}

export default GetRide;
