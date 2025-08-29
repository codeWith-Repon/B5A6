import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <Loader2 className='animate-spin h-10 w-10 text-primary' />
    </div>
  );
};

export default Spinner;
