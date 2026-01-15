import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

interface UserDriverBarChartProps {
  data: {
    week: string;
    users: number;
    drivers: number;
  }[];
  isLoading?: boolean;
}

const UserDriverBarChart = ({ data, isLoading }: UserDriverBarChartProps) => {
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
          <h3 className='text-lg font-semibold'>Weekly Users</h3>
          <p className='text-sm text-muted-foreground'>
            Number of users and drivers per week
          </p>
        </div>

        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width='100%' height={350}>
            <BarChart data={data}>
              <defs>
                <linearGradient id='usersGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.9}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.3}
                  />
                </linearGradient>

                <linearGradient
                  id='driversGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.9}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.3}
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
                cursor={{ fill: 'var(--muted)' }}
              />

              <Legend />

              <Bar
                dataKey='users'
                fill='url(#usersGradient)'
                name='Users'
                radius={[8, 8, 0, 0]}
              />

              <Bar
                dataKey='drivers'
                fill='url(#driversGradient)'
                name='Drivers'
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default UserDriverBarChart;
