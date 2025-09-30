import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Users2,
  ListChecks,
  CheckCircle2,
  NotebookPen,
  type LucideIcon,
} from 'lucide-react';
import { useMemo } from 'react';

type TagSummaryProps = {
  isLoading: boolean;
  assignedCount: number;
  eligibleCount: number;
  openTaskCount: number;
  dueSoonCount: number;
  completedTaskCount: number;
  notesCount: number;
  lastActivityDate: Date | null;
};

type SummaryMetric = {
  key: string;
  title: string;
  value: number;
  subtext: string;
  accentClass: string;
  Icon: LucideIcon;
};

export function TagSummary({
  isLoading,
  assignedCount,
  eligibleCount,
  openTaskCount,
  dueSoonCount,
  completedTaskCount,
  notesCount,
  lastActivityDate,
}: TagSummaryProps) {
  const metrics = useMemo<SummaryMetric[]>(() => {
    const totalTasks = openTaskCount + completedTaskCount;
    const completionRate = totalTasks
      ? Math.round((completedTaskCount / totalTasks) * 100)
      : 0;
    const lastActivityText = lastActivityDate
      ? `Updated ${formatDistanceToNow(lastActivityDate, { addSuffix: true })}.`
      : 'Add notes or tasks to build more context.';

    return [
      {
        key: 'assigned',
        title: 'Assigned Contacts',
        value: assignedCount,
        subtext:
          eligibleCount > 0
            ? `${eligibleCount} contacts available to assign.`
            : assignedCount > 0
              ? 'All eligible contacts are already assigned.'
              : 'No contacts assigned yet.',
        accentClass: 'bg-sky-100 text-sky-700 border-sky-200',
        Icon: Users2,
      },
      {
        key: 'openTasks',
        title: 'Open Tasks',
        value: openTaskCount,
        subtext:
          openTaskCount > 0
            ? dueSoonCount > 0
              ? `${dueSoonCount} due within the next 7 days.`
              : 'No upcoming deadlines.'
            : 'No open tasks remaining.',
        accentClass: 'bg-amber-100 text-amber-700 border-amber-200',
        Icon: ListChecks,
      },
      {
        key: 'completedTasks',
        title: 'Completed Tasks',
        value: completedTaskCount,
        subtext: totalTasks
          ? `${completionRate}% of tasks completed.`
          : 'Track tasks to measure progress.',
        accentClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Icon: CheckCircle2,
      },
      {
        key: 'notes',
        title: 'Notes Logged',
        value: notesCount,
        subtext: lastActivityText,
        accentClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        Icon: NotebookPen,
      },
    ];
  }, [
    assignedCount,
    eligibleCount,
    openTaskCount,
    dueSoonCount,
    completedTaskCount,
    notesCount,
    lastActivityDate,
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ key, title, value, subtext, accentClass, Icon }) => (
        <Card key={key} className="border-border/70">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {title}
                </p>
                <div className="mt-2 text-3xl font-semibold text-foreground">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : value}
                </div>
              </div>
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full border',
                  accentClass,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {isLoading ? <Skeleton className="h-3 w-32" /> : subtext}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
