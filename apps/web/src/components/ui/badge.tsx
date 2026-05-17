import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-caption font-medium uppercase tracking-wide',
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-muted-foreground',
        primary: 'bg-primary-soft text-primary',
        safe: 'bg-safe-soft text-safe',
        signal: 'bg-signal-soft text-signal',
        danger: 'bg-danger-soft text-danger',
      },
      solid: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { tone: 'primary', solid: true, class: 'bg-primary text-primary-foreground' },
      { tone: 'safe', solid: true, class: 'bg-safe text-white' },
      { tone: 'signal', solid: true, class: 'bg-signal text-text-on-signal' },
      { tone: 'danger', solid: true, class: 'bg-danger text-white' },
      { tone: 'neutral', solid: true, class: 'bg-foreground text-background' },
    ],
    defaultVariants: {
      tone: 'neutral',
      solid: false,
    },
  }
);

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

function Badge({ className, tone, solid, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-tone={tone ?? 'neutral'}
      className={cn(badgeVariants({ tone, solid }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
