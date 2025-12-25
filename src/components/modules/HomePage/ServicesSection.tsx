import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { landingData } from '@/data/landingData';

export function ServicesSection() {
  const { services } = landingData;
  return (
    <section className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
            Our Services
          </h2>
          <p className='text-foreground/60 text-lg'>
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
                className='group rounded-xl bg-card border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-lg'
              >
                {/* Color bar */}
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />

                {/* Content */}
                <div className='p-6 space-y-4'>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}
                  >
                    <Icon className='w-6 h-6 text-white' />
                  </div>

                  <h3 className='font-bold text-lg text-foreground'>
                    {service.title}
                  </h3>

                  <p className='text-foreground/60 text-sm leading-relaxed'>
                    {service.description}
                  </p>

                  <Button
                    variant='ghost'
                    className='w-full text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-transform justify-start'
                  >
                    Learn More
                    <ArrowRight className='ml-2 w-4 h-4' />
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
