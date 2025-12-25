import { ContactHeaderSection } from '@/components/modules/Contact/ContactHeaderSection';
import { DeveloperShowcaseSection } from '@/components/modules/Contact/DevloperShowcaseSection';
import { FAQShortcutSection } from '@/components/modules/Contact/FAQShortcutSection';
import { InquiryFormSection } from '@/components/modules/Contact/InquiryFormSection';
import { MapPlaceholderSection } from '@/components/modules/Contact/MapPlaceholderSection';

const Contact = () => {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <ContactHeaderSection />

      <div className='container mx-auto px-4 py-15'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          <div className='lg:col-span-2 space-y-12'>
            <InquiryFormSection />
            <MapPlaceholderSection />
          </div>

          <div>
            <DeveloperShowcaseSection />
          </div>
        </div>
      </div>

      <FAQShortcutSection />
    </div>
  );
};

export default Contact;
