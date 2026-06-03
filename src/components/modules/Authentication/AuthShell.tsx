import { Car } from 'lucide-react';
import { Link } from 'react-router';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className='relative min-h-svh overflow-hidden flex items-center justify-center px-4 py-10'>
      <div className='aurora' aria-hidden />
      <div className='relative z-10 w-full max-w-md flex flex-col items-center gap-6'>
        <Link
          to='/'
          className='group flex items-center gap-2 transition-opacity hover:opacity-90'
        >
          <div className='p-2 rounded-md bg-primary text-primary-foreground'>
            <Car className='w-5 h-5' />
          </div>
          <span className='font-semibold text-lg tracking-tight text-foreground'>
            RideFlow
          </span>
        </Link>
        <div className='w-full bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
              {title}
            </h1>
            {subtitle && (
              <p className='text-sm text-muted-foreground mt-1'>{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
