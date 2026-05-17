import * as React from 'react';
import { cn } from '@/lib/utils';

type Priority = 'critical' | 'high' | 'medium' | 'low';

type PriorityBadgeProps = React.ComponentProps<'span'> & {
  priority: Priority;
};

const priorityClassName: Record<Priority, string> = {
  critical: 'bg-priority-critical text-white',
  high: 'bg-priority-high text-text-on-signal',
  medium: 'bg-priority-medium text-white',
  low: 'bg-priority-low text-foreground',
};

const priorityLabel: Record<Priority, { tl: string; en: string }> = {
  critical: { tl: 'Kritikal', en: 'Critical' },
  high: { tl: 'Mataas', en: 'High' },
  medium: { tl: 'Katamtaman', en: 'Medium' },
  low: { tl: 'Mababa', en: 'Low' },
};

function PriorityBadge({ priority, className, ...props }: PriorityBadgeProps) {
  const label = priorityLabel[priority];

  return (
    <span
      data-slot="priority-badge"
      data-priority={priority}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-caption font-semibold uppercase tracking-wide',
        priorityClassName[priority],
        className
      )}
      title={`${label.tl} (${label.en})`}
      {...props}
    >
      {label.en}
    </span>
  );
}

export { PriorityBadge };
export type { Priority };
