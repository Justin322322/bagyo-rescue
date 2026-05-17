import { Link, createFileRoute } from '@tanstack/react-router';
import { IconArrowRight } from '@tabler/icons-react';
import { CrmNavigation } from '@/features/crm/crm-crud-page';
import { crmRoutes } from '@/features/crm/crm-routes';
import { Page, PageHeader, PageTitle, PageDescription } from '@/components/ui/page';

export const Route = createFileRoute('/records/')({
  component: RecordsIndexPage,
});

function RecordsIndexPage() {
  return (
    <Page width="wide" className="flex flex-col gap-6">
      <PageHeader>
        <PageTitle>CRM workspace</PageTitle>
        <PageDescription>
          Browse, create, update, and delete operational records. Pick a module to start.
        </PageDescription>
      </PageHeader>

      <section
        aria-label="Data access routes"
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]"
      >
        <CrmNavigation />
        <section className="flex min-w-0 flex-col gap-4">
          <header className="flex flex-col gap-1 rounded-md border bg-surface p-5 shadow-raised">
            <span className="text-caption uppercase tracking-wide text-muted-foreground">
              Data modules
            </span>
            <h2 className="text-heading-lg text-foreground">Operational CRM tables</h2>
            <p className="text-body-md text-muted-foreground">
              Select a module to open its searchable table and record editor.
            </p>
          </header>

          <ul className="flex flex-col gap-2">
            {crmRoutes.map(route => (
              <li key={route.datasetId}>
                <Link
                  to={route.to}
                  className="flex min-h-18 items-center justify-between gap-4 rounded-md border bg-surface px-5 py-4 shadow-raised hover:border-primary/40"
                >
                  <span className="flex flex-col gap-1">
                    <strong className="text-body-lg font-semibold text-foreground">
                      {route.label}
                    </strong>
                    <small className="text-label-md text-muted-foreground">
                      {route.description}
                    </small>
                  </span>
                  <span className="inline-flex items-center gap-1 text-label-md font-semibold text-primary">
                    Open
                    <IconArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </Page>
  );
}
