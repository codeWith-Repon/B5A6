import { Button } from '@/components/ui/button';
import { landingData } from '@/data/landingData';
import { Apple, Download, Star } from 'lucide-react';

export function AppPromo() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='container px-4 mx-auto md:px-6 relative z-10'>
        <div className='glass-strong rounded-3xl p-8 md:p-16 border border-border/40 relative overflow-hidden'>
          <div className='absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl' />
          <div className='absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl' />

          <div className='relative grid md:grid-cols-2 gap-12 items-center'>
            <div className='order-2 md:order-1 relative flex justify-center'>
              <div className='relative w-[280px] h-[560px] rounded-[2.5rem] border-8 border-slate-800/80 shadow-2xl shadow-primary/20 overflow-hidden hover-lift'>
                <img
                  src={landingData.appPromo.image}
                  alt='App Screen'
                  className='w-full h-full object-cover'
                />
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl' />
              </div>
            </div>

            <div className='order-1 md:order-2 space-y-6'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-xs font-semibold text-primary uppercase tracking-widest'>
                Mobile App
              </div>
              <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
                <span className='gradient-brand-text'>
                  {landingData.appPromo.title}
                </span>
              </h2>
              <p className='text-lg text-muted-foreground max-w-lg leading-relaxed'>
                {landingData.appPromo.description}
              </p>
              <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                <Button
                  size='lg'
                  variant='outline'
                  className='flex items-center justify-center gap-2 rounded-full px-6 h-14 text-base'
                >
                  <Apple className='w-5 h-5' />
                  App Store
                </Button>
                <Button
                  size='lg'
                  className='flex items-center justify-center gap-2 rounded-full px-6 h-14 text-base'
                >
                  <Download className='w-5 h-5' />
                  Google Play
                </Button>
              </div>
              <div className='flex items-center gap-2 pt-2'>
                <div className='flex text-amber-400'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-current' />
                  ))}
                </div>
                <p className='text-sm text-muted-foreground'>
                  4.8 out of 5 (250K+ reviews)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
