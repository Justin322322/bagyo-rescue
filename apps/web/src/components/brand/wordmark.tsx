import * as React from 'react';
import { cn } from '@/lib/utils';

type WordmarkProps = React.ComponentProps<'span'> & {
  hideText?: boolean;
};

function Wordmark({ className, hideText = false, ...props }: WordmarkProps) {
  return (
    <span
      data-slot="wordmark"
      className={cn('inline-flex items-center gap-3 text-foreground', className)}
      {...props}
    >
      <ShieldWaveGlyph className="size-9 text-primary" aria-hidden="true" />
      <span className={cn('flex flex-col leading-none', hideText && 'sr-only')}>
        <span className="font-display text-heading-md font-bold tracking-tight">Bagyo Rescue</span>
        <span className="text-caption text-muted-foreground">Tulong sa Bagyo</span>
      </span>
    </span>
  );
}

function ShieldWaveGlyph({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="Bagyo Rescue shield"
      {...props}
    >
      <path d="M16 3 5 7v8c0 7 5 11 11 13 6-2 11-6 11-13V7l-11-4z" />
      <path d="M9 17c2-1.5 4-1.5 7 0s5 1.5 7 0" />
    </svg>
  );
}

export { Wordmark, ShieldWaveGlyph };
