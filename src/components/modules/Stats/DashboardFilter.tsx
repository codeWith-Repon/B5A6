import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateUrl } from '@/hooks/useUpdateUrl';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

const STATUS_FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Blocked', value: 'BLOCKED' },
];

const currentMonth = new Date().getMonth() + 1;
const Months = Array.from({ length: currentMonth }, (_, index) => {
  const date = new Date(new Date().getFullYear(), index, 1);
  return {
    label: new Intl.DateTimeFormat('en-Us', { month: 'long' }).format(date),
    value: String(index + 1),
  };
});

const StartYear = 2025;
const CurrentYear = new Date().getFullYear();
const Years = Array.from({ length: CurrentYear - StartYear + 1 }, (_, index) =>
  String(CurrentYear - index)
);

const DashboardFilter = ({ isLoading }: { isLoading?: boolean }) => {
  const [searchParams] = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(
    searchParams.get('month') ?? Months[Months.length - 1].value
  );
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get('year') ?? CurrentYear.toString()
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') ?? 'ALL'
  );

  const updateURL = useUpdateUrl();

  const handleMonthChange = (value: string) => {
    updateURL({
      month: value,
      year: selectedYear,
    });
    setSelectedMonth(value);
  };

  const handleYearChange = (value: string) => {
    updateURL({
      year: value,
      month: selectedMonth,
    });
    setSelectedYear(value);
  };

  const handleStatusChange = (value: string) => {
    if (value === 'ALL') {
      updateURL({
        status: '',
      });
    }
    if (value !== 'ALL') {
      updateURL({
        status: value,
      });
    }
    setStatusFilter(value);
  };

  return (
    <Card className='dark:border-slate-700/50 dark:bg-slate-900/40 backdrop-blur-sm p-6 dark:hover:border-slate-600/50 hover:border-slate-300 transition-all duration-300'>
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
          <Calendar className='w-5 h-5 dark:text-blue-400 text-blue-600' />
          Filters & Controls
        </h3>

        {/* Date Selectors */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium dark:text-slate-300'>
              Month
            </label>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className='dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800/70 hover:bg-slate-50 transition-colors w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='dark:bg-slate-800 dark:border-slate-700 '>
                {Months.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className='dark:text-slate-200 hover:bg-slate-700 cursor-pointer'
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium dark:text-slate-300'>
              Year
            </label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className='dark:bg-slate-800/50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800/70 hover:bg-slate-50 transition-colors w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='dark:bg-slate-800 dark:border-slate-700'>
                {Years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className='dark:text-slate-200 hover:bg-slate-700 cursor-pointer'
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium dark:text-slate-300'>
            User Status
          </label>
          <Tabs value={statusFilter} onValueChange={handleStatusChange}>
            <TabsList className='grid w-full grid-cols-2 md:grid-cols-4 dark:bg-slate-800/50 border dark:border-slate-700/50 border-slate-50'>
              {STATUS_FILTERS.map((filter) => (
                <TabsTrigger
                  key={filter.value}
                  value={filter.value}
                  className='dark:data-[state=active]:bg-blue-600/30 dark:data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 transition-all duration-200 cursor-pointer'
                >
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className='flex items-center gap-2 text-xs dark:text-slate-400'>
            <div className='animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full' />
            Loading charts...
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardFilter;
