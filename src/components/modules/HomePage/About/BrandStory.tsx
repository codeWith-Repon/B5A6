import { Lightbulb, Target } from 'lucide-react';

export function BrandStoryHeroSection() {
  return (
    <section className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left side - Text Content */}
          <div className='space-y-8'>
            {/* Mission Statement */}
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Target className='w-6 h-6 text-primary' />
                <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
                  Our Mission
                </h2>
              </div>
              <p className='text-lg text-foreground/70 leading-relaxed'>
                To revolutionize urban mobility by providing safe, affordable,
                and accessible ride-sharing solutions that connect people,
                communities, and opportunities across Bangladesh and beyond.
              </p>
            </div>

            {/* Vision Statement */}
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Lightbulb className='w-6 h-6 text-primary' />
                <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
                  Our Vision
                </h2>
              </div>
              <p className='text-lg text-foreground/70 leading-relaxed'>
                To build a world where every person has access to reliable,
                transparent, and sustainable transportation. We envision a
                future where technology empowers both riders and drivers to
                achieve their goals safely and efficiently.
              </p>
            </div>

            {/* Brand Story */}
            <div className='space-y-3 border-t border-border pt-8'>
              <h3 className='text-xl font-bold text-foreground'>Our Story</h3>
              <p className='text-foreground/70 leading-relaxed'>
                Founded in 2025, RideFlow started with a simple vision: to make
                transportation accessible to everyone. What began as a small
                startup has grown into a platform trusted by millions of riders
                and thousands of drivers. Today, we operate in over 100 cities,
                maintaining our commitment to safety, reliability, and
                innovation at every step.
              </p>
            </div>
          </div>

          {/* Right side - Visual Element */}
          <div className='hidden lg:flex items-center justify-center'>
            <div className='relative w-full max-w-md h-96'>
              {/* Abstract gradient background with shapes */}
              <div className='absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl' />

              {/* Center content */}
              <div className='relative h-full flex flex-col items-center justify-center space-y-6 p-8'>
                {/* Main circle */}
                <div className='w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-2xl'>
                  <div className='text-center'>
                    <p className='text-4xl font-bold'>100+</p>
                    <p className='text-sm mt-1 '>Cities Served</p>
                  </div>
                </div>

                {/* Accent elements */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='w-20 h-20 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='text-sm font-semibold text-foreground'>
                        1M+
                      </p>
                      <p className='text-xs text-foreground/60'>Riders</p>
                    </div>
                  </div>
                  <div className='w-20 h-20 rounded-lg bg-secondary/70 border border-secondary/30 flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='text-sm font-semibold text-foreground'>
                        500K+
                      </p>
                      <p className='text-xs text-foreground/60'>Drivers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
