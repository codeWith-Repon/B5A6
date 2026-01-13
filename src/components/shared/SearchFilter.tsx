import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useState, useTransition } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
}

const SearchFilter = ({
  placeholder = 'Search...',
  paramName = 'searchTerm',
}: SearchFilterProps) => {
  const [isPending, startTransition] = useTransition();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || '');
  const debouncedValue = useDebounce(value, 500);
  const navigate = useNavigate();

  useEffect(() => {
    setValue(searchParams.get(paramName) || '');
  }, [searchParams, paramName]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const initialValue = searchParams.get(paramName) || '';

    if (debouncedValue === initialValue) {
      return;
    }

    if (debouncedValue) {
      params.set(paramName, debouncedValue);
      params.set('page', '1');
    } else {
      params.delete(paramName);
      params.delete('page');
    }

    startTransition(() => {
      navigate(`?${params.toString()}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, paramName, navigate]);

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder={placeholder}
        className='pl-10'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
    </div>
  );
};
export default SearchFilter;
