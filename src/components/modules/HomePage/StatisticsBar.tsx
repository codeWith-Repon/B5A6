import { landingData } from '@/data/landingData';

export function StatisticsBar() {
  const { stats } = landingData;

  return (
    <section
      id='statistics'
      className='py-20 bg-primary dark:bg-primary/20 text-primary-foreground'
    >
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 '>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='flex flex-col items-center text-center space-y-3'
              >
                <div className='p-3 rounded-full bg-primary-foreground/20'>
                  <Icon className='w-8 h-8' />
                </div>
                <div>
                  <h3 className='text-3xl md:text-4xl font-bold'>
                    {stat.value}
                  </h3>
                  <p className='font-semibold text-lg mt-1'>{stat.label}</p>
                  <p className='text-sm opacity-90 mt-1'>{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
