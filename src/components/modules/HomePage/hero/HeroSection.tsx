import { heroImage } from '@/assets';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import GetRideModal from '../../Rider/GetRideModal';

interface HeroSectionProps {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
}

const HeroSection = ({
  heading = 'Book Rides Easily with Comfort & Safety',
  description = 'A reliable ride booking platform built with modern technology. Riders can quickly book trips, drivers can manage rides, and everything runs smoothly with secure payments.',
}: HeroSectionProps) => {
  return (
    <section className='relative flex items-center justify-center min-h-screen'>
      <div className='absolute inset-0 bg-black opacity-40 -z-9'></div>
      <div className='absolute top-0 left-0 w-full h-full -z-10 overflow-hidden'>
        <img
          src={heroImage.hero}
          alt=''
          className='w-full h-full object-cover'
        />
      </div>

      <div className='container mx-auto text-center flex flex-col items-center justify-center'>
        <div className='mx-auto flex max-w-5xl flex-col gap-3'>
          <h1 className='text-3xl font-extrabold lg:text-6xl tracking-wide leading-tight text-white'>
            {heading}
          </h1>
          <p className='text-white text-balance lg:text-lg '>{description}</p>
        </div>

        <div className='mt-10 flex flex-wrap justify-center gap-4'>
          <Button
            asChild
            size='lg'
            className=' border bg-primary border-primary text-white hover:bg-white hover:text-black transition-colors duration-300'
          >
            <GetRideModal />
          </Button>
          <Button
            asChild
            size='lg'
            className='border bg-transparent border-primary text-white hover:bg-primary hover:text-white transition-colors duration-500'
          >
            <Link to='/driver/register'>Become A Driver</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
