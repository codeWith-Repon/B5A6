import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Home, MapPinOff, Undo2 } from 'lucide-react';

const NotFound = () => {
  return (
    <div className='relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden px-4'>
      {/* Background "Dead End" Road Effect */}
      <div className='absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none'>
        <div className='absolute top-1/2 left-0 w-full h-[2px] bg-dashed border-t-4 border-dashed border-foreground' />
      </div>

      <div className='relative z-10 text-center'>
        {/* Animated 404 Text */}
        <motion.div className='relative inline-block'>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-muted/30 select-none'
          >
            404
          </motion.h1>

          {/* Floating Icon that "Crashed" */}
          <motion.div
            initial={{ x: -200, opacity: 0, rotate: -20 }}
            animate={{ x: 0, opacity: 1, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary'
          >
            <MapPinOff size={120} strokeWidth={1} className='drop-shadow-2xl' />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-[-2rem]'
        >
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Oops! You've gone off-route.
          </h2>
          <p className='mt-4 text-muted-foreground text-lg max-w-md mx-auto'>
            This destination doesn't exist in our map. Looks like the driver
            took a wrong turn or the bridge is out.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'
        >
          <Button
            asChild
            size='lg'
            className='px-8 h-12 text-md gap-2 shadow-lg hover:shadow-primary/20 transition-all'
          >
            <Link to='/'>
              <Home className='w-4 h-4' />
              Return Home
            </Link>
          </Button>

          <Button
            variant='outline'
            size='lg'
            className='px-8 h-12 text-md gap-2'
            onClick={() => window.history.back()}
          >
            <Undo2 className='w-4 h-4' />
            Go Back
          </Button>
        </motion.div>
      </div>

      {/* Decorative "Car" Driving Away (Hidden on mobile) */}
      <motion.div
        animate={{
          x: ['-100vw', '100vw'],
          y: [0, -5, 0, -5, 0], // Tiny suspension bounce
        }}
        transition={{
          x: { duration: 15, repeat: Infinity, ease: 'linear' },
          y: { duration: 0.5, repeat: Infinity },
        }}
        className='fixed bottom-20 left-0 text-primary/20 hidden md:block'
      >
        <div className='flex flex-col items-center gap-1'>
          <span className='text-[10px] font-bold uppercase tracking-widest'>
            Searching...
          </span>
          <svg
            width='60'
            height='30'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h2' />
            <circle cx='7' cy='17' r='2' />
            <circle cx='17' cy='17' r='2' />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
