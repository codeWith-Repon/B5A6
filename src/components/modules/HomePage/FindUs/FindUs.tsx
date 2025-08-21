import { findUs } from '@/assets';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const FindUs = () => {
  return (
    <div className='mt-20 mb-20 flex items-center'>
      <div className='w-80 mr-20'>
        <img
          src={findUs}
          alt=''
          className='rounded-full border-10 border-white'
        />
      </div>
      <div className='max-w-[600px]'>
        <h1 className='text-4xl font-bold mb-6'>This is FindUs component</h1>
        <p className='text-2xl mb-6'>
          We’re available in 23+ cities across Bangladesh. Book an uber and
          we’ll take you there.
        </p>
        <Button className='primary rounded-bl-[20px] rounded-tl-none'>
          <Link to='/'>View all Cities</Link>
        </Button>
      </div>
    </div>
  );
};

export default FindUs;
