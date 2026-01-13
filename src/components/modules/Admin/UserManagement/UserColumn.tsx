import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ShieldCheck, User, Car, ShieldAlert, Crown } from 'lucide-react';
import type { Column } from '@/components/shared/ManagementTable';
import type { IUser } from '@/types/user.types';

const userStatusConfig: Record<
  string,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  }
> = {
  ACTIVE: {
    variant: 'default',
    className: 'bg-emerald-500 hover:bg-emerald-600 border-none',
  },
  INACTIVE: {
    variant: 'secondary',
    className: 'bg-slate-200 text-slate-700',
  },
  BLOCKED: {
    variant: 'destructive',
  },
};

export const userColumns: Column<IUser>[] = [
  {
    header: 'User Profile',
    accessor: (row) => (
      <div className='flex items-center gap-3'>
        <Avatar className='h-9 w-9 border'>
          <AvatarImage
            src={row.image}
            alt={row.name}
            className='object-cover'
          />
          <AvatarFallback className='bg-primary/10 text-primary text-xs font-bold'>
            {row.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <div className='flex items-center gap-1'>
            <p className='font-semibold text-sm leading-none'>{row.name}</p>
            {row.isVerified && (
              <span title='Verified User' className='flex items-center'>
                <ShieldCheck className='h-3.5 w-3.5 text-blue-500' />
              </span>
            )}
          </div>
          <p className='text-xs text-muted-foreground mt-1'>{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    header: 'Role',
    accessor: (row) => {
      const isDriver = row.role === 'DRIVER';
      const isAdmin = row.role === 'ADMIN';
      const isSuperAdmin = row.role === 'SUPER_ADMIN';

      return (
        <div className='flex items-center gap-2'>
          {isSuperAdmin ? (
            <Crown className='h-4 w-4 text-red-600' />
          ) : isAdmin ? (
            <ShieldAlert className='h-4 w-4 text-purple-600' />
          ) : isDriver ? (
            <Car className='h-4 w-4 text-blue-600' />
          ) : (
            <User className='h-4 w-4 text-slate-600' />
          )}
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isSuperAdmin
                ? 'text-red-600'
                : isAdmin
                ? 'text-purple-600'
                : isDriver
                ? 'text-blue-600'
                : 'text-slate-600'
            }`}
          >
            {row.role}
          </span>
        </div>
      );
    },
    sortKey: 'role',
  },
  {
    header: 'Contact',
    accessor: (row) => (
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-medium'>{row.phone || 'No Phone'}</p>
        <p className='text-[10px] text-muted-foreground uppercase'>
          {row.address || 'N/A'}
        </p>
      </div>
    ),
  },
  {
    header: 'Verification',
    accessor: (row) => (
      <Badge
        variant={row.isVerified ? 'outline' : 'secondary'}
        className={
          row.isVerified
            ? 'border-blue-200 text-blue-700 bg-blue-50'
            : 'opacity-60'
        }
      >
        {row.isVerified ? 'Verified' : 'Unverified'}
      </Badge>
    ),
  },
  {
    header: 'Account Status',
    accessor: (row) => {
      const config =
        userStatusConfig[row.isActive as string] || userStatusConfig.INACTIVE;
      return (
        <Badge variant={config.variant} className={config.className}>
          {row.isActive}
        </Badge>
      );
    },
  },
  {
    header: 'Joined Date',
    accessor: (row) => (
      <div className='flex flex-col'>
        <span className='text-sm font-medium'>
          {format(new Date(row.createdAt), 'MMM dd, yyyy')}
        </span>
        <span className='text-[10px] text-muted-foreground'>
          {format(new Date(row.createdAt), 'hh:mm a')}
        </span>
      </div>
    ),
    sortKey: 'createdAt',
  },
];
