import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState, type FormEvent } from 'react';
import { IconChevronDown, IconChevronUp, IconMapPin, IconPlus } from '@tabler/icons-react';
import {
  useAddRescueReport,
  useRescueReports,
  useUpdateReportStatus,
} from '../data/use-rescue-reports';
import type { RescuePriority, RescueReport } from '@/lib/dexie';
import { Page, PageHeader, PageTitle, PageDescription } from '@/components/ui/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertBody } from '@/components/ui/alert';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { OfflineBadge, useOnlineStatus } from '@/components/ui/offline-badge';
import { cn } from '@/lib/utils';

const priorities: RescuePriority[] = ['critical', 'high', 'medium', 'low'];
const statuses: RescueReport['status'][] = ['new', 'triaged', 'responding', 'resolved'];

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
});

function ReportsPage() {
  const reportsQuery = useRescueReports();
  const addReport = useAddRescueReport();
  const updateStatus = useUpdateReportStatus();
  const reports = reportsQuery.data ?? [];
  const isOnline = useOnlineStatus();

  const [isFormOpen, setIsFormOpen] = useState(reports.length === 0);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const sortedReports = useMemo(() => {
    return [...reports].sort(
      (a, b) => priorityRank(a.priority) - priorityRank(b.priority) || b.createdAt - a.createdAt
    );
  }, [reports]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const form = new FormData(event.currentTarget);
    const formElement = event.currentTarget;
    const household = String(form.get('household') ?? '').trim();
    const location = String(form.get('location') ?? '').trim();
    const notes = String(form.get('notes') ?? '').trim();
    const priority = String(form.get('priority') ?? 'medium') as RescuePriority;
    const people = Number(form.get('people') ?? 1);

    if (!household || !location || !Number.isFinite(people) || people < 1) {
      setFormError('Punan ang lahat ng required fields. Fill in all required fields.');
      return;
    }

    addReport.mutate(
      { household, location, priority, people, notes },
      {
        onSuccess: () => {
          formElement.reset();
          setIsFormOpen(false);
        },
        onError: error => {
          setFormError(error instanceof Error ? error.message : 'Hindi nai-save. Could not save.');
        },
      }
    );
  }

  return (
    <Page width="wide" className="flex flex-col gap-8">
      <PageHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <PageTitle>Rescue queue</PageTitle>
            <PageDescription>
              File a new rescue report or work through the queue. All entries save to this device
              first and sync when online.
            </PageDescription>
          </div>
          <OfflineBadge showOnline />
        </div>
      </PageHeader>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-heading-lg text-foreground">Bagong Report · New report</h2>
          <Button
            size="lg"
            variant={isFormOpen ? 'secondary' : 'primary'}
            type="button"
            onClick={() => {
              setIsFormOpen(open => !open);
              setFormError(null);
            }}
            aria-expanded={isFormOpen}
            aria-controls="new-report-form"
          >
            {isFormOpen ? (
              <>
                <IconChevronUp aria-hidden="true" />
                Itago · Hide form
              </>
            ) : (
              <>
                <IconPlus aria-hidden="true" />
                Magdagdag · Add report
              </>
            )}
          </Button>
        </div>

        {isFormOpen ? (
          <Card asChild>
            <form id="new-report-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <CardHeader>
                <CardTitle>Mga detalye · Report details</CardTitle>
                <CardDescription>
                  One question at a time, biggest first. Saves locally even without signal.
                </CardDescription>
              </CardHeader>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Label htmlFor="household" className="sm:col-span-2">
                  Pangalan ng pamilya o tao · Requester or household
                  <Input id="household" name="household" required autoComplete="off" />
                </Label>
                <Label htmlFor="location" className="sm:col-span-2">
                  Lokasyon · Location
                  <Input
                    id="location"
                    name="location"
                    required
                    autoComplete="off"
                    placeholder="Address o landmark"
                  />
                </Label>
                <Label htmlFor="priority">
                  Antas · Priority
                  <Select id="priority" name="priority" defaultValue="medium" required>
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priorityLabel(priority)}
                      </option>
                    ))}
                  </Select>
                </Label>
                <Label htmlFor="people">
                  Ilan kayo? · People
                  <Input
                    id="people"
                    name="people"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    defaultValue={1}
                    required
                  />
                </Label>
                <Label htmlFor="notes" className="sm:col-span-2">
                  Karagdagang sabihin · Notes
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Halimbawa: matanda sa bahay, walang kuryente"
                  />
                </Label>
              </div>
              {formError ? (
                <Alert tone="danger">
                  <AlertBody>{formError}</AlertBody>
                </Alert>
              ) : null}
              {!isOnline ? (
                <Alert tone="signal">
                  <AlertBody>
                    Naka-offline ka — ise-save dito sa phone at ipapadala kapag may signal. Saved
                    locally; will send when online.
                  </AlertBody>
                </Alert>
              ) : null}
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={addReport.isPending}
                    loadingLabel="Ise-save..."
                  >
                    I-save ang report · Save report
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormError(null);
                    }}
                  >
                    Kanselahin · Cancel
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        ) : null}
      </section>

      <section aria-label="Queue" className="flex flex-col gap-3">
        <h2 className="text-heading-lg text-foreground">Queue · {sortedReports.length}</h2>
        {reportsQuery.isLoading ? (
          <p className="text-body-md text-muted-foreground">Loading reports.</p>
        ) : sortedReports.length === 0 ? (
          <p className="text-body-md text-muted-foreground">No reports yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sortedReports.map(report => (
              <ReportRow
                key={report.id}
                report={report}
                isExpanded={expandedReportId === report.id}
                onToggle={() =>
                  setExpandedReportId(current => (current === report.id ? null : report.id))
                }
                onStatusChange={status => updateStatus.mutate({ id: report.id, status })}
                isUpdating={updateStatus.isPending}
              />
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}

type ReportRowProps = {
  report: RescueReport;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: RescueReport['status']) => void;
  isUpdating: boolean;
};

function ReportRow({ report, isExpanded, onToggle, onStatusChange, isUpdating }: ReportRowProps) {
  return (
    <li
      className={cn(
        'rounded-md border bg-surface shadow-raised transition-colors duration-150',
        isExpanded && 'border-primary/40'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-4 px-4 py-3 text-left"
      >
        <PriorityBadge priority={report.priority} />
        <span className="flex min-w-0 flex-1 items-center gap-2 text-body-md text-foreground">
          <IconMapPin aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{report.location}</span>
        </span>
        <span className="hidden text-label-md text-muted-foreground sm:inline">
          {formatTimeSince(report.createdAt)}
        </span>
        <StatusBadge status={report.status} />
        <span className="text-muted-foreground" aria-hidden="true">
          {isExpanded ? (
            <IconChevronUp className="size-4" />
          ) : (
            <IconChevronDown className="size-4" />
          )}
        </span>
      </button>
      {isExpanded ? (
        <div className="flex flex-col gap-4 border-t bg-bg/40 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-label-md text-muted-foreground">
              Requester · {report.household}
            </span>
            <span className="text-label-md text-muted-foreground">People · {report.people}</span>
            <span className="text-label-md text-muted-foreground sm:hidden">
              Filed · {formatTimeSince(report.createdAt)} ago
            </span>
            {report.notes ? <p className="text-body-md text-foreground">{report.notes}</p> : null}
          </div>
          <Label htmlFor={`status-${report.id}`} className="sm:max-w-44">
            Status
            <Select
              id={`status-${report.id}`}
              value={report.status}
              disabled={isUpdating}
              onChange={event =>
                onStatusChange(event.currentTarget.value as RescueReport['status'])
              }
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </Select>
          </Label>
        </div>
      ) : null}
    </li>
  );
}

function priorityRank(priority: RescuePriority) {
  return priorities.indexOf(priority);
}

function priorityLabel(priority: RescuePriority) {
  return (
    {
      critical: 'Kritikal · Critical',
      high: 'Mataas · High',
      medium: 'Katamtaman · Medium',
      low: 'Mababa · Low',
    } satisfies Record<RescuePriority, string>
  )[priority];
}

function statusLabel(status: RescueReport['status']) {
  return (
    {
      new: 'Bago · New',
      triaged: 'Sinuri · Triaged',
      responding: 'Tumutugon · Responding',
      resolved: 'Tapos · Resolved',
    } satisfies Record<RescueReport['status'], string>
  )[status];
}

function formatTimeSince(timestamp: number) {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
