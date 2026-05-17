import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { IconLoader2 } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
    'font-medium select-none rounded-md',
    'transition-colors duration-150 ease-out',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-60',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        danger:
          'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive',
        secondary:
          'border border-border-strong bg-surface text-foreground hover:bg-muted active:bg-muted/80',
        ghost: 'bg-transparent text-foreground hover:bg-muted active:bg-muted/80',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline px-0 h-auto',
      },
      size: {
        sm: 'h-9 px-3 text-label-md',
        md: 'h-11 px-4 text-body-md',
        lg: 'h-12 px-6 text-body-md rounded-lg',
        xl: 'min-h-24 px-8 py-6 text-display-2xl font-display rounded-lg',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    loadingLabel?: string;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  loadingLabel,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? 'primary'}
      data-size={size ?? 'md'}
      data-loading={isLoading || undefined}
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : (disabled ?? isLoading)}
      {...props}
    >
      {isLoading ? (
        <>
          <IconLoader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
