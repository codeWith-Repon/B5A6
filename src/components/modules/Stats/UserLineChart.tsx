import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

interface UserStatusData {
  week: string;
  active: number;
  inactive: number;
  blocked: number;
}

interface UserLineChartProps {
  data: UserStatusData[];
  isLoading?: boolean;
}

const UserLineChart = ({ data, isLoading }: UserLineChartProps) => {
  const defaultData: UserStatusData[] = [
    { week: 'Week 1', active: 100, inactive: 10, blocked: 4 },
    { week: 'Week 2', active: 150, inactive: 12, blocked: 9 },
    { week: 'Week 3', active: 120, inactive: 4, blocked: 16 },
    { week: 'Week 4', active: 110, inactive: 9, blocked: 20 },
  ];

  const chartData = data
    ?.map((item) => item.active > 0)
    .some((item) => item === true)
    ? data
    : defaultData;

  console.log(
    data?.map((item) => item.active > 0).some((item) => item === true)
  );

  const ChartSkeleton = () => (
    <div className='space-y-3'>
      <Skeleton className='h-8 w-32' />
      <Skeleton className='h-80 w-full' />
    </div>
  );

  return (
    <Card className='p-6 backdrop-blur-sm transition-all'>
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-semibold'>Weekly User Status</h3>
          <p className='text-sm text-muted-foreground'>
            Active, Inactive, and Blocked users per week
          </p>
        </div>

        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width='100%' height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient id='activeGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient
                  id='inactiveGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient
                  id='blockedGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor='var(--chart-3)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-3)'
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid stroke='var(--border)' strokeDasharray='3 3' />

              <XAxis
                dataKey='week'
                stroke='var(--muted-foreground)'
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke='var(--muted-foreground)'
                style={{ fontSize: '12px' }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'var(--muted)',
                  strokeWidth: 2,
                  strokeDasharray: '3 3',
                }}
              />

              <Legend
                wrapperStyle={{ color: 'var(--muted-foreground)' }}
                iconType='circle'
                verticalAlign='bottom'
                height={36}
              />

              <Line
                type='monotone'
                dataKey='active'
                name='Active'
                stroke='var(--chart-1)'
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
                fill='url(#activeGradient)'
              />
              <Line
                type='monotone'
                dataKey='inactive'
                name='Inactive'
                stroke='var(--chart-2)'
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
                fill='url(#inactiveGradient)'
              />
              <Line
                type='monotone'
                dataKey='blocked'
                name='Blocked'
                stroke='var(--chart-3)'
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
                fill='url(#blockedGradient)'
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default UserLineChart;
