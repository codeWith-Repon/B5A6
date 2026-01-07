import DashboardStatCards from './DashboardStatCards';
import UserDriverBarChart from './userDriverBarChart';
import UserLineChart from './UserLineChart';

const AdminStats = () => {
  return (
    <div className='flex flex-col  gap-4'>
      <div className='w-full'>
        <DashboardStatCards />
      </div>
      <div className='flex flex-col lg:flex-row gap-4'>
        <UserDriverBarChart />
        <UserLineChart />
      </div>
    </div>
  );
};

export default AdminStats;
