import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { carouselData } from '@/constants/CarouselData';

export function WhyChooseUs() {
  return (
    <div className='container mx-auto mt-15'>
      <h1 className='text-4xl font-bold mb-15 text-center'>
        Safety and comfort, wherever you go
      </h1>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent>
          {carouselData.map((carousel) => (
            <CarouselItem
              key={carousel.id}
              className='md:basis-1/2 lg:basis-1/3'
            >
              <div className='p-1'>
                <Card className='rounded-[40%] overflow-hidden  p-0'>
                  <CardContent className='flex items-center justify-center p-0'>
                    <div className='relative before:absolute before:inset-0 before:bg-black/50 before:z-0 before:w-[300px] before:h-[300px] before:rounded-[40%] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2'>
                      <img src={carousel.img} alt={carousel.title} />
                      <div className='absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <h3 className='text-xl/tight tracking-tight  font-bold text-white mb-1'>
                          {carousel.title}
                        </h3>
                        <p className='text-sm text-white'>
                          {carousel.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='md:hidden flex' />
        <CarouselNext className='md:hidden flex' />
      </Carousel>
    </div>
  );
}
