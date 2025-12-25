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
    <section className='py-20 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left side - Content */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
                Your Safety is Our Priority
              </h2>
              <p className='text-foreground/70 text-lg'>
                We've implemented industry-leading safety measures to ensure
                every ride is secure and protected.
              </p>
            </div>

            {/* Features */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {safetyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className='space-y-2'>
                    <div className='w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center'>
                      <Icon className='w-5 h-5' />
                    </div>
                    <h3 className='font-semibold text-foreground'>
                      {feature.title}
                    </h3>
                    <p className='text-sm text-foreground/60 leading-relaxed'>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <Button className='bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 cursor-pointer'>
              Learn More About Safety
              <ArrowRight className='ml-2 w-4 h-4' />
            </Button>
          </div>

          {/* Right side - Illustration */}
          <div className='hidden lg:flex items-center justify-center'>
            <div className='relative'>
              {/* Phone mockup */}
              <div className='w-64 h-96 rounded-3xl bg-card shadow-2xl border-8 border-gray-300 dark:border-gray-700 overflow-hidden'>
                <div className='h-full bg-gradient-to-br from-primary to-primary/80 flex flex-col items-center justify-center text-white p-6 space-y-6'>
                  <div className='w-16 h-16 rounded-full bg-red-600 flex items-center justify-center animate-pulse'>
                    <AlertCircle className='w-8 h-8' />
                  </div>
                  <h3 className='text-center font-bold text-xl'>
                    SOS Emergency
                  </h3>
                  <p className='text-center text-sm opacity-90'>
                    One tap to alert authorities and emergency contacts
                  </p>
                  <Button className='bg-red-500 hover:bg-red-600 text-white font-bold w-full py-6 text-lg'>
                    EMERGENCY
                  </Button>
                </div>
              </div>

              {/* Floating badge */}
              <div className='absolute -bottom-4 -right-4 bg-green-500 text-white rounded-full p-4 shadow-lg'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-white animate-pulse' />
                  <span className='font-semibold text-sm'>99.9% Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
