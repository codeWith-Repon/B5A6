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
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

const STATUS_FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Blocked', value: 'BLOCKED' },
];

const StartYear = 2025;
const CurrentYear = new Date().getFullYear();
const Years = Array.from({ length: CurrentYear - StartYear + 1 }, (_, index) =>
  String(CurrentYear - index)
);

const DashboardFilter = ({ isLoading }: { isLoading?: boolean }) => {
  const [searchParams] = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(
    searchParams.get('month') ?? String(new Date().getMonth() + 1)
  );
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get('year') ?? CurrentYear.toString()
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') ?? 'ALL'
  );

  const updateURL = useUpdateUrl();

  // Dynamically generate months based on selected year
  const Months = useMemo(() => {
    const maxMonth =
      Number(selectedYear) === CurrentYear ? new Date().getMonth() + 1 : 12;
    return Array.from({ length: maxMonth }, (_, index) => {
      const date = new Date(Number(selectedYear), index, 1);

      return {
        label: new Intl.DateTimeFormat('en-Us', { month: 'long' }).format(date),
        value: String(index + 1),
      };
    });
  }, [selectedYear]);

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
    <Card className='p-6 backdrop-blur-sm border border-border rounded-lg transition-all duration-300 hover:border-ring/20 bg-card text-card-foreground dark:bg-card dark:text-card-foreground'>
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold flex items-center gap-2 text-foreground'>
          <Calendar className='w-5 h-5 text-primary dark:text-primary' />
          Filters & Controls
        </h3>

        {/* Date Selectors */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Month */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-muted-foreground'>
              Month
            </label>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className='w-full bg-card border border-border text-card-foreground hover:bg-muted/10 transition-colors'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-card border border-border'>
                {Months.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className='cursor-pointer hover:bg-muted/20'
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-muted-foreground'>
              Year
            </label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className='w-full bg-card border border-border text-card-foreground hover:bg-muted/10 transition-colors'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-card border border-border'>
                {Years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className='cursor-pointer hover:bg-muted/20'
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
          <label className='block text-sm font-medium text-muted-foreground'>
            User Status
          </label>
          <Tabs value={statusFilter} onValueChange={handleStatusChange}>
            <TabsList className='grid w-full grid-cols-2 md:grid-cols-4 border border-border bg-card'>
              {STATUS_FILTERS.map((filter) => (
                <TabsTrigger
                  key={filter.value}
                  value={filter.value}
                  className='cursor-pointer data-[state=active]:border-b-2 data-[state=active]:border-primary text-card-foreground hover:bg-muted/20'
                >
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <div className='animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full' />
            Loading charts...
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardFilter;
