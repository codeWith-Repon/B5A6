import { useUserDriverStatsQuery } from '@/redux/features/Stats/stats.api';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const UserDriverBarChart = () => {
  const { data: barData } = useUserDriverStatsQuery(undefined);
  const data = barData?.data?.stats;
  return (
    <div className='w-full  h-[400px] bg-secondary rounded-xl shadow px-3 py-6'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
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
          <Bar
            dataKey='users'
            fill='#8884d8'
            activeBar={<Rectangle fill='pink' stroke='blue' />}
          />
          <Bar
            dataKey='drivers'
            fill='#82ca9d'
            activeBar={<Rectangle fill='gold' stroke='purple' />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserDriverBarChart;
