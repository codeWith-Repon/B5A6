/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  MousePointerClick,
  ChevronDown,
  MapPinOffIcon,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapClickHandler } from './MapClickerHandler';
import { RoutingMachine } from './RoutingMachine';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface BookingMapSectionProps {
  pickupLocation: string;
  dropLocation: string;
  onPickupChange?: (val: string) => void;
  onDropChange?: (val: string) => void;
}

export function BookingMapSection({
  pickupLocation,
  dropLocation,
  onPickupChange,
  onDropChange,
}: BookingMapSectionProps) {
  const [clickMode, setClickMode] = useState<'pickup' | 'drop' | null>(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const [routeInfo, setRouteInfo] = useState({
    distance: '0 km',
    time: '0 min',
  });
  const itineraryRef = useRef<HTMLDivElement | null>(null);

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null,
  );
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);

  const params = new URLSearchParams(window.location.search);

  const isRouteActive = pickupLocation && dropLocation;

  useEffect(() => {
    const p = params.get('pickup');
    const d = params.get('drop');
    if (p && !pickupLocation) onPickupChange?.(p);
    if (d && !dropLocation) onDropChange?.(d);
  }, []);

  useEffect(() => {
    if (pickupLocation) {
      params.set('pickup', pickupLocation);
    } else {
      params.delete('pickup');
    }

    if (dropLocation) {
      params.set('drop', dropLocation);
    } else {
      params.delete('drop');
    }

    if (isRouteActive && routeInfo.distance !== '0 km') {
      params.set('distance', routeInfo.distance);
      params.set('time', routeInfo.time);
    } else {
      params.delete('distance');
      params.delete('time');
    }

    const newRelativePathQuery =
      window.location.pathname +
      (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [pickupLocation, dropLocation, routeInfo, params]);

  useEffect(() => {
    const getCoords = async (
      query: string,
      setter: (c: [number, number] | null) => void,
    ) => {
      if (!query || query.length < 3) {
        setter(null);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
        );
        const data = await res.json();
        if (data.length > 0)
          setter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } catch (e) {
        console.error(e);
      }
    };

    getCoords(pickupLocation, setPickupCoords);
    getCoords(dropLocation, setDropCoords);
  }, [pickupLocation, dropLocation]);

  useEffect(() => {
    const mapContainer = document.querySelector(
      '.leaflet-container',
    ) as HTMLElement;
    if (mapContainer) {
      if (clickMode) {
        mapContainer.style.cursor = 'crosshair';
      } else {
        mapContainer.style.cursor = 'column-resize';
      }
    }
  }, [clickMode]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h3 className='text-xl font-black tracking-tight text-foreground'>
            Live Track
          </h3>
          <p className='text-[10px] uppercase font-bold text-muted-foreground tracking-widest'>
            {isRouteActive ? 'Route Calculated' : 'Select Locations'}
          </p>
        </div>

        {clickMode && (
          <Badge
            variant='outline'
            className='animate-pulse border-primary text-primary bg-primary/5 px-3 py-1'
          >
            <MousePointerClick className='w-3 h-3 mr-2' />
            Set {clickMode} on Map
          </Badge>
        )}
      </div>

      <div
        className={`relative w-full h-112.5 rounded-4xl  shadow-2xl overflow-hidden transition-all duration-700 ${isRouteActive ? 'ring-4 ring-primary/10' : ''}`}
      >
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={13}
          zoomControl={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {/* Markers */}
          {pickupCoords && <Marker position={pickupCoords} />}
          {dropCoords && <Marker position={dropCoords} />}

          {/* Route Line */}
          {pickupCoords && dropCoords ? (
            <RoutingMachine
              start={pickupCoords}
              end={dropCoords}
              itineraryRef={itineraryRef}
              onRouteFound={(d, t) => setRouteInfo({ distance: d, time: t })}
            />
          ) : null}

          {/* Click Handler */}
          <MapClickHandler
            mode={clickMode}
            onSelect={(addr) => {
              if (clickMode === 'pickup') onPickupChange?.(addr);
              if (clickMode === 'drop') onDropChange?.(addr);
              setClickMode(null);
            }}
          />
        </MapContainer>

        {/* Active Stats Overlay */}
        {isRouteActive && (
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-1000 flex flex-col items-center gap-2'>
            <div className='flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl border border-slate-200'>
              <span className='font-bold text-sm text-slate-800'>
                {routeInfo.distance}
              </span>
              <div className='w-px h-4 bg-slate-300' />
              <span className='font-bold text-sm text-slate-800'>
                {routeInfo.time}
              </span>

              <button
                onClick={() => setShowItinerary(!showItinerary)}
                className='ml-2 p-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
              >
                {showItinerary ? (
                  <ChevronDown size={18} />
                ) : (
                  <MapPinOffIcon size={18} />
                )}
              </button>
            </div>
          </div>
        )}

        <div
          className={`absolute top-4 right-4 z-1001 w-72 max-h-[80%] overflow-y-auto bg-white/95 backdrop-blur shadow-2xl rounded-3xl border border-slate-200 transition-all duration-300 transform ${
            showItinerary
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          <div className='p-4 border-b border-slate-100 sticky top-0 bg-white flex justify-between items-center'>
            <h4 className='font-black text-slate-800'>Route Directions</h4>
            <button onClick={() => setShowItinerary(false)}>
              <ChevronUp size={20} />
            </button>
          </div>
          <div
            ref={itineraryRef}
            className='p-2 text-sm text-slate-600 custom-scrollbar'
          />
        </div>
      </div>

      {/* Control Actions */}
      <div className='grid grid-cols-2 gap-4'>
        <button
          onClick={() => setClickMode('pickup')}
          className={`group flex items-center justify-center gap-3 h-14 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer duration-300 ${
            clickMode === 'pickup'
              ? 'bg-primary text-primary-foreground shadow-xl'
              : 'bg-card border-2 border-border hover:border-primary/50 hover:bg-primary'
          }`}
        >
          <div
            className={`p-2 rounded-lg group-hover:bg-white/20 transition-all duration-300 group-hover:text-white ${clickMode === 'pickup' ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}
          >
            <MapPin className='w-4 h-4' />
          </div>
          Set Pickup
        </button>
        <button
          onClick={() => setClickMode('drop')}
          className={`group flex items-center justify-center gap-3 h-14 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer duration-300 ${
            clickMode === 'drop'
              ? 'bg-slate-900 text-white shadow-xl'
              : 'bg-card border-2 border-border hover:border-slate-400'
          }`}
        >
          <div
            className={`p-2 rounded-lg ${clickMode === 'drop' ? 'bg-white/20' : 'bg-slate-100 text-slate-900'}`}
          >
            <Navigation className='w-4 h-4' />
          </div>
          Set Drop
        </button>
      </div>
    </div>
  );
}
