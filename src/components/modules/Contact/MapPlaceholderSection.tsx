import { MapPin, Navigation } from 'lucide-react';

export function MapPlaceholderSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-foreground mb-2'>
          Visit Our Headquarters
        </h2>
        <p className='text-foreground/70'>
          Located in the heart of Dhaka, Bangladesh. We're always happy to
          welcome visitors and partners.
        </p>
      </div>

      {/* Map Container */}
      <div className='relative w-full h-96 rounded-2xl border border-border overflow-hidden group'>
        {/* Map background - grid pattern */}
        <div className='absolute inset-0 bg-gradient-to-br from-muted to-muted/80'>
          {/* Grid pattern */}
          <svg
            className='absolute inset-0 w-full h-full opacity-10'
            preserveAspectRatio='none'
          >
            <defs>
              <pattern
                id='map-grid'
                width='40'
                height='40'
                patternUnits='userSpaceOnUse'
              >
                <path d='M 40 0 L 0 0 0 40' fill='none' stroke='currentColor' />
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#map-grid)' />
          </svg>

          {/* location visualization */}
          <div className='absolute inset-0 flex items-center justify-center opacity-30'>
            <div className='absolute w-64 h-64 rounded-full border-2 border-primary' />
            <div className='absolute w-48 h-48 rounded-full border-2 border-primary/50' />
            <div className='absolute w-32 h-32 rounded-full border-2 border-primary/50' />
          </div>
        </div>

        {/* Map content - Headquarters marker */}

        <div className='relative h-full flex items-center justify-center'>
          {/* Headquarters Marker */}
          <div className='relative z-10'>
            {/* Animated pulse ring */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-30 h-32 rounded-full border-2 border-primary/30 animate-pulse' />
            </div>

            {/* Main marker */}

            <div className='relative w-14 h-14 bg-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse delay-1s'>
              <MapPin className='w-7 h-7 text-white' />
            </div>

            {/* Label */}
            <div className='absolute top-20 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg whitespace-nowrap'>
              <p className='text-sm font-semibold text-foreground'>RideFlow</p>
              <p className='text-xs text-foreground/60 text-center'>
                Nageswari, Kurigram
              </p>
            </div>
          </div>

          {/* Info overlay for placeholder */}
          <div className='absolute top-4 right-4 bg-white/80 dark:bg-card/80 rounded-lg p-4 max-w-xs'>
            <p className='text-xs text-foreground/70'>
              <span className='font-semibold text-foreground'>Note:</span> This
              is a placeholder map. In production, this would integrate with
              Google Maps or Leaflet.
            </p>
          </div>
        </div>

        {/* Map controls */}
        <div className='absolute bottom-4 right-4 space-y-2 z-10'>
          <button className='w-10 h-10 rounded-lg bg-white dark:bg-card border border-border flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer'>
            +
          </button>
          <button className='w-10 h-10 rounded-lg bg-white dark:bg-card border border-border flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer'>
            −
          </button>
        </div>
      </div>

      {/* Location Details */}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Address */}
        <div className='bg-card border border-border rounded-lg p-4 space-y-2'>
          <div className='flex items-center gap-2'>
            <MapPin className='w-5 h-5 text-primary flex-shrink-0' />
            <h3 className='font-semibold text-foreground'>Address</h3>
          </div>
          <p className='text-sm text-foreground/70'>
            House 12, Road 123
            <br />
            Nageswari-2, Kurigram
            <br />
            Bangladesh
          </p>
        </div>

        {/* Hours */}
        <div className='bg-card border border-border rounded-lg p-4 space-y-2'>
          <div className='flex items-center gap-2'>
            <Navigation className='w-5 h-5 text-primary flex-shrink-0' />
            <h3 className='font-semibold text-foreground'>Business Hours</h3>
          </div>
          <p className='text-sm text-foreground/70'>
            Monday - Friday
            <br />
            9:00 AM - 6:00 PM
            <br />
            24/7 Support Line
          </p>
        </div>

        {/* Directions */}
        <div className='bg-card border border-border rounded-lg p-4 space-y-2'>
          <div className='flex items-center gap-2'>
            <Navigation className='w-5 h-5 text-primary flex-shrink-0' />
            <h3 className='font-semibold text-foreground'>Directions</h3>
          </div>
          <a
            href='https://maps.google.com'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1'
          >
            Get Directions →
          </a>
          <p className='text-xs text-foreground/60'>
            Easily accessible by car, metro, or taxi
          </p>
        </div>
      </div>
    </div>
  );
}
