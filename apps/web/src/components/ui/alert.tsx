import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'flex w-full items-start gap-3 rounded-md border px-4 py-3 text-body-md',
  {
    variants: {
      tone: {
        info: 'border-border bg-primary-soft text-foreground [&_svg]:text-primary',
        safe: 'border-safe/30 bg-safe-soft text-foreground [&_svg]:text-safe',
        signal: 'border-signal/40 bg-signal-soft text-foreground [&_svg]:text-signal',
        danger: 'border-danger/40 bg-danger-soft text-foreground [&_svg]:text-danger',
      },
    },
    defaultVariants: {
      tone: 'info',
    },
  }
);

type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>;

function Alert({ className, tone, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      data-tone={tone ?? 'info'}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="alert-title"
      className={cn('text-label-md font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function AlertBody({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="alert-body"
      className={cn('text-body-md text-foreground', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertBody };
export type { AlertProps };
