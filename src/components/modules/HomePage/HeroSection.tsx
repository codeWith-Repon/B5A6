import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { landingData } from '@/data/landingData';
import { Link, useNavigate } from 'react-router';

const HeroSection = () => {
  const { subtitle, ctaSecondary, image } = landingData.hero;
  const navigate = useNavigate();

  return (
    <section className='relative h-[88vh] min-h-[640px] w-full overflow-hidden flex items-center justify-center text-white'>
      {/* Background image */}
      <div className='absolute inset-0 z-0'>
        <img
          src={image}
          alt='Hero Background'
          className='h-full w-full object-cover'
        />
        {/* solid dark base — always-readable text regardless of theme */}
        <div className='absolute inset-0 bg-slate-950/75' />
        {/* bottom fade into page */}
        <div className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background' />
      </div>

      {/* Content */}
      <div className='relative z-10 container px-4 md:px-6 text-center space-y-6 max-w-4xl mx-auto'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/90 backdrop-blur-sm'>
          <Sparkles className='w-3 h-3 text-white/80' />
          Smarter, safer rides
        </div>

        <div className='space-y-5'>
          <h1 className='text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance'>
            The future of mobility,{' '}
            <span className='text-white/60'>delivered.</span>
          </h1>
          <p className='text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed'>
            {subtitle}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 justify-center pt-2'>
          <Button
            size='lg'
            onClick={() => navigate('/get-ride')}
            className='gap-2'
          >
            Get a ride <ArrowRight className='w-4 h-4' />
          </Button>
          <Button
            asChild
            size='lg'
            className='bg-white/10 hover:bg-white/15 text-white border border-white/15'
          >
            <Link to='/driver/register'>{ctaSecondary}</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40'>
        <ChevronDown className='h-5 w-5 animate-bounce' />
      </div>
    </section>
  );
};

export default HeroSection;
