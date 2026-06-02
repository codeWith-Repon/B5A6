import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { landingData } from '@/data/landingData';

export function ServicesSection() {
  const { services } = landingData;
  return (
    <section id='services' className='relative py-24'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-16'>
          <div className='inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-border text-xs font-medium text-muted-foreground'>
            Services
          </div>
          <h2 className='text-3xl md:text-4xl font-semibold tracking-tight text-foreground'>
            Move your way
          </h2>
          <p className='text-muted-foreground'>
            Choose from our range of reliable transportation services tailored
            to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className='group relative rounded-xl bg-card border border-border overflow-hidden transition-colors hover:border-primary/40'
              >
                {/* Content */}
                <div className='relative p-6 space-y-4'>
                  <div className='w-10 h-10 rounded-md bg-secondary text-foreground flex items-center justify-center'>
                    <Icon className='w-5 h-5' />
                  </div>

                  <h3 className='font-semibold text-base text-foreground'>
                    {service.title}
                  </h3>

                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {service.description}
                  </p>

                  <Button
                    variant='link'
                    className='justify-start px-0 h-auto py-1'
                  >
                    Learn more
                    <ArrowRight className='ml-1 w-3.5 h-3.5' />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
