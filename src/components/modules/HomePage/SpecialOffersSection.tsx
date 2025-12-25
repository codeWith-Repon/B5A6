import { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { landingData } from '@/data/landingData';

export function SpecialOffersSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const offers = landingData.offers;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const offer = offers[currentSlide];

  return (
    <section className='py-20 bg-gradient-to-b from-primary/10 to-chart-2/10 '>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-10'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <Zap className='w-5 h-5 text-yellow-500 dark:text-white' />
            <span className='text-yellow-500 dark:text-white font-semibold text-sm'>
              SPECIAL OFFERS
            </span>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
            Exclusive Deals for You
          </h2>
          <p className='text-foreground/60 text-lg'>
            Save more with our limited-time promotions and special offers.
          </p>
        </div>

        {/* Carousel */}
        <div className='max-w-3xl mx-auto'>
          <div
            className={`bg-gradient-to-br ${offer.color} rounded-2xl p-8 md:p-12 text-white shadow-2xl transition-all duration-300`}
          >
            <div className='space-y-6'>
              {/* Content */}
              <div>
                <h3 className='text-3xl md:text-4xl font-bold mb-3'>
                  {offer.title}
                </h3>
                <p className='text-lg opacity-90'>{offer.description}</p>
              </div>

              {/* Code and CTA */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4'>
                <div className='flex-1'>
                  <p className='text-sm opacity-75 mb-2'>Use code:</p>
                  <div className='bg-white/20 rounded-lg px-4 py-3 border border-white/30 font-mono font-bold text-lg'>
                    {offer.code}
                  </div>
                </div>
                <Button
                  size='lg'
                  className='bg-white text-foreground hover:bg-white/90 font-semibold px-8'
                >
                  Claim Now
                </Button>
              </div>

              {/* Expiry info */}
              <p className='text-sm opacity-75'>
                Valid till end of month. T&C apply.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-between mt-8'>
            <button
              onClick={prevSlide}
              className='p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors'
              aria-label='Previous offer'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>

            {/* Dots */}
            <div className='flex gap-2'>
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-primary w-8'
                      : 'bg-border w-2 hover:bg-border/70'
                  }`}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className='p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors'
              aria-label='Next offer'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
