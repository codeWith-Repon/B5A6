/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  MousePointerClick,
  Milestone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapClickHandler } from './MapClickerHandler';

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


// 🛡️ CHANGE: New Component to draw the Route Line
function RoutingMachine({
  start,
  end,
}: {
  start: [number, number] | null;
  end: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: { styles: [{ color: '#f97316', weight: 5 }] },
      show: false,
      addWaypoints: false,
    }).addTo(map);

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
}

export function BookingMapSection({
  pickupLocation,
  dropLocation,
  onPickupChange,
  onDropChange,
}: BookingMapSectionProps) {
  const [clickMode, setClickMode] = useState<'pickup' | 'drop' | null>(null);

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null,
  );
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);

  const isRouteActive = pickupLocation && dropLocation;

  useEffect(() => {
    const getCoords = async (
      query: string,
      setter: (c: [number, number]) => void,
    ) => {
      if (!query || query.length < 3) return;
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
          <RoutingMachine start={pickupCoords} end={dropCoords} />

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
          <div className='absolute top-6 left-1/2 -translate-x-1/2 z-1 flex gap-3 animate-in fade-in slide-in-from-top-4 duration-1000'>
            <div className='bg-card/90 backdrop-blur-md border border-border px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3'>
              <div className='bg-primary/20 p-2 rounded-xl'>
                <Milestone className='w-4 h-4 text-primary' />
              </div>
              <div>
                <p className='text-[10px] uppercase text-muted-foreground font-bold leading-none'>
                  Distance
                </p>
                <p className='text-sm font-black'>4.8 km</p>
              </div>
            </div>
            <div className='bg-card/90 backdrop-blur-md border border-border px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3'>
              <div className='bg-emerald-500/20 p-2 rounded-xl'>
                <Clock className='w-4 h-4 text-emerald-500' />
              </div>
              <div>
                <p className='text-[10px] uppercase text-muted-foreground font-bold leading-none'>
                  Time
                </p>
                <p className='text-sm font-black'>12 min</p>
              </div>
            </div>
          </div>
        )}

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
