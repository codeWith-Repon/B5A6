import Banner from '@/components/modules/HomePage/Banner/Banner';
import FindUs from '@/components/modules/HomePage/FindUs/FindUs';
import HeroSection from '@/components/modules/HomePage/hero/HeroSection';
import OurServices from '@/components/modules/HomePage/ourServices/OurServices';
import { WhyChooseUs } from '@/components/modules/HomePage/WhyChooseUs/WhyChooseUs';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <div className='container mx-auto max-w-7xl flex flex-col gap-7'>
        <OurServices />
        <WhyChooseUs />
      </div>
      <Banner />
      <div className='container mx-auto max-w-7xl flex flex-col gap-7'>
        <FindUs />
      </div>
    </>
  );
};

export default HomePage;
