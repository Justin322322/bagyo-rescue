import { useEffect, useState } from 'react';
import { IconCloudOff, IconCloudCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

type OfflineBadgeProps = {
  className?: string;
  /** When false, the badge stays hidden while online. Default true so coordinators can see "online" too. */
  showOnline?: boolean;
};

function OfflineBadge({ className, showOnline = false }: OfflineBadgeProps) {
  const isOnline = useOnlineStatus();

  if (isOnline && !showOnline) return null;

  return (
    <span
      role="status"
      aria-live="polite"
      data-online={isOnline}
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-label-md',
        isOnline
          ? 'bg-safe-soft text-safe border border-safe/30'
          : 'bg-signal-soft text-text-on-signal border border-signal/40',
        className
      )}
    >
      {isOnline ? (
        <IconCloudCheck className="size-4" aria-hidden="true" />
      ) : (
        <IconCloudOff className="size-4" aria-hidden="true" />
      )}
      <span className="flex flex-col leading-tight">
        <span className="font-semibold">{isOnline ? 'May signal' : 'Naka-offline'}</span>
        <span className="text-caption text-muted-foreground">
          {isOnline ? 'Online' : 'Ipapadala kapag may signal'}
        </span>
      </span>
    </span>
  );
}

export { OfflineBadge, useOnlineStatus };
