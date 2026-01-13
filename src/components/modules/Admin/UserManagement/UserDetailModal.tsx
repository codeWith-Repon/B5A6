import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  ShieldCheck,
  CalendarDays,
  Fingerprint,
} from 'lucide-react';
import { format } from 'date-fns';
import type { IUser } from '@/types/user.types';

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IUser | null;
  isLoading?: boolean;
}

export function UserDetailModal({
  open,
  onOpenChange,
  data,
  isLoading,
}: UserDetailModalProps) {
  if (!data) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'INACTIVE':
        return 'bg-slate-500/10 text-slate-700 border-slate-200';
      case 'BLOCKED':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-125 max-h-[90vh] overflow-y-auto'>
        {isLoading && (
          <div className='flex justify-center items-center h-full absolute inset-0 z-50 backdrop-blur-sm bg-white/50 dark:bg-black/50'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            <UserPlus className='absolute size-5 text-primary opacity-65' />
          </div>
        )}

        <DialogHeader>
          <div className='flex items-center gap-2'>
            <DialogTitle>User Account Details</DialogTitle>
            <Badge variant='outline' className='text-[10px] font-mono'>
              ID: {data._id.slice(-6)}
            </Badge>
          </div>
          <DialogDescription>
            Full profile overview for {data.name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Header Profile Section */}
          <div className='flex flex-col items-center text-center gap-4 pb-6 border-b border-border'>
            <Avatar className='h-24 w-24 border-4 border-background shadow-xl'>
              <AvatarImage
                src={data.image}
                alt={data.name}
                className='object-cover'
              />
              <AvatarFallback className='text-2xl font-bold bg-primary/10 text-primary'>
                {getInitials(data.name)}
              </AvatarFallback>
            </Avatar>

            <div className='space-y-1'>
              <div className='flex items-center justify-center gap-2'>
                <h3 className='text-2xl font-bold text-foreground'>
                  {data.name}
                </h3>
                {data.isVerified && (
                  <span className='flex items-center gap-1'>
                    <ShieldCheck className='w-5 h-5 text-blue-500 ' />
                    Verified
                  </span>
                )}
              </div>
              <p className='text-sm text-muted-foreground'>{data.email}</p>
            </div>

            <div className='flex gap-2 flex-wrap justify-center'>
              <Badge className={`border ${getStatusColor(data.isActive)}`}>
                <span className='flex items-center gap-1 capitalize'>
                  <CheckCircle2 className='w-3 h-3' />
                  {data.isActive.toLowerCase()}
                </span>
              </Badge>
              <Badge variant='secondary' className='capitalize'>
                {data.role.toLowerCase()}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <div className='grid grid-cols-1 gap-4'>
            <h4 className='text-sm font-semibold text-foreground/70 flex items-center gap-2 uppercase tracking-wider'>
              <Fingerprint className='w-4 h-4' /> Basic Information
            </h4>
            <div className='bg-muted/30 rounded-xl p-4 space-y-3'>
              <div className='flex items-center gap-3 text-sm'>
                <div className='p-2 bg-background rounded-lg border'>
                  <Mail className='w-4 h-4 text-primary' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-[10px] text-muted-foreground uppercase'>
                    Email
                  </span>
                  <span className='font-medium'>{data.email}</span>
                </div>
              </div>

              {data.phone && (
                <div className='flex items-center gap-3 text-sm'>
                  <div className='p-2 bg-background rounded-lg border'>
                    <Phone className='w-4 h-4 text-primary' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[10px] text-muted-foreground uppercase'>
                      Phone
                    </span>
                    <span className='font-medium'>{data.phone}</span>
                  </div>
                </div>
              )}

              {data.address && (
                <div className='flex items-center gap-3 text-sm'>
                  <div className='p-2 bg-background rounded-lg border'>
                    <MapPin className='w-4 h-4 text-primary' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[10px] text-muted-foreground uppercase'>
                      Address
                    </span>
                    <span className='font-medium'>{data.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contacts */}
          {data.emergencyContactEmail &&
            data.emergencyContactEmail.length > 0 && (
              <div className='bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4'>
                <h4 className='font-semibold text-amber-900 dark:text-amber-400 mb-3 text-sm flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4' />
                  Emergency Contact
                </h4>
                <div className='space-y-2'>
                  {data.emergencyContactEmail.map((email, idx) => (
                    <div key={idx} className='flex items-center gap-2 text-sm'>
                      <a
                        href={`mailto:${email}`}
                        className='text-amber-700 dark:text-amber-300 hover:underline font-medium truncate'
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Account Metadata */}
          <div className='grid grid-cols-2 gap-3 pt-4 border-t border-border text-xs'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <CalendarDays className='w-4 h-4' />
              <span>Joined {format(new Date(data.createdAt), 'MMM yyyy')}</span>
            </div>
            <div className='flex items-center gap-2 text-muted-foreground justify-end'>
              <span className='italic'>
                Last updated: {format(new Date(data.updatedAt), 'dd/MM/yy')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
