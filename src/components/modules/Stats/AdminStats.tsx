import {
  useMonthlyUserStatsQuery,
  useUserDriverStatsQuery,
} from '@/redux/features/Stats/stats.api';
import DashboardFilter from './DashboardFilter';
import DashboardStatCards from './DashboardStatCards';
import UserDriverBarChart from './userDriverBarChart';
import UserLineChart from './UserLineChart';
import { useSearchParams } from 'react-router';

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

  const barChartData = barData?.data?.stats ?? [];
  const lineChartData = lineData?.data?.stats ?? [];

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
