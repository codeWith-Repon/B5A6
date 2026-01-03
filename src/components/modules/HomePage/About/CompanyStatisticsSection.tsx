import { Globe, Zap, TrendingUp, Award } from 'lucide-react';

const statistics = [
  {
    icon: Award,
    value: '6+ Month',
    label: 'In Service',
    description:
      'Serving the community since 2025 with dedication and excellence',
  },
  {
    icon: Globe,
    value: '1M+',
    label: 'KM Traveled',
    description: 'Over 1 million kilometers of safe, reliable transportation',
  },
  {
    icon: Zap,
    value: '290K+',
    label: 'Rides Completed',
    description:
      'Millions of journeys that changed lives and connected communities',
  },
  {
    icon: TrendingUp,
    value: '4.9/5',
    label: 'Average Rating',
    description:
      'Consistently delivering excellence in every ride and interaction',
  },
];

export function CompanyStatisticsSection() {
  return (
    <section className='py-20 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold'>Our Impact</h2>
          <p className='text-lg opacity-90'>
            Transforming mobility and impacting millions of lives
          </p>
        </div>

        {/* Statistics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='group text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300'
              >
                {/* Icon */}
                <div className='flex justify-center'>
                  <div className='w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
                    <Icon className='w-8 h-8' />
                  </div>
                </div>

                {/* Value */}
                <div>
                  <h3 className='text-4xl md:text-5xl font-bold'>
                    {stat.value}
                  </h3>
                  <p className='text-lg font-semibold mt-2 opacity-90'>
                    {stat.label}
                  </p>
                </div>

                {/* Description */}
                <p className='text-sm opacity-80 leading-relaxed'>
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom message */}
        <div className='text-center mt-16'>
          <p className='text-lg opacity-90 max-w-2xl mx-auto'>
            These numbers represent real people, real journeys, and real impact.
            Every statistic is a story of connection, progress, and trust in
            RideHub.
          </p>
        </div>
      </div>
    </section>
  );
}
