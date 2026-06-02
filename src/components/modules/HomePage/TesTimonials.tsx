import { landingData } from '@/data/landingData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className='relative py-24'>
      <div className='container px-4 mx-auto md:px-6'>
        <div className='text-center mb-12 space-y-4 max-w-2xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-xs font-semibold text-primary uppercase tracking-widest'>
            Testimonials
          </div>
          <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            <span className='text-foreground'>Loved by</span>{' '}
            <span className='gradient-brand-text'>Thousands</span>
          </h2>
          <p className='text-lg text-muted-foreground'>
            Don't just take our word for it. Here's what our community has to
            say.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {landingData.testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className='relative hover-lift hover:border-primary/40 transition-all duration-300 overflow-hidden'
            >
              <div className='absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl' />
              <Quote className='absolute top-5 right-5 h-7 w-7 text-primary/30' />
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='h-12 w-12 ring-2 ring-primary/40 ring-offset-2 ring-offset-background'>
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback className='gradient-brand text-white font-bold'>
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className='font-bold text-foreground'>
                    {testimonial.name}
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    {testimonial.role}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex mb-3 gap-0.5 text-amber-400'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-current' />
                  ))}
                </div>
                <p className='text-muted-foreground italic leading-relaxed'>
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
