import { AlertCircle, MapPin, Lock, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const safetyFeatures = [
  {
    icon: AlertCircle,
    title: 'SOS Emergency Button',
    description:
      'One-tap emergency alert sends your location to authorities and emergency contacts instantly.',
  },
  {
    icon: MapPin,
    title: 'Live Location Tracking',
    description:
      'Share your ride details with family and friends. Real-time location updates throughout the trip.',
  },
  {
    icon: Lock,
    title: 'Verified Drivers',
    description:
      'All drivers undergo thorough background checks and vehicle inspections. Regular safety audits.',
  },
  {
    icon: Phone,
    title: '24/7 Customer Support',
    description:
      'Round-the-clock support team ready to assist you anytime. Direct communication with driver.',
  },
];

export function SafetyAndSOSSection() {
  return (
    <section className='relative py-24'>
      <div className='container mx-auto px-4'>
        <div className='glass-strong rounded-3xl p-8 md:p-12 border border-border/40'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left side - Content */}
            <div className='space-y-8'>
              <div>
                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-red-400/30 text-xs font-semibold text-red-400 uppercase tracking-widest mb-4'>
                  Safety
                </div>
                <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4'>
                  Your Safety is Our{' '}
                  <span className='gradient-brand-text'>Priority</span>
                </h2>
                <p className='text-muted-foreground text-lg'>
                  We've implemented industry-leading safety measures to ensure
                  every ride is secure and protected.
                </p>
              </div>

              {/* Features */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                {safetyFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className='space-y-2 p-4 rounded-2xl glass-subtle border border-border/30 hover-lift hover:border-primary/30 transition-all'
                    >
                      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30'>
                        <Icon className='w-5 h-5' />
                      </div>
                      <h3 className='font-bold text-foreground'>
                        {feature.title}
                      </h3>
                      <p className='text-sm text-muted-foreground leading-relaxed'>
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Button
                size='lg'
                className='rounded-full px-8 bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
              >
                Learn More About Safety
                <ArrowRight className='ml-2 w-4 h-4' />
              </Button>
            </div>

            {/* Right side - Phone mockup */}
            <div className='hidden lg:flex items-center justify-center'>
              <div className='relative'>
                <div className='w-72 h-[480px] rounded-[2.5rem] glass-strong shadow-2xl border-8 border-slate-800/60 overflow-hidden'>
                  <div className='h-full bg-gradient-to-br from-primary via-primary/80 to-accent flex flex-col items-center justify-center text-white p-6 space-y-6 relative'>
                    <div className='absolute inset-0 bg-white/5' />
                    <div className='relative z-10 flex flex-col items-center gap-6'>
                      <div className='w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center animate-pulse shadow-2xl shadow-red-500/50'>
                        <AlertCircle className='w-10 h-10' />
                      </div>
                      <h3 className='text-center font-extrabold text-2xl tracking-tight'>
                        SOS Emergency
                      </h3>
                      <p className='text-center text-sm opacity-90 max-w-[220px]'>
                        One tap to alert authorities and emergency contacts
                      </p>
                      <Button className='bg-red-500 hover:bg-red-600 text-white font-extrabold w-full py-6 text-base tracking-widest rounded-2xl'>
                        EMERGENCY
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='absolute -bottom-4 -right-4 glass-strong border border-emerald-400/40 text-emerald-400 rounded-2xl px-4 py-2 shadow-lg'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                    <span className='font-bold text-sm'>99.9% Safe</span>
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
