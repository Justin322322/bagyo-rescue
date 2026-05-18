import * as React from 'react';
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconWifiOff,
  IconX,
  type Icon,
} from '@tabler/icons-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  [
    'pointer-events-auto flex min-h-12 w-full max-w-md items-start gap-3 rounded-md border bg-surface px-4 py-3',
    'text-label-md text-foreground shadow-[0_10px_30px_rgba(15,23,42,0.12)]',
  ].join(' '),
  {
    variants: {
      tone: {
        info: 'border-border [&_[data-slot=toast-icon]]:bg-primary-soft [&_[data-slot=toast-icon]]:text-primary',
        safe: 'border-border [&_[data-slot=toast-icon]]:bg-safe-soft [&_[data-slot=toast-icon]]:text-safe',
        signal:
          'border-border [&_[data-slot=toast-icon]]:bg-signal-soft [&_[data-slot=toast-icon]]:text-signal',
        danger:
          'border-border [&_[data-slot=toast-icon]]:bg-danger-soft [&_[data-slot=toast-icon]]:text-danger',
      },
    },
    defaultVariants: {
      tone: 'info',
    },
  }
);

const toastIconByTone = {
  info: IconInfoCircle,
  safe: IconCheck,
  signal: IconWifiOff,
  danger: IconAlertTriangle,
} satisfies Record<NonNullable<VariantProps<typeof toastVariants>['tone']>, Icon>;

type ToastProps = React.ComponentProps<'div'> & VariantProps<typeof toastVariants>;

function Toast({ className, tone, children, ...props }: ToastProps) {
  const resolvedTone = tone ?? 'info';
  const ToastIcon = toastIconByTone[resolvedTone];

  return (
    <div
      role={resolvedTone === 'danger' ? 'alert' : 'status'}
      data-slot="toast"
      data-tone={resolvedTone}
      className={cn(toastVariants({ tone: resolvedTone }), className)}
      {...props}
    >
      <span
        data-slot="toast-icon"
        aria-hidden="true"
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
      >
        <ToastIcon className="size-3.5" />
      </span>
      <div className="flex min-w-0 flex-1 items-start gap-3">{children}</div>
    </div>
  );
}

function ToastBody({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="toast-body"
      className={cn('min-w-0 flex-1 text-label-md leading-5 text-foreground', className)}
      {...props}
    />
  );
}

function ToastClose({ className, type = 'button', ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type={type}
      data-slot="toast-close"
      className={cn(
        '-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    >
      <IconX className="size-4" aria-hidden="true" />
      <span className="sr-only">Dismiss</span>
    </button>
  );
}

export { Toast, ToastBody, ToastClose };
export type { ToastProps };
