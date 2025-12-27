import React from 'react';
import { motion } from 'framer-motion';
import { Car, type LucideIcon } from 'lucide-react';

interface LoaderProps {
  fullPage?: boolean;
  text?: string;
  icon?: LucideIcon;
  iconSize?: number;
  animate?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  fullPage = false,
  text = 'Processing...',
  icon: Icon = Car,
  iconSize = 44,
  animate = true,
}) => {
  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md'
    : 'flex flex-col items-center justify-center p-10 w-full h-full min-h-[250px]';

  return (
    <div className={containerClasses}>
      <div className='relative flex flex-col items-center justify-center w-[135px] h-[135px]'>
        {/* Counter-Rotating Circles: Only shown when animate is false */}
        {!animate && (
          <div className='absolute inset-0 flex items-center justify-center'>
            {/* Outer Circle - Clockwise */}
            <motion.div
              className='absolute rounded-full border-t-2 border-primary'
              style={{ width: iconSize * 2.2, height: iconSize * 2.2 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner Circle - Counter Clockwise */}
            <motion.div
              className='absolute rounded-full border-b-2 border-primary/30'
              style={{ width: iconSize * 1.8, height: iconSize * 1.8 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {/* Icon Container */}
        <motion.div
          animate={
            animate
              ? {
                  y: [0, -2, 0, -2, 0],
                  x: [-3, 3, -3],
                  rotate: [0, 1, -1, 0],
                }
              : {} // Static when animate is false
          }
          transition={{
            duration: 0.4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className='text-primary z-10'
        >
          <Icon size={iconSize} strokeWidth={1.5} />
        </motion.div>

        {/* Road Animation: Only shown when animate is true */}
        {animate && (
          <div className='absolute bottom-12 w-28 h-[2px] bg-muted overflow-hidden'>
            <motion.div
              animate={{ x: [0, -100] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              className='absolute inset-0 flex gap-4 w-[300%]'
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='h-full w-8 bg-primary/40 rounded-full'
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Message Section */}
      <div
        className={`flex flex-col items-center gap-1  ${
          animate ? '-mt-10' : ' -mt-[14px]'
        }`}
      >
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className='text-sm font-bold tracking-[0.2em] uppercase text-primary text-center px-4'
        >
          {text}
        </motion.p>
        <span className='text-[10px] text-muted-foreground font-medium animate-pulse'>
          Please wait a moment
        </span>
      </div>
    </div>
  );
};

export default Loader;
