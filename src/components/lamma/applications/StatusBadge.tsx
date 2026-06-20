'use client';
import { useTranslations } from 'next-intl';
import { Clock, CheckCircle2, XCircle, ListPlus, Calendar, UserX, Ban, FileEdit, Eye, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = string;

const config: Record<string, { icon: typeof Clock; className: string }> = {
  PENDING: { icon: Clock, className: 'bg-saffron/15 text-saffron border-saffron/30' },
  APPROVED: { icon: CheckCircle2, className: 'bg-success/15 text-success border-success/30' },
  REJECTED: { icon: XCircle, className: 'bg-error/15 text-error border-error/30' },
  WAITLISTED: { icon: ListPlus, className: 'bg-teal/15 text-teal border-teal/30' },
  ATTENDED: { icon: Calendar, className: 'bg-success/15 text-success border-success/30' },
  NO_SHOW: { icon: UserX, className: 'bg-stone/15 text-stone border-stone/30' },
  CANCELLED: { icon: Ban, className: 'bg-stone/15 text-stone border-stone/30' },
  DRAFT: { icon: FileEdit, className: 'bg-stone/15 text-stone border-stone/30' },
  PUBLISHED: { icon: Eye, className: 'bg-teal/15 text-teal border-teal/30' },
  APPLICATIONS_OPEN: { icon: Clock, className: 'bg-saffron/15 text-saffron border-saffron/30' },
  APPLICATIONS_CLOSED: { icon: Ban, className: 'bg-stone/15 text-stone border-stone/30' },
  IN_PROGRESS: { icon: Loader2, className: 'bg-success/15 text-success border-success/30' },
  COMPLETED: { icon: CheckCircle2, className: 'bg-success/15 text-success border-success/30' },
};

export function StatusBadge({ status, size = 'default' }: { status: Status; size?: 'sm' | 'default' }) {
  const t = useTranslations('application_status');
  const cfg = config[status] ?? config.PENDING;
  const { icon: Icon, className } = cfg;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border text-xs font-medium', className, size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1')}>
      <Icon className={size === 'sm' ? 'size-3' : 'size-3.5'} />
      {t(status as 'PENDING')}
    </span>
  );
}
