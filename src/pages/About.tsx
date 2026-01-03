import { BrandStoryHeroSection } from '@/components/modules/HomePage/About/BrandStory';
import { CompanyStatisticsSection } from '@/components/modules/HomePage/About/CompanyStatisticsSection';
import { CoreValuesSection } from '@/components/modules/HomePage/About/CoreValuesSection';
import { JoinTeamCTASection } from '@/components/modules/HomePage/About/JoinTeamCTASection';

const About = () => {
  return (
    <div>
      <BrandStoryHeroSection />
      <CoreValuesSection />
      <CompanyStatisticsSection />
      <JoinTeamCTASection />
    </div>
  );
};

export default About;
