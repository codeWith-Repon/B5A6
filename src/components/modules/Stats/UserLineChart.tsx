import { useMonthlyUserStatsQuery } from '@/redux/features/Stats/stats.api';
import { LoaderCircle } from 'lucide-react';
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

export default function UserLineChart() {
  const { data: userStatsData, isLoading } =
    useMonthlyUserStatsQuery(undefined);
  const data = userStatsData?.data?.stats;
  console.log(userStatsData?.data?.stats);
  return (
    <div className='w-full  h-[400px] bg-secondary rounded-xl shadow px-3 py-6'>
      {isLoading ? (
        <div className='flex justify-center items-center w-full h-full'>
          <LoaderCircle className='animate-spin' />
        </div>
      ) : (
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='week' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='active'
              name='Active Users'
              stroke='#8884d8'
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
