import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OurServicesSubTabs from './OurServicesSubTabs';
import { mainTabs } from '@/constants/serviceData';


export default function OurServicesTabs() {
  return (
    <Tabs defaultValue='tab-1' className='items-start'>
      <TabsList className='h-auto rounded-none border-b bg-transparent p-0 flex gap-16'>
        {mainTabs.map((tab) => (
          <TabsTrigger
            value={tab.value}
            key={tab.value}
            className='group data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-2xl text-foreground flex flex-col gap-1 items-center cursor-pointer hover:text-primary transition-all duration-300 '
          >
            <span>
              <img src={tab.icon} alt='' />
            </span>
            <p className='group-data-[state=active]:text-primary  transition duration-300'>
              {tab.label}
            </p>
          </TabsTrigger>
        ))}
      </TabsList>

      {mainTabs.map((tab) => (
        <TabsContent value={tab.value} key={tab.value}>
          <OurServicesSubTabs data={tab.content} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
