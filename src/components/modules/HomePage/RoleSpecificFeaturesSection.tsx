import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { landingData } from '@/data/landingData';

export function RoleSpecificFeatures() {
  const riderFeatures = landingData.roleFeatures.rider;
  const driverFeatures = landingData.roleFeatures.driver;
  return (
    <section id='features' className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
            Features for Everyone
          </h2>
          <p className='text-foreground/60 text-lg'>
            Whether you're looking to travel or earn, RideHub has benefits for
            both riders and drivers.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue='riders' className='w-full max-w-4xl mx-auto'>
          <div className='flex justify-center mb-10'>
            <TabsList className='bg-muted rounded-lg p-1'>
              <TabsTrigger
                value='riders'
                className='px-8 py-3 font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
              >
                For Riders
              </TabsTrigger>

              <TabsTrigger
                value='drivers'
                className='px-8 py-3 font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
              >
                For Drivers
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Riders Tab */}
          <TabsContent value='riders' className='mt-0'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
              {riderFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className='p-6 md:p-8 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg shadow-sm transition-all duration-300 animate-fade-in'
                  >
                    <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4'>
                      <Icon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='font-bold text-lg text-foreground mb-2'>
                      {feature.title}
                    </h3>
                    <p className='text-foreground/60 text-sm leading-relaxed'>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className='text-center mt-10'>
              <Button
                size='lg'
                className='bg-secondary hover:bg-secondary/90 text-foreground font-semibold'
              >
                Book Your First Ride
              </Button>
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value='drivers' className='mt-0'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
              {driverFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className='p-6 md:p-8 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in'
                  >
                    <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4'>
                      <Icon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='font-bold text-lg text-foreground mb-2'>
                      {feature.title}
                    </h3>
                    <p className='text-foreground/60 text-sm leading-relaxed'>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className='text-center mt-10'>
              <Button
                size='lg'
                className='bg-secondary hover:bg-secondary/90 text-foreground font-semibold'
              >
                Start Earning Today
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
