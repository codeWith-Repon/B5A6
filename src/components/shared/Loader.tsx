import React from 'react';
import { motion } from 'framer-motion';
import { Car, type LucideIcon } from 'lucide-react';

interface LoaderProps {
  fullPage?: boolean;
  text?: string;
  icon?: LucideIcon; 
  iconSize?: number;
}

const Loader: React.FC<LoaderProps> = ({
  fullPage = false,
  text = 'Finding your ride...',
  icon: Icon = Car,
  iconSize = 48,
}) => {
  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md'
    : 'flex flex-col items-center justify-center p-10 w-full h-full min-h-[200px]';

  return (
    <div className={containerClasses}>
      <div className='relative flex flex-col items-center justify-center w-40 h-24'>
        
        {/* The "Running" Icon Logic */}
        <motion.div
          animate={{
            // Vibration/Engine Shake (Up and Down)
            y: [0, -2, 0, -2, 0],
            // Driving forward/backward movement
            x: [-5, 5, -5],
            // Subtle tilt like suspension
            rotate: [0, 1, -1, 0], 
          }}
          transition={{
            duration: 0.4, // Fast duration for "engine" feel
            repeat: Infinity,
            ease: 'linear',
          }}
          className='text-primary z-10 mb-[-8px]' 
        >
          <Icon size={iconSize} strokeWidth={1.5} />
        </motion.div>

        {/* The Road Line with High-Speed Movement */}
        <div className='w-32 h-[2px] bg-muted overflow-hidden relative'>
          {/* Animated Road Dash Lines */}
          <motion.div
            animate={{ x: [0, -100] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className='absolute inset-0 flex gap-4 w-[300%]'
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className='h-full w-8 bg-primary/40 rounded-full' />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Animated Loading Text */}
      <div className="flex flex-col items-center gap-1">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className='text-sm font-bold tracking-[0.2em] uppercase text-primary'
        >
          {text}
        </motion.p>
        <span className="text-[10px] text-muted-foreground font-medium animate-pulse">
          Please wait a moment
        </span>
      </div>
    </div>
  );
};

export default Loader;