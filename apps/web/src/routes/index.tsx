import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { IconAlertTriangleFilled, IconClockHour4, IconShieldCheck } from '@tabler/icons-react';
import { useRescueReports } from '../data/use-rescue-reports';
import { Page, PageHeader, PageTitle, PageDescription } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  const reportsQuery = useRescueReports();
  const reports = reportsQuery.data ?? [];

  const summary = useMemo(() => {
    return reports.reduce(
      (totals, report) => {
        totals.people += report.people;
        totals[report.priority] += 1;
        totals[report.status] += 1;
        return totals;
      },
      {
        people: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        new: 0,
        triaged: 0,
        responding: 0,
        resolved: 0,
      }
    );
  }, [reports]);

  const newCount = summary.new;
  const inProgress = summary.triaged + summary.responding;
  const resolvedCount = summary.resolved;
  const urgent = summary.critical + summary.high;

  return (
    <Page className="flex flex-col gap-8">
      <PageHeader>
        <PageTitle>Coordinator dashboard</PageTitle>
        <PageDescription>
          A live count of rescue requests waiting on your team. Plain numbers, plain words.
        </PageDescription>
      </PageHeader>

      <section aria-label="Rescue report summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          tone="danger"
          icon={<IconAlertTriangleFilled aria-hidden="true" />}
          headline={String(newCount)}
          primary="Bagong Report"
          secondary="New requests that no one has triaged yet."
        />
        <MetricCard
          tone="signal"
          icon={<IconClockHour4 aria-hidden="true" />}
          headline={String(inProgress)}
          primary="Ginagawa"
          secondary="Triaged or in active response."
        />
        <MetricCard
          tone="safe"
          icon={<IconShieldCheck aria-hidden="true" />}
          headline={String(resolvedCount)}
          primary="Tapos"
          secondary="Rescue confirmed complete."
        />
      </section>

      <section aria-label="At a glance" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SmallStat label="Total reports" value={String(reports.length)} />
        <SmallStat label="Urgent (critical + high)" value={String(urgent)} />
        <SmallStat label="People affected" value={String(summary.people)} />
        <SmallStat
          label="Sync state"
          value={reportsQuery.isFetching ? 'Refreshing' : 'Up to date'}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Open the rescue queue</CardTitle>
            <CardDescription>Add a new report or work through the queue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="self-start">
              <Link to="/reports">Go to reports</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage contact records</CardTitle>
            <CardDescription>LGU, barangay, family, and contact records.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" variant="secondary" className="self-start">
              <Link to="/admin">Open admin</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </Page>
  );
}

type MetricCardProps = {
  tone: 'danger' | 'signal' | 'safe';
  icon: React.ReactNode;
  headline: string;
  primary: string;
  secondary: string;
};

const toneStyles: Record<MetricCardProps['tone'], string> = {
  danger: 'border-danger/30 bg-danger-soft [&_[data-slot=metric-icon]]:text-danger',
  signal: 'border-signal/40 bg-signal-soft [&_[data-slot=metric-icon]]:text-signal',
  safe: 'border-safe/30 bg-safe-soft [&_[data-slot=metric-icon]]:text-safe',
};

function MetricCard({ tone, icon, headline, primary, secondary }: MetricCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-lg border bg-surface p-6 shadow-raised',
        toneStyles[tone]
      )}
    >
      <span data-slot="metric-icon" className="inline-flex size-9 items-center justify-center">
        {icon}
      </span>
      <span className="font-display text-display-lg text-foreground">{headline}</span>
      <div className="flex flex-col gap-1">
        <span className="text-body-lg font-semibold text-foreground">{primary}</span>
        <span className="text-body-md text-muted-foreground">{secondary}</span>
      </div>
    </article>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <article className="flex flex-col gap-1 rounded-md border bg-surface p-4 shadow-raised">
      <span className="text-heading-md font-semibold text-foreground">{value}</span>
      <span className="text-label-md text-muted-foreground">{label}</span>
    </article>
  );
}
