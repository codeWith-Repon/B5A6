/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAllSosQuery,
  useUpdateSosStatusMutation,
  type ISosReport,
} from '@/redux/features/SOS/sos.api';
import type { SosStatus } from '@/types';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 12;

const statusVariants: Record<
  SosStatus,
  { label: string; tone: 'pending' | 'resolved' | 'ignored' }
> = {
  PENDING: { label: 'Pending', tone: 'pending' },
  RESOLVED: { label: 'Resolved', tone: 'resolved' },
  IGNORED: { label: 'Ignored', tone: 'ignored' },
};

const toneClasses: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  ignored: 'bg-muted text-muted-foreground border-border',
};

const SosReports = () => {
  const [statusFilter, setStatusFilter] = useState<SosStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAllSosQuery({
    page,
    limit: PAGE_SIZE,
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateSosStatusMutation();

  const reports = data?.data ?? [];
  const meta = data?.meta;

  const handleStatusChange = async (sosId: string, status: SosStatus) => {
    try {
      await updateStatus({ sosId, status }).unwrap();
      toast.success(`Marked as ${status.toLowerCase()}`);
    } catch (e) {
      const err = e as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Could not update status');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2'>
            <ShieldAlert className='w-6 h-6 text-destructive' />
            SOS reports
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Riders and drivers trigger SOS during active rides. Review each one
            and mark it resolved or ignored.
          </p>
        </div>
        <div className='w-full sm:w-48'>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as SosStatus | 'ALL');
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All statuses</SelectItem>
              <SelectItem value='PENDING'>Pending</SelectItem>
              <SelectItem value='RESOLVED'>Resolved</SelectItem>
              <SelectItem value='IGNORED'>Ignored</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-40 rounded-xl' />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className='rounded-xl border border-dashed border-border p-10 text-center bg-secondary/30'>
          <div className='mx-auto w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center mb-3'>
            <CheckCircle2 className='w-5 h-5 text-emerald-500' />
          </div>
          <p className='text-sm font-medium text-foreground'>
            No SOS reports here
          </p>
          <p className='text-xs text-muted-foreground'>
            {statusFilter === 'ALL'
              ? 'Nice and quiet for now.'
              : `No ${statusFilter.toLowerCase()} reports found.`}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-3 transition-opacity',
            isFetching && 'opacity-60 pointer-events-none'
          )}
        >
          {reports.map((r) => (
            <SosCard
              key={r._id}
              report={r}
              isUpdating={isUpdating}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className='flex items-center justify-between pt-2'>
          <p className='text-xs text-muted-foreground'>
            Page {meta.page} of {meta.totalPage} ·{' '}
            <span className='tabular-nums'>{meta.total}</span> reports
          </p>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className='w-4 h-4' />
              Prev
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setPage((p) => Math.min(meta.totalPage, p + 1))
              }
              disabled={page >= meta.totalPage}
            >
              Next
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function SosCard({
  report,
  isUpdating,
  onStatusChange,
}: {
  report: ISosReport;
  isUpdating: boolean;
  onStatusChange: (sosId: string, status: SosStatus) => void;
}) {
  const status = statusVariants[report.status];
  const sentAt = new Date(report.createdAt).toLocaleString();

  return (
    <article className='bg-card border border-border rounded-xl p-4 flex flex-col gap-3'>
      <header className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-2 min-w-0'>
          <span className='inline-flex w-9 h-9 rounded-md bg-destructive/10 text-destructive items-center justify-center shrink-0'>
            <AlertTriangle className='w-4 h-4' />
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-foreground truncate'>
              {report.sender?.name || 'Unknown sender'}
            </p>
            <p className='text-xs text-muted-foreground truncate'>
              {report.sender?.email}
            </p>
          </div>
        </div>
        <Badge
          variant='outline'
          className={cn('font-medium', toneClasses[status.tone])}
        >
          {status.label}
        </Badge>
      </header>

      <div className='space-y-2 text-sm'>
        {report.location && (
          <div className='flex items-start gap-2'>
            <MapPin className='w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0' />
            <span className='text-foreground break-words'>
              {report.location}
            </span>
          </div>
        )}
        {report.message && (
          <p className='text-foreground/90 italic'>"{report.message}"</p>
        )}
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Clock className='w-3 h-3' />
          {sentAt}
        </div>
        {report.ride && (
          <div className='text-xs text-muted-foreground'>
            Ride · {report.ride.pickupLocation?.split(',')[0]} →{' '}
            {report.ride.dropLocation?.split(',')[0]}
          </div>
        )}
        {report.contactEmails?.length > 0 && (
          <p className='text-xs text-muted-foreground'>
            Notified: {report.contactEmails.join(', ')}
          </p>
        )}
      </div>

      {report.status === 'PENDING' && (
        <div className='flex items-center gap-2 pt-1'>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => onStatusChange(report._id, 'RESOLVED')}
            disabled={isUpdating}
          >
            <CheckCircle2 className='w-3.5 h-3.5' /> Resolve
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='gap-1.5'
            onClick={() => onStatusChange(report._id, 'IGNORED')}
            disabled={isUpdating}
          >
            <XCircle className='w-3.5 h-3.5' /> Ignore
          </Button>
        </div>
      )}
    </article>
  );
}

export default SosReports;
