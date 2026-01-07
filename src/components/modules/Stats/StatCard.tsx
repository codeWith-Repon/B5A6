import { Card } from '@/components/ui/card';

export type ColorKey = 'blue' | 'amber' | 'green' | 'purple';

interface IStatCardProps {
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
}: IStatCardProps) => {
  const colorMap: Record<
    ColorKey,
    { bg: string; border: string; accent: string }
  > = {
    blue: {
      bg: 'bg-card dark:bg-card', 
      border: 'border-primary', 
      accent: 'text-primary', 
    },
    amber: {
      bg: 'bg-card dark:bg-card',
      border: 'border-secondary',
      accent: 'text-secondary',
    },
    green: {
      bg: 'bg-card dark:bg-card',
      border: 'border-green-500/20',
      accent: 'text-green-500',
    },
    purple: {
      bg: 'bg-card dark:bg-card',
      border: 'border-accent',
      accent: 'text-accent',
    },
  };

  const colors = colorMap[color];

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
          <p className='text-sm font-medium text-muted-foreground mb-2'>
            {title}
          </p>
          <p className='text-2xl sm:text-3xl font-bold text-foreground leading-tight'>
            {value}
          </p>
        </div>
        <div className={`flex-shrink-0 ml-2 ${colors.accent}`}>{icon}</div>
      </div>
      <p className='text-xs text-muted-foreground font-medium mt-2'>{change}</p>

      {/* Decorative blur circle */}
      <div
        className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-30 ${
          color === 'blue'
            ? 'bg-chart-1'
            : color === 'amber'
            ? 'bg-chart-2'
            : color === 'green'
            ? 'bg-chart-3'
            : 'bg-chart-4'
        }`}
      />
    </Card>
  );
};

export default StatCard;
