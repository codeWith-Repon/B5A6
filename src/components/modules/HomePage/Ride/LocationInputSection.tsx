import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpDown,
  Crosshair,
  Loader2,
  MapPin,
  Navigation,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationInputSectionProps {
  pickupLocation: string;
  dropLocation: string;
  onPickupChange: (location: string, coords?: [number, number]) => void;
  onDropChange: (location: string, coords?: [number, number]) => void;
}

export function LocationInputSection({
  pickupLocation,
  dropLocation,
  onPickupChange,
  onDropChange,
}: LocationInputSectionProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const swapLocations = () => {
    const tmp = pickupLocation;
    onPickupChange(dropLocation);
    onDropChange(tmp);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords: [number, number] = [latitude, longitude];
        const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) {
            onPickupChange(fallback, coords);
            return;
          }
          const data = await res.json();
          onPickupChange(data.display_name || fallback, coords);
        } catch {
          onPickupChange(fallback, coords);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => {
        setIsLoadingLocation(false);
        alert('Please enable location permissions in your browser.');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className='bg-card border border-border rounded-xl p-4'>
      <div className='relative flex items-stretch gap-3'>
        {/* Timeline rail */}
        <div className='relative flex flex-col items-center pt-3.5 pb-3.5'>
          <span className='w-2.5 h-2.5 rounded-full border-2 border-primary bg-background' />
          <span className='flex-1 w-px my-1 bg-border' />
          <span className='w-2.5 h-2.5 rounded-sm bg-rose-500' />
        </div>

        {/* Inputs */}
        <div className='flex-1 min-w-0 divide-y divide-border'>
          <LocationAutocomplete
            value={pickupLocation}
            onChange={onPickupChange}
            placeholder={isLoadingLocation ? 'Locating you…' : 'Pickup location'}
            disabled={isLoadingLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLoadingLocation}
          />

          <LocationAutocomplete
            value={dropLocation}
            onChange={onDropChange}
            placeholder='Where to?'
          />
        </div>

        {/* Swap */}
        <button
          type='button'
          onClick={swapLocations}
          className='self-center h-9 w-9 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center justify-center'
          title='Swap locations'
          aria-label='Swap pickup and drop'
        >
          <ArrowUpDown className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Autocomplete                                                       */
/* ------------------------------------------------------------------ */

interface NominatimItem {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  class?: string;
  address?: Record<string, string>;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (val: string, coords?: [number, number]) => void;
  placeholder?: string;
  disabled?: boolean;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
}

function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  disabled,
  onUseCurrentLocation,
  isLocating,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [items, setItems] = useState<NominatimItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const skipNextFetchRef = useRef(false);

  // Keep local query in sync if parent value changes (map click, swap, etc.)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced Nominatim search
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    if (!open || query.trim().length < 3) {
      setItems([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data: NominatimItem[] = await res.json();
        setItems(data);
        setHighlight(data.length > 0 ? 0 : -1);
      } catch {
        /* aborted or network error — ignore */
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, [query, open]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const pick = (item: NominatimItem) => {
    skipNextFetchRef.current = true;
    setQuery(item.display_name);
    onChange(item.display_name, [parseFloat(item.lat), parseFloat(item.lon)]);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (items.length === 0 ? -1 : (h + 1) % items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) =>
        items.length === 0 ? -1 : (h - 1 + items.length) % items.length
      );
    } else if (e.key === 'Enter') {
      if (open && highlight >= 0 && items[highlight]) {
        e.preventDefault();
        pick(items[highlight]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className='relative'>
      <div className='flex items-center'>
        <input
          type='text'
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          title={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className='flex-1 min-w-0 truncate bg-transparent outline-none py-2.5 text-sm font-medium placeholder:text-muted-foreground disabled:opacity-60'
        />
        {onUseCurrentLocation && (
          <button
            type='button'
            onClick={onUseCurrentLocation}
            disabled={disabled}
            className='text-muted-foreground hover:text-primary p-1.5 rounded-md transition-colors disabled:opacity-50'
            title='Use current location'
            aria-label='Use current location'
          >
            {isLocating ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Crosshair className='w-4 h-4' />
            )}
          </button>
        )}
      </div>

      {open && (
        <Suggestions
          query={query}
          loading={loading}
          items={items}
          highlight={highlight}
          onHover={setHighlight}
          onPick={pick}
          onUseCurrentLocation={onUseCurrentLocation}
          isLocating={isLocating}
        />
      )}
    </div>
  );
}

function Suggestions({
  query,
  loading,
  items,
  highlight,
  onHover,
  onPick,
  onUseCurrentLocation,
  isLocating,
}: {
  query: string;
  loading: boolean;
  items: NominatimItem[];
  highlight: number;
  onHover: (i: number) => void;
  onPick: (item: NominatimItem) => void;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
}) {
  const queryTooShort = query.trim().length < 3;
  const showCurrentLocation = !!onUseCurrentLocation;
  const showEmpty = !loading && !queryTooShort && items.length === 0;

  if (!showCurrentLocation && queryTooShort) return null;

  return (
    <div className='absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden'>
      {showCurrentLocation && (
        <button
          type='button'
          onMouseDown={(e) => {
            e.preventDefault();
            onUseCurrentLocation?.();
          }}
          disabled={isLocating}
          className='w-full px-3 py-2.5 text-left flex items-center gap-3 text-sm hover:bg-secondary transition-colors border-b border-border'
        >
          <span className='w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0'>
            {isLocating ? (
              <Loader2 className='w-3.5 h-3.5 animate-spin' />
            ) : (
              <Navigation className='w-3.5 h-3.5' />
            )}
          </span>
          <span className='font-medium text-foreground'>
            Use current location
          </span>
        </button>
      )}

      {queryTooShort && (
        <div className='px-3 py-4 text-xs text-muted-foreground flex items-center gap-2'>
          <Search className='w-3.5 h-3.5' />
          Keep typing to search…
        </div>
      )}

      {loading && (
        <div className='px-3 py-3 text-xs text-muted-foreground flex items-center gap-2'>
          <Loader2 className='w-3.5 h-3.5 animate-spin' />
          Searching…
        </div>
      )}

      {showEmpty && (
        <div className='px-3 py-4 text-xs text-muted-foreground'>
          No matches for <span className='font-medium'>"{query}"</span>
        </div>
      )}

      {items.length > 0 && (
        <ul className='max-h-72 overflow-y-auto py-1'>
          {items.map((item, i) => {
            const [primary, ...rest] = item.display_name.split(',');
            return (
              <li key={item.place_id}>
                <button
                  type='button'
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onPick(item);
                  }}
                  onMouseEnter={() => onHover(i)}
                  className={cn(
                    'w-full text-left px-3 py-2 flex items-start gap-3 text-sm transition-colors',
                    i === highlight ? 'bg-secondary' : 'hover:bg-secondary/60'
                  )}
                >
                  <MapPin className='w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0' />
                  <span className='min-w-0 flex-1'>
                    <span className='block font-medium text-foreground truncate'>
                      {primary.trim()}
                    </span>
                    {rest.length > 0 && (
                      <span className='block text-xs text-muted-foreground truncate'>
                        {rest.join(',').trim()}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
