import { AppPromo } from '@/components/modules/HomePage/AppPromo';
import { FAQSection } from '@/components/modules/HomePage/FAQSection';
import HeroSection from '@/components/modules/HomePage/HeroSection';
import { HowItWorksNewSection } from '@/components/modules/HomePage/HowItWork';
import { RoleSpecificFeatures } from '@/components/modules/HomePage/RoleSpecificFeaturesSection';
import { SafetyAndSOSSection } from '@/components/modules/HomePage/SaftyAndSOSSection';
import { ServicesSection } from '@/components/modules/HomePage/ServicesSection';
import { SpecialOffersSection } from '@/components/modules/HomePage/SpecialOffersSection';
import { StatisticsBar } from '@/components/modules/HomePage/StatisticsBar';
import { Testimonials } from '@/components/modules/HomePage/TesTimonials';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatisticsBar />
      <ServicesSection />
      <HowItWorksNewSection />
      <RoleSpecificFeatures />
      <SpecialOffersSection />
      <SafetyAndSOSSection />
      <Testimonials />
      <AppPromo />
      <FAQSection />
    </>
  );
};

export default HomePage;
