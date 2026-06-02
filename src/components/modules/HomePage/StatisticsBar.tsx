import { landingData } from '@/data/landingData';

export function StatisticsBar() {
  const { stats } = landingData;

  return (
    <section id='statistics' className='relative py-16'>
      <div className='container mx-auto px-4'>
        <div className='bg-card border border-border rounded-xl p-8 md:p-10'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-border'>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className='flex flex-col items-center text-center md:px-4 space-y-2'
                >
                  <div className='p-2 rounded-md bg-secondary text-muted-foreground'>
                    <Icon className='w-5 h-5' />
                  </div>
                  <div>
                    <h3 className='text-3xl md:text-4xl font-semibold tracking-tight text-foreground tabular-nums'>
                      {stat.value}
                    </h3>
                    <p className='font-medium text-sm mt-1 text-foreground'>
                      {stat.label}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
