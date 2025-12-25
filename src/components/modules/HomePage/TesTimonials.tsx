import { landingData } from '@/data/landingData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className='py-20 bg-slate-100 dark:bg-slate-900'>
      <div className='container px-4 mx-auto md:px-6'>
        <div className='text-center mb-10 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Loved by Thousands
          </h2>
          <p className='text-lg text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto'>
            Don't just take our word for it. Here's what our community has to
            say.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {landingData.testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className='bg-background border-border dark:bg-slate-800 dark:border-slate-700 shadow-lg hover:shadow-primary/10 transition-shadow duration-300 relative'
            >
              <Quote className='absolute top-4 right-4 h-8 w-8 text-slate-400 dark:text-slate-500 dark:opacity-50' />
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='h-12 w-12 border-2 border-primary/60 dark:border-primary/20'>
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className='font-semibold text-slate-900 dark:text-white'>
                    {testimonial.name}
                  </h4>
                  <p className='text-sm text-muted-foreground dark:text-slate-400'>
                    {testimonial.role}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex mb-2 text-amber-400'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-current' />
                  ))}
                </div>
                <p className='opacity-80 text-muted-foreground dark:text-slate-300 italic leading-relaxed'>
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
