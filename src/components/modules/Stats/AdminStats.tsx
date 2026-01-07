import DashboardFilter from './DashboardFilter';
import DashboardStatCards from './DashboardStatCards';
import UserDriverBarChart from './userDriverBarChart';
import UserLineChart from './UserLineChart';

const AdminStats = () => {
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
      <div className='flex flex-col lg:flex-row gap-4'>
        <UserDriverBarChart />
        <UserLineChart />
      </div>
    </div>
  );
};

export default AdminStats;
