import * as React from 'react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

type CardProps = React.ComponentProps<'div'> & {
  asChild?: boolean;
};

function Card({ className, asChild = false, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      data-slot="card"
      className={cn(
        'flex flex-col gap-4 rounded-lg border bg-surface p-6 shadow-raised',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-header" className={cn('flex flex-col gap-1', className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-heading-md text-foreground', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-body-md text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-content" className={cn('flex flex-col gap-3', className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex flex-wrap items-center gap-3', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
