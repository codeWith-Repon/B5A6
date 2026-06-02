import { Button } from '@/components/ui/button';
import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router';

const Unauthorized = () => {
  return (
    <div className='relative min-h-svh overflow-hidden flex items-center justify-center px-4'>
      <div className='aurora' aria-hidden />
      <div className='relative z-10 w-full max-w-md glass-strong rounded-3xl border border-border/40 shadow-2xl shadow-primary/10 p-8 md:p-10 text-center space-y-6'>
        <div className='mx-auto w-20 h-20 rounded-2xl gradient-brand-soft border border-primary/30 flex items-center justify-center'>
          <ShieldOff className='w-10 h-10 text-primary' />
        </div>
        <div>
          <h1 className='text-6xl font-extrabold tracking-tighter gradient-brand-text leading-none'>
            403
          </h1>
          <p className='mt-3 text-2xl font-bold text-foreground'>
            Access denied
          </p>
          <p className='mt-2 text-sm text-muted-foreground max-w-xs mx-auto'>
            You don't have permission to access this page. Try a different
            route or sign in with a different account.
          </p>
        </div>
        <Button asChild size='lg' className='w-full rounded-xl'>
          <Link to='/'>Back to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
