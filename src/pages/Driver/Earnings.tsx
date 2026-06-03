/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import {
  BarChart2,
  Car,
  Coins,
  DollarSign,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Navigate } from 'react-router';
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Skeleton } from '@/components/ui/skeleton';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useGetDriversQuery } from '@/redux/features/driver/driver.api';
import { useGetRideHistoryQuery } from '@/redux/features/ride/ride.api';
import { role } from '@/constants/role';
import type { IRide } from '@/types/ride.types';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(n);

const Earnings = () => {
  const { data: userInfo, isLoading: userLoading } = useUserInfoQuery(undefined);
  const isDriver = userInfo?.data?.role === role.driver;

  const { data: driverData } = useGetDriversQuery(
    { user: userInfo?.data?._id },
    { skip: !isDriver || !userInfo?.data?._id }
  );
  const { data: historyResponse, isLoading: historyLoading } =
    useGetRideHistoryQuery();

  const driver = driverData?.data?.[0];

  const rides = useMemo<IRide[]>(() => {
    const raw = (historyResponse as any)?.data;
    if (Array.isArray(raw)) return raw as IRide[];
    return [];
  }, [historyResponse]);

  const completedRides = useMemo(
    () => rides.filter((r) => r.rideStatus === 'COMPLETED'),
    [rides]
  );

  const stats = useMemo(() => {
    const total = completedRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    const last30Ms = 30 * 24 * 60 * 60 * 1000;
    const since30 = Date.now() - last30Ms;
    const last30 = completedRides.filter(
      (r) => new Date(r.completedAt || r.updatedAt).getTime() >= since30
    );
    const last30Total = last30.reduce((s, r) => s + (r.fare || 0), 0);
    const avgFare =
      completedRides.length > 0 ? total / completedRides.length : 0;
    return {
      total,
      last30Total,
      avgFare,
      count: completedRides.length,
      countLast30: last30.length,
    };
  }, [completedRides]);

  const chartData = useMemo(() => {
    // Last 7 calendar days, oldest → newest
    const days: { date: string; label: string; fare: number; rides: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        fare: 0,
        rides: 0,
      });
    }
    completedRides.forEach((r) => {
      const completed = new Date(r.completedAt || r.updatedAt);
      completed.setHours(0, 0, 0, 0);
      const key = completed.toISOString().slice(0, 10);
      const hit = days.find((d) => d.date === key);
      if (hit) {
        hit.fare += r.fare || 0;
        hit.rides += 1;
      }
    });
    return days;
  }, [completedRides]);

  if (userLoading) {
    return <Skeleton className='h-64 w-full rounded-xl' />;
  }
  if (!userInfo?.success || !isDriver) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2'>
          <Coins className='w-6 h-6 text-primary' />
          Earnings
        </h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Track what you've earned and how your last week stacks up.
        </p>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        <StatTile
          icon={<DollarSign className='w-4 h-4' />}
          label='Total earned'
          value={formatCurrency(driver?.totalEarnings ?? stats.total)}
        />
        <StatTile
          icon={<TrendingUp className='w-4 h-4' />}
          label='Last 30 days'
          value={formatCurrency(stats.last30Total)}
          sub={`${stats.countLast30} rides`}
        />
        <StatTile
          icon={<Car className='w-4 h-4' />}
          label='Lifetime rides'
          value={String(driver?.totalRides ?? stats.count)}
          sub={`avg ${formatCurrency(stats.avgFare)} / ride`}
        />
        <StatTile
          icon={<Star className='w-4 h-4' />}
          label='Driver rating'
          value={
            driver?.rating
              ? `${driver.rating.toFixed(2)} ★`
              : '—'
          }
          sub={
            driver?.ratingCount
              ? `${driver.ratingCount} ratings`
              : 'No ratings yet'
          }
        />
      </div>

      <section className='bg-card border border-border rounded-xl p-5'>
        <header className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <BarChart2 className='w-4 h-4 text-muted-foreground' />
            <h2 className='text-sm font-semibold text-foreground'>
              Earnings by day · last 7 days
            </h2>
          </div>
        </header>
        {historyLoading ? (
          <Skeleton className='h-64 w-full rounded-md' />
        ) : (
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='var(--color-border)'
                />
                <XAxis
                  dataKey='label'
                  stroke='var(--color-muted-foreground)'
                  fontSize={12}
                />
                <YAxis
                  stroke='var(--color-muted-foreground)'
                  fontSize={12}
                  tickFormatter={(v: number) => formatCurrency(v)}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
                  contentStyle={{
                    background: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Bar
                  dataKey='fare'
                  fill='var(--color-primary)'
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className='bg-card border border-border rounded-xl'>
        <header className='flex items-center justify-between p-4 border-b border-border'>
          <h2 className='text-sm font-semibold text-foreground'>
            Recent completed rides
          </h2>
          <span className='text-xs text-muted-foreground tabular-nums'>
            {completedRides.length} rides
          </span>
        </header>
        {historyLoading ? (
          <div className='p-4 space-y-2'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        ) : completedRides.length === 0 ? (
          <p className='p-6 text-sm text-muted-foreground text-center'>
            No completed rides yet — your first earnings will appear here.
          </p>
        ) : (
          <ul className='divide-y divide-border'>
            {completedRides.slice(0, 12).map((r) => (
              <li
                key={r._id}
                className='flex items-center gap-3 p-3 text-sm'
              >
                <span className='flex-1 truncate text-foreground'>
                  {r.pickupLocation?.split(',')[0]} →{' '}
                  {r.dropLocation?.split(',')[0]}
                </span>
                <span className='text-xs text-muted-foreground tabular-nums'>
                  {new Date(r.completedAt || r.updatedAt).toLocaleDateString()}
                </span>
                <span className='font-semibold tabular-nums text-foreground w-24 text-right'>
                  {formatCurrency(r.fare || 0)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

function StatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className='bg-card border border-border rounded-xl p-4'>
      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
        {icon}
        {label}
      </div>
      <p className='mt-2 text-lg font-semibold text-foreground tabular-nums'>
        {value}
      </p>
      {sub && (
        <p className='text-xs text-muted-foreground tabular-nums mt-0.5'>
          {sub}
        </p>
      )}
    </div>
  );
}

export default Earnings;
