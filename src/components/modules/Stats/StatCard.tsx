import { Card } from '@/components/ui/card';
import { COLOR_MAP } from '@/constants/dashboard';

export type ColorKey = 'blue' | 'amber' | 'green' | 'purple';
interface IStateCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: ColorKey;
  onClick?: () => void;
  className?: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  color,
  onClick,
  className = '',
}: IStateCardProps) => {
    const colors = COLOR_MAP[color];
  return (
    <Card
      className={`relative overflow-hidden ${colors.border} ${
        colors.bg
      } border backdrop-blur-sm hover:border-opacity-100 border-opacity-40 transition-all duration-300 p-6 hover:shadow-lg hover:shadow-slate-900/50 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-slate-800/90 dark:text-slate-400 text-sm font-medium mb-2'>{title}</p>
          <p className='text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white leading-tight'>
            {value}
          </p>
        </div>
        <div className='flex-shrink-0 ml-2'>{icon}</div>
      </div>
      <p className='text-xs text-green-400 font-medium'>{change}</p>

      <div
        className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-80 bg-${color}-500`}
      />
    </Card>
  );
};

export default StatCard;
