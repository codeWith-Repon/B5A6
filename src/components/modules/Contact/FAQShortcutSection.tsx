import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FAQShortcutSection() {
  return (
    <section className='py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-y border-border'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
          <div className='text-center space-y-6'>
            {/* Icon */}
            <div className='flex justify-center'>
              <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
                <HelpCircle className='w-8 h-8 text-primary' />
              </div>
            </div>

            {/* Content */}
            <div className='space-y-3'>
              <h2 className='text-3xl font-bold text-foreground'>
                Have a Quick Question?
              </h2>
              <p className='text-lg text-foreground/70 max-w-xl mx-auto'>
                Most common questions are answered in our FAQ section. Check it
                out before filling out the form to save time!
              </p>
            </div>

            {/* CTA Button */}
            <Button
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 flex items-center gap-2 mx-auto'
              asChild
            >
              <a href='/#faq'>
                View FAQ Section
                <ArrowRight className='w-5 h-5' />
              </a>
            </Button>

            {/* Additional Info */}
            <p className='text-sm text-foreground/60'>
              💡 Answers to booking, safety, payment, cancellation, and more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
