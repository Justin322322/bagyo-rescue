import * as React from 'react';
import { cn } from '@/lib/utils';

type Status = 'new' | 'triaged' | 'responding' | 'resolved';

type StatusBadgeProps = React.ComponentProps<'span'> & {
  status: Status;
};

const statusClassName: Record<Status, string> = {
  new: 'border-status-new text-status-new bg-primary-soft',
  triaged: 'border-status-triaged text-status-triaged bg-signal-soft',
  responding: 'border-status-responding text-status-responding bg-primary-soft',
  resolved: 'border-status-resolved text-status-resolved bg-safe-soft',
};

const statusLabel: Record<Status, { tl: string; en: string }> = {
  new: { tl: 'Bago', en: 'New' },
  triaged: { tl: 'Sinuri', en: 'Triaged' },
  responding: { tl: 'Tumutugon', en: 'Responding' },
  resolved: { tl: 'Tapos', en: 'Resolved' },
};

function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const label = statusLabel[status];

  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-caption font-semibold uppercase tracking-wide',
        statusClassName[status],
        className
      )}
      title={`${label.tl} (${label.en})`}
      {...props}
    >
      {label.en}
    </span>
  );
}

export { StatusBadge };
export type { Status };
