import { landingData } from '@/data/landingData';

export function HowItWorksNewSection() {
  const steps = landingData.howItWorks;

  return (
    <section className='relative py-24'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-xs font-semibold text-primary uppercase tracking-widest'>
            Process
          </div>
          <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            <span className='text-foreground'>How It</span>{' '}
            <span className='gradient-brand-text'>Works</span>
          </h2>
          <p className='text-muted-foreground text-lg'>
            Simple, fast, and secure. Get a ride in three easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className='max-w-5xl mx-auto hidden md:block'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
            {/* Connector lines */}
            <div className='hidden md:block absolute top-12 left-1/2 w-[70%] right-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent' />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className='relative hover-lift'>
                  <div className='flex flex-col items-center space-y-5'>
                    <div className='relative z-10'>
                      <div className='w-24 h-24 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-2xl shadow-primary/30'>
                        <Icon className='w-10 h-10' />
                      </div>
                      <div className='absolute -bottom-2 -right-2 w-9 h-9 rounded-xl glass-strong border border-primary/40 text-foreground flex items-center justify-center font-extrabold text-sm shadow-lg'>
                        {index + 1}
                      </div>
                    </div>

                    <h3 className='font-bold text-xl text-foreground text-center'>
                      {step.title}
                    </h3>

                    <p className='text-muted-foreground text-sm text-center leading-relaxed max-w-xs'>
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
                  <div className='w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/30'>
                    <Icon className='w-7 h-7' />
                  </div>
                  {index < steps.length - 1 && (
                    <div className='w-px h-12 bg-border/60 my-2' />
                  )}
                </div>
                <div className='pt-1 pb-6'>
                  <h3 className='font-bold text-lg text-foreground'>
                    {step.title}
                  </h3>
                  <p className='text-muted-foreground text-sm mt-2 leading-relaxed'>
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
