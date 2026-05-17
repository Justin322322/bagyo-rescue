import { Link, Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { Wordmark } from '@/components/brand/wordmark';
import { OfflineBadge } from '@/components/ui/offline-badge';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';
import { cn } from '@/lib/utils';

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => (
    <Page width="narrow" className="flex flex-col gap-6">
      <h1 className="text-display-lg text-foreground">Hindi mahanap ang pahina</h1>
      <p className="text-body-lg text-muted-foreground">
        Nawawala ang pahinang ito.
        <span className="block text-body-md">We couldn&rsquo;t find that page.</span>
      </p>
      <Button asChild size="lg" className="self-start">
        <Link to="/">Bumalik sa dashboard</Link>
      </Button>
    </Page>
  ),
});

const navItems = [
  { to: '/' as const, label: 'Dashboard' },
  { to: '/resident' as const, label: 'Resident' },
  { to: '/reports' as const, label: 'Reports' },
  { to: '/admin' as const, label: 'Admin' },
];

function RootLayout() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const isResidentRoute = pathname.startsWith('/resident');
  const visibleNav = isResidentRoute
    ? navItems.filter(item => item.to === '/' || item.to === '/resident')
    : navItems;

  return (
    <div className="min-h-dvh bg-bg text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            aria-label="Bagyo Rescue, bumalik sa dashboard"
            className="flex items-center"
          >
            <Wordmark />
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1">
            {visibleNav.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'inline-flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-label-md text-muted-foreground',
                  'hover:bg-muted hover:text-foreground'
                )}
                activeProps={{
                  className:
                    'inline-flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-label-md bg-primary-soft text-primary',
                }}
                activeOptions={{ exact: item.to === '/' }}
              >
                {item.label}
              </Link>
            ))}
            <OfflineBadge className="ml-2 hidden sm:inline-flex" />
          </nav>
        </div>
        <div className="mx-auto flex w-full max-w-screen-2xl justify-end px-4 pb-2 sm:hidden">
          <OfflineBadge />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
