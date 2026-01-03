import { Shield, Zap, Lightbulb, Users, TrendingUp, Lock } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    description:
      'We prioritize the safety of every rider and driver. Continuous security checks, verified profiles, and 24/7 monitoring ensure every ride is secure.',
  },
  {
    icon: Zap,
    title: 'Reliability',
    description:
      'Our platform is built on trust. Consistent service, on-time arrivals, and transparent communication make RideHub your dependable choice.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We continuously evolve our technology to improve user experience. AI-powered matching, real-time tracking, and smart pricing drive our platform forward.',
  },
  {
    icon: Users,
    title: 'Community Focus',
    description:
      'We believe in building strong communities. Supporting local drivers and engaging with riders helps us create lasting positive impact.',
  },
  {
    icon: TrendingUp,
    title: 'Sustainability',
    description:
      "We're committed to reducing carbon footprint. Green vehicle incentives and eco-friendly practices shape our sustainable future.",
  },
  {
    icon: Lock,
    title: 'Transparency',
    description:
      'Clear pricing, honest ratings, and open communication build trust. We believe in operating with complete transparency.',
  },
];

export function CoreValuesSection() {
  return (
    <section className='py-20 bg-gradient-to-b from-background to-muted-foreground/20'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
            Our Core Values
          </h2>
          <p className='text-lg text-foreground/70'>
            The principles that guide us every day
          </p>
        </div>

        {/* Values Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className='group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300'
              >
                {/* Icon */}
                <div className='w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors'>
                  <Icon className='w-7 h-7 text-primary' />
                </div>

                {/* Title */}
                <h3 className='text-xl font-bold text-foreground mb-3'>
                  {value.title}
                </h3>

                {/* Description */}
                <p className='text-foreground/70 text-sm leading-relaxed'>
                  {value.description}
                </p>

                {/* Accent line */}
                <div className='w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded mt-6 opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
