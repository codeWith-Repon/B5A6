import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { vehicleTypeOptions } from '@/constants/VehicleType';

const vehicleSchema = z.object({
  brand: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  model: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  vehicleType: z.string(),

  vehicleLicense: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export function VehicleForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: '',
      model: '',
      vehicleType: '',
      vehicleLicense: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof vehicleSchema>) => {
    console.log(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Register vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
                id='vehicle-form'
              >
                <FormField
                  control={form.control}
                  name='brand'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder='brand' {...field} />
                      </FormControl>
                      <FormDescription className='sr-only'>
                        brand name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='model'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder='model' {...field} />
                      </FormControl>
                      <FormDescription className='sr-only'>
                        model name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='vehicleType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a vehicle type.' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleTypeOptions.map((vehicleType) => (
                            <SelectItem
                              value={vehicleType.value}
                              key={vehicleType.value}
                            >
                              {vehicleType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className='sr-only'>
                        vehicle type.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='vehicleLicense'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle License</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription className='sr-only'>
                        vehicle license.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <Button
              type='submit'
              form='vehicle-form'
              className='w-full cursor-pointer'
            >
              Register Vehicle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
