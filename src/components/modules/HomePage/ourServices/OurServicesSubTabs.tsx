import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ISubTab } from '@/types';

export default function OurServicesSubTabs({
  data: servicesData,
}: {
  data: ISubTab[];
}) {
  return (
    <Tabs
      defaultValue='tab-1'
      orientation='vertical'
      className='w-full md:flex-row sm:flex-col  mt-9'
    >
      <TabsList className='flex-col gap-2 rounded-none border-l bg-transparent p-0 w-[700px]'>
        {servicesData.map((service: ISubTab) => (
          <TabsTrigger
            value={service.value}
            key={service.value}
            className=' data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-foreground hover:text-primary data-[state=active]:text-primary'
          >
            <div className='flex gap-4 w-full'>
              <img src={service.icon} alt='normal car' />
              <div className='text-start flex flex-col gap-2 '>
                <h4 className='font-bold md:text-2xl sm:text-xl '>
                  {service.title}
                </h4>
                <p className=''>{service.description}</p>
              </div>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className='grow rounded-md  text-start w-full'>
        {servicesData.map((service) => (
          <TabsContent
            value={service.value}
            key={service.value}
            className='flex justify-center'
          >
            <div className='lg:w-[542px] md:w-[466px] h-[280px] lg:ml-0 md:ml-[90px]'>
              <img src={service.image} alt='' className='h-full w-full' />
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
