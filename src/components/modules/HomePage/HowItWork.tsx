import { landingData } from '@/data/landingData';

export function HowItWorksNewSection() {
  const steps = landingData.howItWorks;

  return (
    <section className='py-20 bg-muted/50'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl  mx-auto text-center space-y-4 mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
            How It Works
          </h2>
          <p className='text-foreground/60 text-lg'>
            Simple, fast, and secure. Get a ride in three easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className='max-w-4xl mx-auto hidden md:block'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
            {/* Connector lines (hidden on mobile) */}
            <div className='hidden md:block absolute top-24 left-1/2 w-[80%] right-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary/20' />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className='relative'>
                  {/* Step number circle */}
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='relative z-10'>
                      <div className='w-24 h-24 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/10 flex items-center justify-center text-white shadow-lg'>
                        <Icon className='w-12 h-12' />
                      </div>
                      <div className='absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-sm'>
                        {index + 1}
                      </div>
                    </div>

                    {/* Text content */}
                    <h3 className='font-bold text-lg md:text-xl text-foreground text-center'>
                      {step.title}
                    </h3>

                    <p className='text-foreground/60 text-sm md:text-base text-center leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline variant for mobile */}
        <div className='md:hidden mt-8 space-y-8'>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className='flex gap-4'>
                <div className='flex flex-col items-center'>
                  <div className='w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white flex-shrink-0'>
                    <Icon className='w-8 h-8' />
                  </div>
                  {index < steps.length - 1 && (
                    <div className='w-1 h-12 bg-border my-2' />
                  )}
                </div>
                <div className='pt-2 pb-8'>
                  <h3 className='font-bold text-lg text-foreground'>
                    {step.title}
                  </h3>
                  <p className='text-foreground/60 text-sm mt-2 leading-relaxed'>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
