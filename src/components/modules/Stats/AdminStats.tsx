import { useUserDriverStatsQuery } from '@/redux/features/Stats/stats.api';
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

  const { data: barData, isLoading } = useUserDriverStatsQuery({
    month: month ? Number(month) : undefined,
    year: year ? Number(year) : new Date().getFullYear(),
    status: status ?? undefined,
  });

  const data = barData?.data?.stats;


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
      <div className='w-full'>
        <DashboardStatCards />
      </div>
      <DashboardFilter />
      <UserDriverBarChart data={data} isLoading={isLoading} />
      <UserLineChart />
    </div>
  );
};

export default AdminStats;
