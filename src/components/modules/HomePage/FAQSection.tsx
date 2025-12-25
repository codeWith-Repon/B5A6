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
    <section id='faq' className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center space-y-4 mb-10'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
            Frequently Asked Questions
          </h2>
          <p className='text-foreground/60 text-lg'>
            Find answers to common questions about RideHub services and how to
            use them.
          </p>
        </div>

        {/* Search */}
        <div className='max-w-2xl mx-auto mb-10'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40' />
            <input
              type='text'
              placeholder='Search FAQs...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50'
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
                  className='border border-border rounded-lg px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-lg transition-all'
                >
                  <AccordionTrigger className='py-4 hover:no-underline hover:text-primary transition-colors'>
                    <span className='text-left font-semibold text-foreground'>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className='text-foreground/70 pb-4 pt-2'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className='text-center py-12'>
              <p className='text-foreground/60 text-lg'>
                No FAQs match your search. Try different keywords.
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className='max-w-2xl mx-auto mt-12 text-center'>
          <p className='text-foreground/70 mb-4'>
            Didn't find what you're looking for?
          </p>
          <a
            href='#contact'
            className='text-primary font-semibold hover:underline transition-colors'
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
}
