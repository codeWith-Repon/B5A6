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
    <section className='relative py-24'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-10'>
          <div className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border text-xs font-medium text-muted-foreground'>
            <Zap className='w-3 h-3' />
            Special offers
          </div>
          <h2 className='text-3xl md:text-4xl font-semibold tracking-tight text-foreground'>
            Exclusive deals for you
          </h2>
          <p className='text-muted-foreground'>
            Save more with our limited-time promotions and special offers.
          </p>
        </div>

        {/* Carousel */}
        <div className='max-w-3xl mx-auto'>
          <div className='relative bg-card border border-border rounded-xl p-8 md:p-12 overflow-hidden'>
            <div className='absolute top-6 right-6 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Limited time
            </div>

            <div className='space-y-6'>
              <div className='space-y-2'>
                <h3 className='text-2xl md:text-3xl font-semibold tracking-tight text-foreground'>
                  {offer.title}
                </h3>
                <p className='text-muted-foreground'>{offer.description}</p>
              </div>

              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2'>
                <div className='flex-1 w-full'>
                  <p className='text-[11px] text-muted-foreground mb-2 uppercase tracking-wider font-medium'>
                    Promo code
                  </p>
                  <div className='bg-secondary border border-border rounded-md px-4 py-2.5 font-mono font-semibold text-base tracking-widest text-foreground'>
                    {offer.code}
                  </div>
                </div>
                <Button size='lg' className='w-full sm:w-auto'>
                  Claim now
                </Button>
              </div>

              <p className='text-xs text-muted-foreground'>
                Valid till end of month. T&amp;C apply.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-between mt-6'>
            <button
              onClick={prevSlide}
              className='p-2 rounded-md border border-border bg-background hover:bg-secondary transition-colors'
              aria-label='Previous offer'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>

            <div className='flex gap-1.5'>
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-primary w-6'
                      : 'bg-border w-1.5 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className='p-2 rounded-md border border-border bg-background hover:bg-secondary transition-colors'
              aria-label='Next offer'
            >
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
