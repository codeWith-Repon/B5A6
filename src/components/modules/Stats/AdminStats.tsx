import UserDriverBarChart from './userDriverBarChart';
import UserLineChart from './UserLineChart';

const AdminStats = () => {
  return (
    <div className='flex flex-col lg:flex-row gap-4'>
      <UserDriverBarChart />
      <UserLineChart />
    </div>
  );
};

export default AdminStats;
