import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

const Faq = ({
  heading = 'Frequently Asked Questions',
  items = [
    {
      id: 'faq-1',
      question: 'How do I book a ride?',
      answer:
        'To book a ride, log in to your account, enter your pickup and drop-off locations, and confirm the ride request.',
    },
    {
      id: 'faq-2',
      question: 'Can I cancel a ride after booking?',
      answer:
        'Yes, you can cancel a ride from the “My Rides” section before the driver reaches your pickup location.',
    },
    {
      id: 'faq-3',
      question: 'How do I pay for my ride?',
      answer:
        'We support multiple payment methods including cash, credit/debit cards, and mobile payment gateways like SSLCommerz.',
    },
    {
      id: 'faq-4',
      question: 'What if I forget something in the car?',
      answer:
        'If you leave an item in the car, you can contact the driver directly from your ride history or report the issue through support.',
    },
    {
      id: 'faq-5',
      question: 'How is the fare calculated?',
      answer:
        'The fare is calculated based on distance, estimated travel time, and surge pricing during peak hours.',
    },
    {
      id: 'faq-6',
      question: 'Can I rate my driver?',
      answer:
        'Yes, after every ride you will be asked to rate your driver and provide feedback to improve service quality.',
    },
    {
      id: 'faq-7',
      question: 'Is my information secure?',
      answer:
        'Yes, we use secure authentication and encrypted storage to keep your personal and payment information safe.',
    },
  ],
}: Faq1Props) => {
  return (
    <section className='py-20'>
      <div className='container max-w-3xl mx-auto'>
        <h1 className='mb-4 text-3xl font-semibold md:mb-11 md:text-4xl'>
          {heading}
        </h1>
        <Accordion type='single' collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='font-semibold hover:no-underline'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
