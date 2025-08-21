import HeroSection from '@/components/modules/HomePage/hero/HeroSection';
import OurServices from '@/components/modules/HomePage/ourServices/OurServices';


const HomePage = () => {
  return (
    <div className='container mx-auto max-w-7xl flex flex-col gap-7'>
      <HeroSection />
      <OurServices />
    </div>
  );
};

export default HomePage;
