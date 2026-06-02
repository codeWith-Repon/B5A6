import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { landingData } from '@/data/landingData';

type Feature = { icon: React.ElementType; title: string; description: string };

function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto'>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className='p-6 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors'
          >
            <div className='w-10 h-10 rounded-md bg-secondary text-foreground flex items-center justify-center mb-4'>
              <Icon className='w-5 h-5' />
            </div>
            <h3 className='font-semibold text-base text-foreground mb-1.5'>
              {feature.title}
            </h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function RoleSpecificFeatures() {
  const riderFeatures = landingData.roleFeatures.rider;
  const driverFeatures = landingData.roleFeatures.driver;
  return (
    <section id='features' className='relative py-24'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-8'>
          <div className='inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-border text-xs font-medium text-muted-foreground'>
            Features
          </div>
          <h2 className='text-3xl md:text-4xl font-semibold tracking-tight text-foreground'>
            Built for everyone
          </h2>
          <p className='text-muted-foreground'>
            Whether you're looking to travel or earn, RideFlow has benefits for
            both riders and drivers.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue='riders' className='w-full max-w-5xl mx-auto'>
          <div className='flex justify-center mb-10'>
            <TabsList className='bg-secondary border border-border rounded-lg p-1 h-auto'>
              <TabsTrigger
                value='riders'
                className='px-6 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm transition-colors'
              >
                For Riders
              </TabsTrigger>

              <TabsTrigger
                value='drivers'
                className='px-6 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm transition-colors'
              >
                For Drivers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='riders' className='mt-0'>
            <FeatureGrid features={riderFeatures} />
            <div className='text-center mt-10'>
              <Button size='lg'>
                Book Your First Ride
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='drivers' className='mt-0'>
            <FeatureGrid features={driverFeatures} />
            <div className='text-center mt-10'>
              <Button size='lg'>
                Start Earning Today
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
