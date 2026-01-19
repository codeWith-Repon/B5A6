import { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  MousePointerClick,
  Milestone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BookingMapSectionProps {
  pickupLocation: string;
  dropLocation: string;
}

export function BookingMapSection({
  pickupLocation,
  dropLocation,
}: BookingMapSectionProps) {
  const [clickMode, setClickMode] = useState<'pickup' | 'drop' | null>(null);

  const isRouteActive = pickupLocation && dropLocation;

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
            Set {clickMode}
          </Badge>
        )}
      </div>

      <div
        className={`relative w-full h-112.5 rounded-4xl  shadow-2xl overflow-hidden transition-all duration-700 ${isRouteActive ? 'ring-4 ring-primary/10' : ''}`}
      >
        {/* Animated Background Engine */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${isRouteActive && 'bg-muted'}`}
        >
          <svg
            className='absolute inset-0 w-full h-full opacity-20'
            preserveAspectRatio='none'
          >
            <defs>
              <pattern
                id='grid-active'
                width='50'
                height='50'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M 50 0 L 0 0 0 50'
                  fill='none'
                  stroke={isRouteActive ? '#f97316' : '#cbd5e1'}
                  strokeWidth='0.5'
                />
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#grid-active)' />
          </svg>

          {/* Motion Glow Effect */}
          {isRouteActive && (
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.15),transparent_70%)] animate-pulse' />
          )}
        </div>

        {/* The Route Line (Only shows when both selected) */}
        {isRouteActive && (
          <svg className='absolute inset-0 w-full h-full z-10 pointer-events-none'>
            <path
              d='M 120 150 Q 250 250 380 350'
              fill='none'
              stroke='url(#routeGradient)'
              strokeWidth='4'
              strokeDasharray='10, 8'
              className='animate-[dash_20s_linear_infinite]'
            />
            <defs>
              <linearGradient
                id='routeGradient'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor='var(--color-primary)' />
                <stop offset='100%' stopColor='#fb923c' />
              </linearGradient>
            </defs>
          </svg>
        )}

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

        {/* Centered Guide (Visible only when empty) */}
        {!pickupLocation && !dropLocation && (
          <div className='relative h-full flex items-center justify-center z-20'>
            <div className='text-center p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-500'>
              <div className='w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12 hover:rotate-0 transition-transform duration-500'>
                <Navigation className='text-white w-8 h-8' />
              </div>
              <h4 className='font-black text-lg'>Where to?</h4>
              <p className='text-xs text-muted-foreground max-w-45 mx-auto'>
                Tap the buttons below to mark your journey on the map.
              </p>
            </div>
          </div>
        )}

        {/* Pickup Marker */}
        {pickupLocation && (
          <div className='absolute top-37.5 left-30 -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer'>
            <div className='relative'>
              <span className='absolute -inset-3.75 rounded-full bg-primary/20 animate-ping' />
              <div className='w-12 h-12 bg-primary rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center border-2 border-white rotate-45 group-hover:rotate-0 transition-transform'>
                <MapPin className='w-6 h-6 text-white -rotate-45 group-hover:rotate-0 transition-transform' />
              </div>
            </div>
            <div className='absolute top-14 left-1/2 -translate-x-1/2 bg-chart-4 text-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border border-white/20 uppercase tracking-tighter'>
              Pickup: {pickupLocation.split(',')[0]}
            </div>
          </div>
        )}

        {/* Drop Marker */}
        {dropLocation && (
          <div className='absolute top-87.5 left-95 -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer'>
            <div className='relative'>
              <span className='absolute -inset-3.75 rounded-full bg-orange-400/20 animate-ping' />
              <div className='w-12 h-12 bg-ring rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white rotate-45 group-hover:rotate-0 transition-transform'>
                <MapPin className='w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform' />
              </div>
            </div>
            <div className='absolute top-14 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-lg uppercase tracking-tighter'>
              Drop: {dropLocation.split(',')[0]}
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
