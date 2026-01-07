import { Car, DollarSign, TrendingUp, User } from 'lucide-react';
import StatCard, { type ColorKey } from './StatCard';
import type { IStatCard } from '@/types/dashboard';

const stats: IStatCard[] = [
  {
    title: 'Total Users',
    value: '12,458',
    change: '+12.5% from last month',
    color: 'blue',
  },
  {
    title: 'Total Rides',
    value: '45,892',
    change: '+8.2% from last month',
    color: 'amber',
  },
  {
    title: 'Total Earnings',
    value: '$285,420',
    change: '+15.3% from last month',
    color: 'green',
  },
  {
    title: 'Active Drivers',
    value: '2,145',
    change: '+5.1% from last month',
    color: 'purple',
  },
];

const Stat_Icons = {
  0: <User className='w-8 h-8 text-chart-1 dark:text-chart-1' />,
  1: <Car className='w-8 h-8 text-chart-2 dark:text-chart-2' />,
  2: <DollarSign className='w-8 h-8 text-chart-3 dark:text-chart-3' />,
  3: <TrendingUp className='w-8 h-8 text-chart-4 dark:text-chart-4' />,
} as const;

const DashboardStatCards = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={Stat_Icons[index as keyof typeof Stat_Icons]}
          color={stat.color as ColorKey}
        />
      ))}
    </div>
  );
};

export default DashboardStatCards;
