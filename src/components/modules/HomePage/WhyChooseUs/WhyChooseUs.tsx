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
      <h1 className='md:text-4xl sm:text-2xl text-xl font-bold md:mb-20 sm:mb-10 mb-7 text-center'>
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
              className='md:basis-1/2 lg:basis-1/3  flex items-center justify-center'
            >
              <div className='p-1 md:w-full sm:w-[60%] w-[59%]'>
                <Card className='rounded-[40%] overflow-hidden  p-0'>
                  <CardContent className='flex items-center justify-center p-0'>
                    <div className='relative before:absolute before:inset-0 before:bg-black/50 before:z-0  before:w-[240px] xl:before:w-[300px] lg:before:w-[250px] md:before:w-[270px] sm:before:w-[280px] before:h-[240px] xl:before:h-[300px] lg:before:h-[250px] md:before:h-[270px] sm:before:h-[280px]  before:rounded-[40%] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2'>
                      <img src={carousel.img} alt={carousel.title} />
                      <div className='absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <h3 className='md:text-xl/tight text-base tracking-tight  font-bold text-white mb-1'>
                          {carousel.title}
                        </h3>
                        <p className='text-sm text-white sm:block hidden'>
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
        <CarouselPrevious className='md:hidden flex sm:left-[50px] left-[40px]' />
        <CarouselNext className='md:hidden flex sm:right-[50px] right-[40px]' />
      </Carousel>
    </div>
  );
}
