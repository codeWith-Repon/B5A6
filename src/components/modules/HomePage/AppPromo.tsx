import { cubeImage } from '@/assets';
import { Button } from '@/components/ui/button';
import { landingData } from '@/data/landingData';
import { Apple, Download } from 'lucide-react';

export function AppPromo() {
  return (
    <section className='py-24  overflow-hidden relative'>
      <div
        className='absolute inset-0 opacity-30 pointer-events-none'
        style={{
          backgroundImage: `url(${cubeImage})`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className='container px-4 mx-auto md:px-6 relative z-10 '>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div className='order-2 md:order-1 relative flex justify-center'>
            <div className='relative w-[300px] h-[600px]  rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden'>
              <img
                src={landingData.appPromo.image}
                alt='App Screen'
                className='w-full h-full object-cover'
              />
              {/* Notch */}
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl' />
            </div>
          </div>

          <div className='order-1 md:order-2 space-y-5 text-slate-800 dark:text-white'>
            <h2 className='text-4xl md:text-5xl font-bold tracking-tight'>
              {landingData.appPromo.title}
            </h2>
            <p className='text-lg sm:text-xl text-muted-foreground/90 max-w-lg'>
              {landingData.appPromo.description}
            </p>
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Button className='flex items-center justify-center gap-2 bg-black hover:bg-black/90 text-white dark:bg-slate-300/30 font-semibold px-6 py-6 text-base'>
                <Apple className='w-5 h-5' />
                App Store
              </Button>
              <Button className='flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 font-semibold px-6 py-6 text-base'>
                <Download className='w-5 h-5' />
                Google Play
              </Button>
            </div>
            <div className='pt-4'>
              <p className='text-sm text-foreground/60'>
                ⭐ 4.8 out of 5 stars (250K+ reviews)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
