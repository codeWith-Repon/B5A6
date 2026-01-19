import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { landingData } from '@/data/landingData';
import { Link, useNavigate } from 'react-router';

const HeroSection = () => {
  const { title, subtitle, ctaSecondary, image } = landingData.hero;
  const navigate = useNavigate();

  return (
    <section className='relative h-[70vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0 z-0'>
        <img
          src={image}
          alt='Hero Background'
          className='h-full w-full object-cover'
        />
        <div className='absolute inset-0 bg-slate-900/50' />
        <div className='absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 container px-4 md:px-6 text-center space-y-8 max-w-4xl mx-auto'>
        <div className='space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-lg'>
            {title}
          </h1>
          <p className='text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed'>
            {subtitle}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200'>
          <Button
            size='lg'
            onClick={() => navigate('/get-ride')}
            className=' bg-primary border-primary text-white duration-300 cursor-pointer text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all border hover:bg-primary/20 hover:text-white'
          >
            Get Ride
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='text-lg px-8 h-14 rounded-full bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white backdrop-blur-sm'
          >
            <Link to='/driver/register'>{ctaSecondary}</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50'>
        <ChevronDown className='h-10 w-10' />
      </div>
    </section>
  );
};

export default HeroSection;
