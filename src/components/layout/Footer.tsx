import {
  Car,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='relative mt-20 glass-strong border-t border-border/40'>
      <div className='container mx-auto px-4 relative'>
        {/* Main footer content - 4 columns */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 md:py-16'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='p-2 rounded-xl gradient-brand text-white shadow-lg shadow-primary/30'>
                <Car className='w-5 h-5' />
              </div>
              <span className='font-extrabold text-lg gradient-brand-text'>
                RideFlow
              </span>
            </div>
            <p className='text-foreground/60 text-sm leading-relaxed'>
              Revolutionizing urban mobility with safe, affordable, and reliable
              ride-sharing across Bangladesh and beyond.
            </p>
            <div className='space-y-3 pt-4'>
              <a
                href='tel:+8801731019621'
                className='flex items-center gap-3 text-foreground/70 hover:text-foreground transition-colors text-sm'
              >
                <Phone className='w-4 h-4 flex-shrink-0' />
                <span>+8801731-019621</span>
              </a>
              <a
                href='mailto:reponahmedd@gmail.com'
                className='flex items-center gap-3 text-foreground/70 hover:text-foreground transition-colors text-sm'
              >
                <Mail className='w-4 h-4 flex-shrink-0' />
                <span>reponahmedd@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Product Services */}
          <div className='space-y-4'>
            <h3 className='font-bold text-foreground text-lg'>Services</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  For Riders
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  For Drivers
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Intercity Rides
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Vehicle Rentals
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Cargo Delivery
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Safety Features
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className='space-y-4'>
            <h3 className='font-bold text-foreground text-lg'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Our Team
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Blog & News
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Press Kit
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Partnerships
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className='space-y-4'>
            <h3 className='font-bold text-foreground text-lg'>Resources</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#faq'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Help & Support
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-foreground/60 hover:text-primary text-sm transition-colors'
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <Separator className='bg-border/40' />

        {/* Bottom footer */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 py-8'>
          <p className='text-muted-foreground text-sm'>
            © {currentYear} RideFlow. All rights reserved.
          </p>

          {/* Social Links */}
          <div className='flex gap-3'>
            <a
              href='#'
              className='p-2.5 rounded-xl glass-subtle border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all'
              aria-label='Facebook'
            >
              <Facebook className='w-4 h-4' />
            </a>
            <a
              href='#'
              className='p-2.5 rounded-xl glass-subtle border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all'
              aria-label='Twitter'
            >
              <Twitter className='w-4 h-4' />
            </a>
            <a
              href='#'
              className='p-2.5 rounded-xl glass-subtle border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all'
              aria-label='LinkedIn'
            >
              <Linkedin className='w-4 h-4' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
