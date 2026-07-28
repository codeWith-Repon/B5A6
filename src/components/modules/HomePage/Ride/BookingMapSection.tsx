/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  MousePointerClick,
  X,
  Clock,
  Route,
  MapPinOffIcon,
  Crosshair,
  Loader2,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { MapClickHandler } from './MapClickerHandler';
import { RoutingMachine } from './RoutingMachine';

const TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
  },
};

/* --- Custom markers --- */
const makeDotIcon = (color: string, ringColor: string) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        width: 22px; height: 22px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 0 4px ${ringColor}, 0 2px 8px oklch(0 0 0 / 0.35);
        border: 3px solid white;
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

const pickupIcon = makeDotIcon(
  'oklch(0.55 0.2 265)',
  'oklch(0.55 0.2 265 / 0.25)'
);

const dropIcon = makeDotIcon(
  'oklch(0.55 0.22 25)',
  'oklch(0.55 0.22 25 / 0.25)'
);

const driverIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 36px; height: 36px;
      border-radius: 50%;
      background: oklch(0.55 0.2 265);
      box-shadow: 0 0 0 5px oklch(0.55 0.2 265 / 0.2), 0 4px 12px oklch(0 0 0 / 0.35);
      display: flex; align-items: center; justify-content: center;
      color: white;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface BookingMapSectionProps {
  pickupLocation: string;
  dropLocation: string;
  onPickupChange?: (val: string) => void;
  onDropChange?: (val: string) => void;
  onRouteUpdate?: (distance: string, time: string) => void;
  /** [lat, lng] of the driver's current GPS — pin auto-rendered when set */
  driverCoords?: [number, number] | null;
  /**
   * Exact coords for the pickup/drop text, when the caller already knows them
   * (autocomplete pick, "use current location" outside this component) — skips
   * the address→coords re-geocode so the pin doesn't drift from the real point.
   */
  pickupCoordsHint?: [number, number] | null;
  dropCoordsHint?: [number, number] | null;
  /** Hide the bottom "Set Pickup / Set Drop" action buttons */
  hideActions?: boolean;
  /** Height (Tailwind class). Defaults to a comfortable preview height. */
  className?: string;
}

export function BookingMapSection({
  pickupLocation,
  dropLocation,
  onPickupChange,
  onDropChange,
  onRouteUpdate,
  driverCoords,
  pickupCoordsHint,
  dropCoordsHint,
  hideActions,
  className,
}: BookingMapSectionProps) {
  const { theme } = useTheme();
  const isDark = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }, [theme]);
  const tile = isDark ? TILES.dark : TILES.light;

  const [clickMode, setClickMode] = useState<'pickup' | 'drop' | null>(null);
  const [routeInfo, setRouteInfo] = useState({
    distance: '0 km',
    time: '0 min',
  });
  const itineraryRef = useRef<HTMLDivElement | null>(null);

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null
  );
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  // Set when a coord comes straight from a map interaction (click/drag/locate) —
  // tells the address→coords geocode effect below to skip re-deriving that field,
  // so the pin doesn't snap back then jump to Nominatim's forward-search result.
  const skipPickupGeocodeRef = useRef(false);
  const skipDropGeocodeRef = useRef(false);

  const isRouteActive = !!(pickupLocation && dropLocation);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        skipPickupGeocodeRef.current = true;
        setPickupCoords([latitude, longitude]);
        const addr = await reverseGeocode(latitude, longitude);
        onPickupChange?.(addr);
        setClickMode(null);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('Please enable location permissions in your browser.');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Bare map clicks default to pickup-first, then drop — explicit button clicks (clickMode) override this.
  const effectiveClickMode: 'pickup' | 'drop' | null =
    clickMode ?? (!pickupLocation ? 'pickup' : !dropLocation ? 'drop' : null);

  // Address string → coords (only for edits that didn't already come with exact coords,
  // e.g. typing/autocomplete — map click/drag/locate set coords directly and skip this).
  const forwardGeocode = async (
    query: string,
    setter: (c: [number, number] | null) => void
  ) => {
    if (!query || query.length < 3) {
      setter(null);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data.length > 0)
        setter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    } catch (e) {
      console.error(e);
    }
  };

  // Caller already knows the exact coords for this pickup/drop text (autocomplete
  // pick or an external "use current location") — use them directly and tell the
  // text-driven effects below to skip their own re-geocode for this change.
  useEffect(() => {
    if (!pickupCoordsHint) return;
    skipPickupGeocodeRef.current = true;
    setPickupCoords(pickupCoordsHint);
  }, [pickupCoordsHint]);

  useEffect(() => {
    if (!dropCoordsHint) return;
    skipDropGeocodeRef.current = true;
    setDropCoords(dropCoordsHint);
  }, [dropCoordsHint]);

  useEffect(() => {
    if (skipPickupGeocodeRef.current) {
      skipPickupGeocodeRef.current = false;
      return;
    }
    forwardGeocode(pickupLocation, setPickupCoords);
  }, [pickupLocation]);

  useEffect(() => {
    if (skipDropGeocodeRef.current) {
      skipDropGeocodeRef.current = false;
      return;
    }
    forwardGeocode(dropLocation, setDropCoords);
  }, [dropLocation]);

  return (
    <div className='space-y-3'>
      <div
        className={`relative w-full ${className ?? 'h-[28rem] md:h-[34rem]'} rounded-2xl overflow-hidden border border-border bg-secondary`}
      >
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={13}
          zoomControl={false}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            key={isDark ? 'dark' : 'light'}
            url={tile.url}
            attribution={tile.attribution}
            subdomains={tile.subdomains}
          />

          {pickupCoords && (
            <Marker
              position={pickupCoords}
              icon={pickupIcon}
              draggable={!!onPickupChange}
              eventHandlers={{
                dragend: async (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  skipPickupGeocodeRef.current = true;
                  setPickupCoords([lat, lng]);
                  onPickupChange?.(await reverseGeocode(lat, lng));
                },
              }}
            />
          )}
          {dropCoords && (
            <Marker
              position={dropCoords}
              icon={dropIcon}
              draggable={!!onDropChange}
              eventHandlers={{
                dragend: async (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  skipDropGeocodeRef.current = true;
                  setDropCoords([lat, lng]);
                  onDropChange?.(await reverseGeocode(lat, lng));
                },
              }}
            />
          )}
          {driverCoords && (
            <Marker
              position={driverCoords}
              icon={driverIcon}
              zIndexOffset={500}
            />
          )}

          {pickupCoords && dropCoords && (
            <RoutingMachine
              start={pickupCoords}
              end={dropCoords}
              itineraryRef={itineraryRef}
              onRouteFound={(d, t) => {
                setRouteInfo({ distance: d, time: t });
                onRouteUpdate?.(d, t);
              }}
            />
          )}

          <MapClickHandler
            mode={effectiveClickMode}
            onSelect={(addr, lat, lng) => {
              if (effectiveClickMode === 'pickup') {
                skipPickupGeocodeRef.current = true;
                setPickupCoords([lat, lng]);
                onPickupChange?.(addr);
              }
              if (effectiveClickMode === 'drop') {
                skipDropGeocodeRef.current = true;
                setDropCoords([lat, lng]);
                onDropChange?.(addr);
              }
              setClickMode(null);
            }}
          />
        </MapContainer>

        {/* Locate-me control */}
        {onPickupChange && (
          <button
            type='button'
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className='absolute top-3 right-3 z-1000 h-9 w-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-60'
            title='Use current location as pickup'
            aria-label='Use current location as pickup'
          >
            {isLocating ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Crosshair className='w-4 h-4' />
            )}
          </button>
        )}

        {/* Click-to-pick mode badge */}
        {effectiveClickMode && (
          <div className='absolute top-3 left-1/2 -translate-x-1/2 z-1000 bg-card border border-border rounded-full px-3 py-1.5 shadow-md flex items-center gap-2 text-xs font-medium'>
            <MousePointerClick className='w-3.5 h-3.5 text-primary' />
            Tap the map to set {effectiveClickMode}
            {clickMode && (
              <button
                onClick={() => setClickMode(null)}
                className='ml-1 text-muted-foreground hover:text-foreground'
                aria-label='Cancel'
              >
                <X className='w-3 h-3' />
              </button>
            )}
          </div>
        )}

        {/* Route summary chip (bottom-center) */}
        {isRouteActive && (
          <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-1000'>
            {routeInfo.distance === 'Route not found' ? (
              <div className='bg-card border border-destructive/40 rounded-full px-4 py-1.5 shadow-md flex items-center gap-2 text-xs font-medium text-destructive'>
                <MapPinOffIcon className='w-3.5 h-3.5' />
                Route not found
              </div>
            ) : routeInfo.distance !== '0 km' ? (
              <div className='bg-card border border-border rounded-full px-4 py-1.5 shadow-md flex items-center gap-3 text-xs font-medium'>
                <span className='inline-flex items-center gap-1'>
                  <Route className='w-3.5 h-3.5 text-muted-foreground' />
                  {routeInfo.distance}
                </span>
                <div className='w-px h-3 bg-border' />
                <span className='inline-flex items-center gap-1'>
                  <Clock className='w-3.5 h-3.5 text-muted-foreground' />
                  {routeInfo.time}
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* hidden itinerary container required by leaflet-routing-machine */}
        <div ref={itineraryRef} className='hidden' />
      </div>

      {/* Map control buttons (optional — hidden when a parent wraps them) */}
      {!hideActions && (onPickupChange || onDropChange) && (
        <div className='grid grid-cols-2 gap-2'>
          <Button
            type='button'
            variant={clickMode === 'pickup' ? 'default' : 'outline'}
            onClick={() =>
              setClickMode(clickMode === 'pickup' ? null : 'pickup')
            }
            className='justify-start'
          >
            <MapPin className='w-4 h-4' />
            {pickupLocation ? 'Change pickup on map' : 'Pick on map — Pickup'}
          </Button>
          <Button
            type='button'
            variant={clickMode === 'drop' ? 'default' : 'outline'}
            onClick={() => setClickMode(clickMode === 'drop' ? null : 'drop')}
            className='justify-start'
          >
            <Navigation className='w-4 h-4' />
            {dropLocation ? 'Change drop on map' : 'Pick on map — Drop'}
          </Button>
        </div>
      )}
    </div>
  );
}
