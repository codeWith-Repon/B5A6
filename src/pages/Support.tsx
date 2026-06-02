import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';

const channels = [
  {
    icon: Mail,
    title: 'Email us',
    description: 'Get a response within 24 hours.',
    value: 'support@rideflow.app',
    href: 'mailto:support@rideflow.app',
  },
  {
    icon: Phone,
    title: 'Call support',
    description: '24/7 hotline for urgent issues.',
    value: '+880 1731-019621',
    href: 'tel:+8801731019621',
  },
  {
    icon: MessageCircle,
    title: 'Live chat',
    description: 'Chat with an agent right away.',
    value: 'Open chat',
    href: '#',
  },
];

const Support = () => {
  return (
    <div className='min-h-screen px-4 py-16'>
      <div className='container max-w-5xl mx-auto'>
        <div className='text-center space-y-4 mb-12'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-xs font-semibold text-primary uppercase tracking-widest'>
            Support
          </div>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            <span className='text-foreground'>Here to</span>{' '}
            <span className='gradient-brand-text'>help</span>
          </h1>
          <p className='text-muted-foreground text-lg max-w-xl mx-auto'>
            Pick the channel that suits you best — we'll get back fast.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Card
                key={channel.title}
                className='p-6 hover-lift hover:border-primary/40 transition-all'
              >
                <div className='w-12 h-12 rounded-xl gradient-brand-soft border border-primary/20 flex items-center justify-center mb-4'>
                  <Icon className='w-5 h-5 text-primary' />
                </div>
                <h3 className='text-lg font-bold text-foreground mb-1'>
                  {channel.title}
                </h3>
                <p className='text-sm text-muted-foreground mb-4'>
                  {channel.description}
                </p>
                <a
                  href={channel.href}
                  className='inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4'
                >
                  {channel.value} →
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Support;
