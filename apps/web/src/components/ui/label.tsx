import * as React from 'react';
import { cn } from '@/lib/utils';

type LabelProps = React.ComponentProps<'label'> & {
  hint?: React.ReactNode;
};

function Label({ className, children, hint, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn('flex flex-col gap-2 text-label-md text-foreground', className)}
      {...props}
    >
      <span className="flex items-baseline justify-between gap-3">
        <span>{children}</span>
        {hint ? <span className="text-caption text-muted-foreground">{hint}</span> : null}
      </span>
    </label>
  );
}

function BilingualLabel({
  className,
  primary,
  secondary,
  ...props
}: React.ComponentProps<'span'> & { primary: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <span data-slot="bilingual-label" className={cn('flex flex-col gap-0.5', className)} {...props}>
      <span className="text-body-lg text-foreground">{primary}</span>
      {secondary ? <span className="text-label-md text-muted-foreground">{secondary}</span> : null}
    </span>
  );
}

export { Label, BilingualLabel };
