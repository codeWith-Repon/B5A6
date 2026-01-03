import { ArrowRight, Users, Briefcase, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JoinTeamCTASection() {
  return (
    <section className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        {/* Main CTA Card */}
        <div className='max-w-3xl mx-auto'>
          <div className='relative rounded-3xl overflow-hidden'>
            {/* Background gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/30' />

            {/* Content */}
            <div className='relative px-8 md:px-12 py-16 md:py-20 space-y-8'>
              {/* Heading */}
              <div className='space-y-4'>
                <h2 className='text-4xl md:text-5xl font-bold text-white'>
                  Join Our Team
                </h2>
                <p className='text-xl text-white/90 leading-relaxed'>
                  We're looking for passionate individuals who want to
                  revolutionize mobility and make a real impact.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                <div className='space-y-3'>
                  <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center'>
                    <Heart className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='font-semibold text-white text-lg'>
                    Meaningful Work
                  </h3>
                  <p className='text-white/80 text-sm leading-relaxed'>
                    Contribute to a mission that improves millions of lives
                  </p>
                </div>

                <div className='space-y-3'>
                  <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center'>
                    <Users className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='font-semibold text-white text-lg'>
                    Great Culture
                  </h3>
                  <p className='text-white/80 text-sm leading-relaxed'>
                    Work with talented, collaborative, and driven teammates
                  </p>
                </div>

                <div className='space-y-3'>
                  <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center'>
                    <Briefcase className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='font-semibold text-white text-lg'>
                    Growth Opportunities
                  </h3>
                  <p className='text-white/80 text-sm leading-relaxed'>
                    Develop your skills and advance in a growing company
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Button className='bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-base'>
                  View Open Positions
                  <ArrowRight className='ml-2 w-5 h-5' />
                </Button>
                <Button
                  variant='outline'
                  className='border-white/50 text-black/70 hover:bg-white/10 font-semibold px-8 py-6 text-base'
                >
                  Contact Us
                </Button>
              </div>

              {/* Bottom text */}
              <p className='text-white/70 text-sm'>
                📧 Interested in partnering with RideHub? Email
                careers@ridehub.com
              </p>
            </div>
          </div>
        </div>

        {/* Additional CTA Options */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-16'>
          <div className='p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors text-center space-y-4'>
            <h3 className='text-lg font-bold text-foreground'>Engineering</h3>
            <p className='text-foreground/70 text-sm'>
              Build scalable systems that power millions of rides
            </p>
            <a
              href='#'
              className='inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm'
            >
              Learn More <ArrowRight className='w-4 h-4' />
            </a>
          </div>

          <div className='p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors text-center space-y-4'>
            <h3 className='text-lg font-bold text-foreground'>Operations</h3>
            <p className='text-foreground/70 text-sm'>
              Drive growth and efficiency across the platform
            </p>
            <a
              href='#'
              className='inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm'
            >
              Learn More <ArrowRight className='w-4 h-4' />
            </a>
          </div>

          <div className='p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors text-center space-y-4'>
            <h3 className='text-lg font-bold text-foreground'>Community</h3>
            <p className='text-foreground/70 text-sm'>
              Connect riders and drivers while building lasting relationships
            </p>
            <a
              href='#'
              className='inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm'
            >
              Learn More <ArrowRight className='w-4 h-4' />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
