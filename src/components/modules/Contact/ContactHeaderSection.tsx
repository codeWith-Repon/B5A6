import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function ContactHeaderSection() {
  return (
    <section className='py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background border-b border-border'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto text-center space-y-5'>
          {/* Main Heading */}
          <div className='space-y-3'>
            <h1 className='text-4xl md:text-5xl font-bold text-foreground'>
              Get in Touch
            </h1>
            <p className='text-lg text-foreground/70'>
              Have a question or feedback? We'd love to hear from you. Reach out
              using the contact form below, and our team will get back to you
              within 24 hours.
            </p>
          </div>

          {/* Contact Info Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-5'>
            {/* Email */}
            <div className='space-y-2 '>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto'>
                <Mail className='w-6 h-6 text-primary' />
              </div>
              <h3 className='font-semibold text-foreground'>Email</h3>
              <p className='text-sm text-foreground/70'>
                <a
                  href='mailto:reponahmedd@gmail.com'
                  className='hover:text-primary transition-colors'
                >
                  reponahmedd@gmail.com
                </a>
              </p>
            </div>

            {/* Phone */}
            <div className='space-y-2'>
              <div className='w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mx-auto'>
                <Phone className='w-6 h-6 text-chart-2' />
              </div>
              <h3 className='font-semibold text-foreground'>Phone</h3>
              <p className='text-sm text-foreground/70'>
                <a
                  href='tel:+8801731019621'
                  className='hover:text-primary transition-colors'
                >
                  +880 173 101 9621
                </a>
              </p>
            </div>

            {/* Address */}
            <div className='space-y-2'>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto'>
                <MapPin className='w-6 h-6 text-primary' />
              </div>
              <h3 className='font-semibold text-foreground'>Address</h3>
              <p className='text-sm text-foreground/70'>
                Nageswari, Kurigram
                <br />
                Bangladesh
              </p>
            </div>

            {/* Business Hours */}
            <div className='space-y-2'>
              <div className='w-12 h-12 rounded-lg bg-chart-5/10 flex items-center justify-center mx-auto'>
                <Clock className='w-6 h-6 text-chart-5' />
              </div>
              <h3 className='font-semibold text-foreground'>Hours</h3>
              <p className='text-sm text-foreground/70'>
                24/7 Support
                <br />
                All Days
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
