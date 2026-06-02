import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { landingData } from '@/data/landingData';

export function FAQSection() {
  const faqs = landingData.faq;

  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, faqs]);

  return (
    <section id='faq' className='relative py-24'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-xs font-semibold text-primary uppercase tracking-widest'>
            FAQ
          </div>
          <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            <span className='text-foreground'>Frequently Asked</span>{' '}
            <span className='gradient-brand-text'>Questions</span>
          </h2>
          <p className='text-muted-foreground text-lg'>
            Find answers to common questions about RideFlow services and how to
            use them.
          </p>
        </div>

        {/* Search */}
        <div className='max-w-2xl mx-auto mb-10'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search FAQs...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-3.5 rounded-2xl glass border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all'
            />
          </div>
        </div>

        {/* Accordion */}
        <div className='max-w-2xl mx-auto'>
          {filteredFaqs.length > 0 ? (
            <Accordion type='single' collapsible className='w-full space-y-3'>
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className='glass border border-border/40 rounded-2xl px-6 data-[state=open]:border-primary/40 data-[state=open]:shadow-xl data-[state=open]:shadow-primary/5 transition-all'
                >
                  <AccordionTrigger className='py-4 hover:no-underline hover:text-primary transition-colors'>
                    <span className='text-left font-semibold text-foreground'>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className='text-muted-foreground pb-4 pt-2 leading-relaxed'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className='text-center py-12 glass rounded-2xl border border-border/40'>
              <p className='text-muted-foreground text-lg'>
                No FAQs match your search. Try different keywords.
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className='max-w-2xl mx-auto mt-12 text-center'>
          <p className='text-muted-foreground mb-4'>
            Didn't find what you're looking for?
          </p>
          <a
            href='#contact'
            className='inline-flex items-center gap-1 text-primary font-semibold hover:underline transition-colors'
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
}
