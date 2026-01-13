/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMonthlyUserStatsQuery,
  useUserDriverStatsQuery,
} from '@/redux/features/Stats/stats.api';
import DashboardFilter from './DashboardFilter';
import DashboardStatCards from './DashboardStatCards';
import UserDriverBarChart from './userDriverBarChart';
import UserLineChart from './UserLineChart';
import { useSearchParams } from 'react-router';
import { MOCK_DATA_MAP, STATUS_MOCK_LINE_DATA } from '@/data/StatsMockData';

const AdminStats = () => {
  const [searchParams] = useSearchParams();

  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const status = searchParams.get('status');

  const { data: barData, isLoading: barLoading } = useUserDriverStatsQuery({
    month,
    year,
    status,
  });

  const { data: lineData, isLoading: lineLoading } = useMonthlyUserStatsQuery({
    month,
    year,
    status,
  });

  const processChartData = (apiData: any, data: any) => {
    const actualStats = apiData?.data?.stats ?? [];
    const status = searchParams.get('status')?.toUpperCase() || 'DEFAULT';

    // Calculate total volume
    const totalVolume = actualStats.reduce(
      (acc: number, curr: any) => acc + (curr.users || 0) + (curr.drivers || 0),
      0
    );

    if (!barLoading && totalVolume < 10) {
      // Return specific mock data based on the current filter status
      return data[status] || data.DEFAULT;
    }

    return actualStats;
  };

  const barChartData = processChartData(barData, MOCK_DATA_MAP);
  const lineChartData = processChartData(lineData, STATUS_MOCK_LINE_DATA);

  return (
    <div className='flex flex-col  gap-4'>
      <div className='mb-3'>
        <h1 className='text-4xl font-bold dark:text-white mb-2'>
          Admin Dashboard
        </h1>
        <p className='text-lg text-muted-foreground'>
          Manage and monitor your ride-sharing platform operations
        </p>
      </div>
      {/* Stat Cards */}
      <section className='grid gap-6'>
        <DashboardStatCards />
      </section>

      {/* Filters */}
      <section className='w-full'>
        <DashboardFilter isLoading={barLoading} />
      </section>

      {/* Charts */}
      <section className='grid gap-6 md:grid-cols-2'>
        <UserDriverBarChart data={barChartData} isLoading={barLoading} />
        <UserLineChart data={lineChartData} isLoading={lineLoading} />
      </section>
    </div>
  );
};

export default AdminStats;
