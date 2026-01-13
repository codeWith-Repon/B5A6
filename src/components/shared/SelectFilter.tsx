'use client';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useTransition } from 'react';

interface SelectFilterProps {
  paramName: string;
  placeholder?: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
}

const SelectFilter = ({
  paramName,
  placeholder,
  options,
  defaultValue = 'All',
}: SelectFilterProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentValue = searchParams.get(paramName) || defaultValue;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaultValue) {
      params.delete(paramName);
    } else if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    startTransition(() => {
      navigate(`?${params.toString()}`);
    });
  };

  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} className='cursor-pointer' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={defaultValue} className='cursor-pointer'>
          {defaultValue}
        </SelectItem>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className='cursor-pointer'
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default SelectFilter;
